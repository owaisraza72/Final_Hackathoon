const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, ROLES } = require("../constants");
const Patient = require("../models/patient.model");
const Prescription = require("../models/prescription.model");

class UserService {
  /**
   * Get all users (associated with an admin)
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
      .limit(parseInt(limit))
      .select("-password -refreshToken");

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
   * Update user profile
   */
  async updateProfile(userId, updateData) {
    // Prevent sensitive field updates
    delete updateData.role;
    delete updateData.subscriptionPlan;
    delete updateData.createdBy;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

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
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Current password is incorrect",
      );
    }

    user.password = newPassword;
    user.refreshToken = undefined;

    await user.save();

    return user;
  }

  /**
   * Get Doctor Personal Analytics
   */
  async getDoctorAnalytics(doctorId) {
    const [prescriptionsCount, patientsTreated] = await Promise.all([
      Prescription.countDocuments({ doctorId }),
      Prescription.distinct("patientId", { doctorId }).then(
        (res) => res.length,
      ),
    ]);

    return {
      totalPrescriptions: prescriptionsCount,
      totalPatientsTreated: patientsTreated,
    };
  }
}

module.exports = new UserService();
