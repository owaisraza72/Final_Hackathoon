// routes/appointment.routes.js
const { Router } = require("express");
const appointmentController = require("../controllers/appointment.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  bookAppointmentSchema,
  updateStatusSchema,
} = require("../validators/appointment.validator");
const { ROLES } = require("../constants");

const router = Router();

// All appointment routes require authentication
router.use(authenticate);

// ── List all appointments (Doctor restricted to own, Admin/Receptionist see all) ──
router.get(
  "/",
  authorize(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.PATIENT),
  appointmentController.listAppointments,
);

// ── Get daily schedule for receptionist ──
router.get(
  "/schedule",
  authorize(ROLES.RECEPTIONIST, ROLES.ADMIN),
  appointmentController.getDailySchedule,
);

// ── POST / — Book new appointment (Receptionist only, with Zod validation) ──
router.post(
  "/",
  authorize(ROLES.RECEPTIONIST, ROLES.ADMIN),
  validate(bookAppointmentSchema),
  appointmentController.bookAppointment,
);

// ── PATCH /:id/status — Status changes with Zod validation ──
router.patch(
  "/:id/status",
  authorize(ROLES.DOCTOR, ROLES.ADMIN),
  validate(updateStatusSchema),
  appointmentController.updateStatus,
);

// ── DELETE /:id — Cancel appointment (Receptionist/Admin) ──
router.delete(
  "/:id",
  authorize(ROLES.RECEPTIONIST, ROLES.ADMIN),
  appointmentController.cancelAppointment,
);

module.exports = router;
