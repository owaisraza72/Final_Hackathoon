// controllers/admin.controller.js
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { HTTP_STATUS } = require("../constants");
const adminService = require("../services/admin.service");

class AdminController {
  // ── POST /api/v1/admin/create ──
  createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const clinicId = req.user.clinicId; // Admin's own clinic

    const user = await adminService.createUser({
      name,
      email,
      password,
      role,
      clinicId,
    });

    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          { user },
          "User created successfully",
        ),
      );
  });

  // ── GET /api/v1/admin/list/:role ──
  listUsers = asyncHandler(async (req, res) => {
    const role = req.params.role.toUpperCase();
    const clinicId = req.user.clinicId;

    const users = await adminService.listUsersByRole(role, clinicId);

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

  // ── PATCH /api/v1/admin/update/:id ──
  updateUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    const updatedUser = await adminService.updateUser(id, updateData);

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

  // ── DELETE /api/v1/admin/delete/:id ──
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
    const clinicId = req.user.clinicId;

    const data = await adminService.getAnalytics(clinicId);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, data, "Analytics fetched successfully"),
      );
  });

  // ── PATCH /api/v1/admin/subscription ──
  updateSubscription = asyncHandler(async (req, res) => {
    const clinicId = req.user.clinicId;
    const { plan } = req.body;

    const clinic = await adminService.updateClinicPlan(clinicId, plan);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { clinic },
          "Subscription plan updated successfully",
        ),
      );
  });
}

module.exports = new AdminController();
