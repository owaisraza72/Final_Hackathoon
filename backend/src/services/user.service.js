const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../config/cloudinary.config");

class UserService {
  /**
   * Get all users (Admin only)
   */
  async getAllUsers(query = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      sort = "-createdAt",
    } = query;

    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    return {
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }
    return user;
  }

  /**
   * Update user profile (own data)
   */
  async updateProfile(userId, updateData) {
    // Check if email already taken by another user
    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Email already in use");
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    return user;
  }

  /**
   * Upload/Update avatar
   */
  async updateAvatar(userId, fileBuffer) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    // Delete old avatar from Cloudinary if exists
    if (user.avatar?.public_id) {
      await deleteFromCloudinary(user.avatar.public_id);
    }

    // Upload new avatar
    const result = await uploadToCloudinary(fileBuffer, "mern-boilerplate/avatars");

    user.avatar = {
      public_id: result.public_id,
      url: result.url,
    };
    await user.save({ validateBeforeSave: false });

    return user;
  }

  /**
   * Remove avatar
   */
  async removeAvatar(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    if (user.avatar?.public_id) {
      await deleteFromCloudinary(user.avatar.public_id);
    }

    user.avatar = { public_id: "", url: "" };
    await user.save({ validateBeforeSave: false });

    return user;
  }

  /**
   * Change password
   */
  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Current password is incorrect");
    }

    user.password = newPassword;
    user.refreshToken = undefined; // Invalidate all sessions
    await user.save();

    return user;
  }

  /**
   * Update user role (Admin only)
   */
  async updateUserRole(userId, role) {
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    return user;
  }

  /**
   * Soft delete user (deactivate)
   */
  async deactivateUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false, refreshToken: undefined },
      { new: true }
    );

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    return user;
  }

  /**
   * Hard delete user (Admin only)
   */
  async deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    // Delete avatar from Cloudinary
    if (user.avatar?.public_id) {
      await deleteFromCloudinary(user.avatar.public_id);
    }

    await User.findByIdAndDelete(userId);
    return { message: "User permanently deleted" };
  }
}

module.exports = new UserService();