// controllers/admin.controller.js
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { HTTP_STATUS } = require("../constants");
const adminService = require("../services/admin.service");

class AdminController {
  // ── POST /api/v1/admin/users ──
  createUser = asyncHandler(async (req, res) => {
    const user = await adminService.createUser(req.body);

    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          { user },
          "Doctor/Receptionist created successfully",
        ),
      );
  });

  // ── GET /api/v1/admin/users/:role ──
  listUsers = asyncHandler(async (req, res) => {
    const role = req.params.role.toUpperCase();

    const users = await adminService.listUsersByRole(role);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { users, count: users.length },
          "Users fetched",
        ),
      );
  });

  // ── PATCH /api/v1/admin/users/:id ──
  updateUser = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const updatedUser = await adminService.updateUser(id, req.body);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { user: updatedUser },
          "User updated successfully",
        ),
      );
  });

  // ── DELETE /api/v1/admin/users/:id ──
  deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const result = await adminService.deleteUser(id);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          "User deactivated successfully",
        ),
      );
  });

  // ── GET /api/v1/admin/analytics ──
  analytics = asyncHandler(async (req, res) => {
    const adminId = req.user._id;

    const data = await adminService.getAnalytics(adminId);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, data, "Analytics fetched successfully"),
      );
  });

  // ── PATCH /api/v1/admin/settings ──
  updateSettings = asyncHandler(async (req, res) => {
    const adminId = req.user._id;

    const admin = await adminService.updateSettings(adminId, req.body);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { user: admin },
          "Clinic settings updated successfully",
        ),
      );
  });
}

module.exports = new AdminController();
