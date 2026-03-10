/**
 * Base URL: /api/v1/admin
 *
 * GET    /users/:role   - List users by role (Doctor/Receptionist)
 * POST   /users         - Create new Doctor/Receptionist
 * PATCH  /users/:id     - Update user details
 * DELETE /users/:id     - Deactivate user
 * GET    /analytics     - Get admin dashboard analytics
 * PATCH  /subscription  - Update subscription plan
 */

const { Router } = require("express");
const adminController = require("../controllers/admin.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { ROLES } = require("../constants");

const router = Router();

// All admin routes require authentication
router.use(authenticate);

// ── Shared User Management (Admin + Receptionist can list doctors) ──

// @route   GET /api/v1/admin/users/:role
// @params  role: 'DOCTOR' or 'RECEPTIONIST'
// @access  ADMIN, RECEPTIONIST
router.get(
  "/users/:role",
  authorize(ROLES.ADMIN, ROLES.RECEPTIONIST),
  adminController.listUsers,
);

// ── Protected Admin Only Routes ──
router.use(authorize(ROLES.ADMIN));

// @route   POST /api/v1/admin/users
// @desc    Admin creates a Doctor or Receptionist
// @body    { "name": "Dr. Smith", "email": "smith@clinic.com", "role": "DOCTOR", "password": "OptionalPassword" }
router.post("/users", adminController.createUser);

// @route   PATCH /api/v1/admin/users/:id
// @desc    Update Doctor or Receptionist data
// @body    { "name": "Dr. Updated Smith", "isActive": true }
router.patch("/users/:id", adminController.updateUser);

// @route   DELETE /api/v1/admin/users/:id
// @desc    Deactivate a user account (Soft delete)
router.delete("/users/:id", adminController.deleteUser);

// @route   GET /api/v1/admin/analytics
// @desc    Get dashboard analytics for the clinic
router.get("/analytics", adminController.analytics);
// @route   PATCH /api/v1/admin/settings
// @desc    Update Clinic Name or Subscription Plan
// @body    { "plan": "PRO", "clinicName": "Updated Clinic" }
router.patch("/settings", adminController.updateSettings);

module.exports = router;
