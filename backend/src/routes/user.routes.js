/**
 * Base URL: /api/v1/users
 *
 * GET   /doctor/analytics - Get personal analytics (Doctors only)
 * PATCH /profile          - Update own profile (name/email)
 * PATCH /change-password   - Update own password
 * GET   /                 - List all users in clinic (Admin only)
 * GET   /:id              - Get user by ID (Admin/Owner only)
 */

const { Router } = require("express");
const {
  getAllUsers,
  getUserById,
  updateProfile,
  changePassword,
  getDoctorAnalytics,
} = require("../controllers/user.controller");
const {
  authenticate,
  authorize,
  authorizeOwner,
} = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  updateProfileSchema,
  changePasswordSchema,
} = require("../validators/user.validator");
const { ROLES } = require("../constants");

const router = Router();

// ── All routes below require authentication ──
router.use(authenticate);

// ── Personal Analytics ──

// @route   GET /api/v1/users/doctor/analytics
// @desc    Retrieve personal performance stats for a Doctor
// @access  DOCTOR
router.get("/doctor/analytics", authorize(ROLES.DOCTOR), getDoctorAnalytics);

// ── Self Management ──

// @route   PATCH /api/v1/users/profile
// @desc    Update current user's profile information
// @body    { "name": "New Name", "email": "newemail@example.com" }
router.patch("/profile", validate(updateProfileSchema), updateProfile);

// @route   PATCH /api/v1/users/change-password
// @desc    Securly update current user's password
// @body    { "currentPassword": "OLD", "newPassword": "NEW", "confirmPassword": "NEW" }
router.patch(
  "/change-password",
  validate(changePasswordSchema),
  changePassword,
);

// ── Directory Access ──

// @route   GET /api/v1/users
// @desc    List all staff members associated with the clinic
// @access  ADMIN
router.get("/", authorize(ROLES.ADMIN), getAllUsers);

// @route   GET /api/v1/users/:id
// @desc    Get detailed staff user account by ID
// @access  ADMIN, AUTH_OWNER
router.get("/:id", authorizeOwner, getUserById);

module.exports = router;
