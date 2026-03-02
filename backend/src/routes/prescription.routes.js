/**
 * Base URL: /api/v1/prescriptions
 *
 * GET  /patient/:id - Get prescription history for a patient
 * GET  /:id         - Get detailed prescription
 * GET  /:id/pdf     - Download prescription as PDF
 * POST /           - Create new prescription (Doctors only)
 * PATCH /:id       - Update prescription record
 */

const { Router } = require("express");
const prescriptionController = require("../controllers/prescription.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createPrescriptionSchema,
} = require("../validators/prescription.validator");
const { ROLES } = require("../constants");
const { attachAdmin } = require("../middlewares/subscription.middleware");

const router = Router();

// All prescription routes require authentication
router.use(authenticate);

// All prescription routes need context of the Admin account
router.use(attachAdmin);

// ── Medical View ──
// @route   GET /api/v1/prescriptions/patient/:id
// @desc    Retrieve all past prescriptions for a specific patient
router.get(
  "/patient/:id",
  authorize(ROLES.DOCTOR, ROLES.PATIENT, ROLES.ADMIN, ROLES.RECEPTIONIST),
  prescriptionController.getPatientPrescriptions,
);

// ── Detail Report ──
// @route   GET /api/v1/prescriptions/:id
// @desc    Get full details of a single prescription record
router.get(
  "/:id",
  authorize(ROLES.DOCTOR, ROLES.PATIENT, ROLES.ADMIN, ROLES.RECEPTIONIST),
  prescriptionController.getPrescription,
);

// ── Print PDF ──
// @route   GET /api/v1/prescriptions/:id/pdf
// @desc    Generate a downloadable PDF version of the prescription
router.get(
  "/:id/pdf",
  authorize(ROLES.DOCTOR, ROLES.PATIENT, ROLES.ADMIN),
  prescriptionController.downloadPDF,
);

// ── Doctor's Order ──
// @route   POST /api/v1/prescriptions
// @desc    Issue a new medical prescription
// @body    { "patientId": "ID", "diagnosis": "Fever", "medicines": [{ "name": "Panadol", "dosage": "500mg" }] }
router.post(
  "/",
  authorize(ROLES.DOCTOR, ROLES.ADMIN),
  validate(createPrescriptionSchema),
  prescriptionController.createPrescription,
);

// ── Edit Record ──
// @route   PATCH /api/v1/prescriptions/:id
// @desc    Correct or update an existing prescription
// @body    { "medicines": [...], "instructions": "Modified" }
router.patch(
  "/:id",
  authorize(ROLES.DOCTOR, ROLES.ADMIN),
  validate(createPrescriptionSchema),
  prescriptionController.updatePrescription,
);

module.exports = router;
