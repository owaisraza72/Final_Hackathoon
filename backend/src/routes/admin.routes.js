// routes/admin.routes.js
const { Router } = require("express");
const adminController = require("../controllers/admin.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { ROLES } = require("../constants");

const router = Router();

// All admin routes require auth + ADMIN role
router.use(authenticate, authorize(ROLES.ADMIN));

// ── User Management ──
router.post("/create", adminController.createUser); // Create doctor/receptionist
router.get("/list/:role", adminController.listUsers); // List users by role
router.patch("/update/:id", adminController.updateUser); // Update user
router.delete("/delete/:id", adminController.deleteUser); // Deactivate user

// ── Analytics ──
router.get("/analytics", adminController.analytics); // Dashboard analytics

// ── Subscription Management ──
router.patch("/subscription", adminController.updateSubscription); // Upgrade/downgrade plan

module.exports = router;
