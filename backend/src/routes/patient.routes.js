/**
 * Base URL: /api/v1/patients
 *
 * GET    /           - List all patients (with search/pagination)
 * POST   /           - Register new patient
 * GET    /:id        - Get patient details
 * PATCH  /:id        - Update patient info
 * DELETE /:id        - Deactivate patient record
 * GET    /:id/history - Get full patient history (Appointments + Prescriptions)
 */

const { Router } = require("express");
const patientController = require("../controllers/patient.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  registerPatientSchema,
  updatePatientSchema,
} = require("../validators/patient.validator");
const {
  checkPatientLimit,
  attachAdmin,
} = require("../middlewares/subscription.middleware");
const { ROLES } = require("../constants");

const router = Router();

// All patient routes require authentication
router.use(authenticate);

// All patient routes need context of the Admin account
router.use(attachAdmin);

// ── Patient Registration ──
// @route   POST /api/v1/patients
// @desc    Register a new patient to the clinic
// @access  RECEPTIONIST, ADMIN
// @body    { "name": "Jane Doe", "age": 28, "gender": "female", "contact": "03123456789" }
router.post(
  "/",
  authorize(ROLES.RECEPTIONIST),
  validate(registerPatientSchema),
  checkPatientLimit, // This also attaches admin but double checks limit
  patientController.registerPatient,
);

// ── List & Search ──
// @route   GET /api/v1/patients
// @desc    Retrieve all patients associated with the clinic
// @query   ?search=Jane&page=1&limit=10
router.get(
  "/",
  authorize(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
  patientController.listPatients,
);

// ── Detail Profile ──
// @route   GET /api/v1/patients/:id
// @desc    Get demographic data for a single patient
router.get(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
  patientController.getPatient,
);

// ── Update ──
// @route   PATCH /api/v1/patients/:id
// @desc    Update editable demographic data
// @body    { "address": "New Location", "contact": "UpdatedPhone" }
router.patch(
  "/:id",
  authorize(ROLES.RECEPTIONIST, ROLES.ADMIN),
  validate(updatePatientSchema),
  patientController.updatePatient,
);

// ── Complete Medical Data ──
// @route   GET /api/v1/patients/:id/history
// @desc    Comprehensive medical record dump
router.get(
  "/:id/history",
  authorize(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.PATIENT),
  patientController.getPatientHistory,
);

// ── Deactivate ──
// @route   DELETE /api/v1/patients/:id
// @desc    Mark patient record as inactive
router.delete(
  "/:id",
  authorize(ROLES.RECEPTIONIST, ROLES.ADMIN),
  patientController.deletePatient,
);

// ── Bulk Deactivate ──
// @route   POST /api/v1/patients/bulk-delete
// @desc    Mark multiple patient records as inactive
router.post(
  "/bulk-delete",
  authorize(ROLES.RECEPTIONIST, ROLES.ADMIN),
  patientController.bulkDeletePatients,
);

module.exports = router;
