const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const userService = require("../services/user.service");
const { HTTP_STATUS, ROLES } = require("../constants");

/**
 * Get all users associated with this admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const result = await userService.getAllUsers(req.query);

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, result, "Users fetched successfully"),
    );
});

/**
 * Get user by ID
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, { user }, "User fetched successfully"),
    );
});

/**
 * Update own profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, { user }, "Profile updated successfully"),
    );
});

/**
 * Change own password
 */
const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user._id, req.body);

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, null, "Password changed successfully"),
    );
});

/**
 * Get Doctor Personal Analytics
 */
const getDoctorAnalytics = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.DOCTOR) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Only doctors can access personal analytics",
    );
  }

  const analytics = await userService.getDoctorAnalytics(req.user._id);

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        analytics,
        "Doctor analytics fetched successfully",
      ),
    );
});

module.exports = {
  getAllUsers,
  getUserById,
  updateProfile,
  changePassword,
  getDoctorAnalytics,
};
