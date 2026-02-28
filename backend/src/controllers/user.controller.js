const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const userService = require("../services/user.service");
const { HTTP_STATUS } = require("../constants");

// ─────────────────────────────────────────
// @desc    Get all users (with pagination/search)
// @route   GET /api/v1/users
// @access  Admin
// ─────────────────────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {
  const result = await userService.getAllUsers(req.query);

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, result, "Users fetched successfully")
    );
});

// ─────────────────────────────────────────
// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Private (own data) / Admin (any)
// ─────────────────────────────────────────
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, { user }, "User fetched successfully")
    );
});

// ─────────────────────────────────────────
// @desc    Update own profile
// @route   PATCH /api/v1/users/:id/profile
// @access  Private (own data) / Admin (any)
// ─────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.params.id, req.body);

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, { user }, "Profile updated successfully")
    );
});

// ─────────────────────────────────────────
// @desc    Upload/Update avatar
// @route   PATCH /api/v1/users/:id/avatar
// @access  Private (own data) / Admin (any)
// ─────────────────────────────────────────
const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Please upload an image file");
  }

  const user = await userService.updateAvatar(req.params.id, req.file.buffer);

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, { user }, "Avatar updated successfully")
    );
});

// ─────────────────────────────────────────
// @desc    Remove avatar
// @route   DELETE /api/v1/users/:id/avatar
// @access  Private (own data) / Admin (any)
// ─────────────────────────────────────────
const removeAvatar = asyncHandler(async (req, res) => {
  const user = await userService.removeAvatar(req.params.id);

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, { user }, "Avatar removed successfully")
    );
});

// ─────────────────────────────────────────
// @desc    Change password
// @route   PATCH /api/v1/users/:id/change-password
// @access  Private (own data only)
// ─────────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.params.id, req.body);

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        null,
        "Password changed successfully. Please login again."
      )
    );
});

// ─────────────────────────────────────────
// @desc    Update user role
// @route   PATCH /api/v1/users/:id/role
// @access  Admin only
// ─────────────────────────────────────────
const updateUserRole = asyncHandler(async (req, res) => {
  // Prevent admin from changing own role
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "You cannot change your own role"
    );
  }

  const user = await userService.updateUserRole(req.params.id, req.body.role);

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, { user }, "User role updated successfully")
    );
});

// ─────────────────────────────────────────
// @desc    Deactivate own account (soft delete)
// @route   PATCH /api/v1/users/:id/deactivate
// @access  Private (own data) / Admin (any)
// ─────────────────────────────────────────
const deactivateUser = asyncHandler(async (req, res) => {
  await userService.deactivateUser(req.params.id);

  // Clear cookies if user deactivated their own account
  if (req.params.id === req.user._id.toString()) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 0,
    };
    res.cookie("accessToken", "", cookieOptions);
    res.cookie("refreshToken", "", cookieOptions);
  }

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, null, "Account deactivated successfully")
    );
});

// ─────────────────────────────────────────
// @desc    Delete user permanently
// @route   DELETE /api/v1/users/:id
// @access  Admin only
// ─────────────────────────────────────────
const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "You cannot delete your own account from here"
    );
  }

  await userService.deleteUser(req.params.id);

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, null, "User deleted permanently")
    );
});

module.exports = {
  getAllUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  removeAvatar,
  changePassword,
  updateUserRole,
  deactivateUser,
  deleteUser,
};