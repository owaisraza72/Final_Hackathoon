/**
 * Base URL: /api/v1/appointments
 *
 * GET    /           - List all appointments
 * GET    /schedule   - Get daily schedule
 * POST   /           - Book new appointment
 * PATCH  /:id/status - Update appointment status
 * DELETE /:id        - Cancel appointment
 */

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
const { attachAdmin } = require("../middlewares/subscription.middleware");

const router = Router();

// All appointment routes require authentication
router.use(authenticate);

// All appointment routes need context of the Admin account
router.use(attachAdmin);

// ── List Appointments ──
// @route   GET /api/v1/appointments
// @desc    List all appointments for the clinic (Filters for doctors)
// @query   ?page=1&limit=10
router.get(
  "/",
  authorize(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.PATIENT),
  appointmentController.listAppointments,
);

// ── Daily Schedule ──
// @route   GET /api/v1/appointments/schedule
// @desc    Get appointments for a specific day
// @query   ?date=2024-03-01&doctorId=ID
router.get(
  "/schedule",
  authorize(ROLES.RECEPTIONIST, ROLES.ADMIN),
  appointmentController.getDailySchedule,
);

// ── New Booking ──
// @route   POST /api/v1/appointments
// @desc    Book a patient appointment
// @body    { "patientId": "ID", "doctorId": "ID", "date": "2024-03-01", "timeSlot": "10:00 AM" }
router.post(
  "/",
  authorize(ROLES.RECEPTIONIST, ROLES.ADMIN),
  validate(bookAppointmentSchema),
  appointmentController.bookAppointment,
);

// ── Update Status ──
// @route   PATCH /api/v1/appointments/:id/status
// @desc    Update status (e.g., booked, cancelled, checked-in)
// @body    { "status": "completed" }
router.patch(
  "/:id/status",
  authorize(ROLES.DOCTOR, ROLES.ADMIN),
  validate(updateStatusSchema),
  appointmentController.updateStatus,
);

// ── Cancellation ──
// @route   DELETE /api/v1/appointments/:id
// @desc    Fast cancellation by ID
router.delete(
  "/:id",
  authorize(ROLES.RECEPTIONIST, ROLES.ADMIN),
  appointmentController.cancelAppointment,
);

module.exports = router;
