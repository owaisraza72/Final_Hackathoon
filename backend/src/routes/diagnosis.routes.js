/**
 * Base URL: /api/v1/diagnoses
 *
 * GET  /patient/:id - Get diagnosis history for a patient
 * GET  /:id         - Get detailed diagnosis record
 * POST /           - Store new diagnosis (Doctors only)
 */

const { Router } = require("express");
const diagnosisController = require("../controllers/diagnosis.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { createDiagnosisSchema } = require("../validators/diagnosis.validator");
const { ROLES } = require("../constants");
const { attachAdmin } = require("../middlewares/subscription.middleware");

const router = Router();

// All diagnosis routes require authentication
router.use(authenticate);

// All diagnosis routes need context of the Admin account
router.use(attachAdmin);

// ── Patient History ──
// @route   GET /api/v1/diagnoses/patient/:id
// @desc    Retrieve all past diagnosis logs for a specific patient
router.get(
  "/patient/:id",
  authorize(ROLES.DOCTOR, ROLES.PATIENT, ROLES.ADMIN),
  diagnosisController.getPatientDiagnoses,
);

// ── Detail Report ──
// @route   GET /api/v1/diagnoses/:id
// @desc    Get full details of a single diagnosis record
router.get(
  "/:id",
  authorize(ROLES.DOCTOR, ROLES.PATIENT, ROLES.ADMIN),
  diagnosisController.getDiagnosisDetail,
);

// ── Store Record ──
// @route   POST /api/v1/diagnoses
// @desc    Log a new patient diagnosis manually
// @body    { "patientId": "ID", "symptoms": ["headache"], "riskLevel": "LOW", "doctorNotes": "..." }
router.post(
  "/",
  authorize(ROLES.DOCTOR, ROLES.ADMIN),
  validate(createDiagnosisSchema),
  diagnosisController.createDiagnosis,
);

// ── Update Record ──
// @route   PATCH /api/v1/diagnoses/:id
// @desc    Modify an existing diagnosis log
router.patch(
  "/:id",
  authorize(ROLES.DOCTOR, ROLES.ADMIN),
  diagnosisController.updateDiagnosis,
);

// ── Wipe Record ──
// @route   DELETE /api/v1/diagnoses/:id
// @desc    Physically remove a diagnosis entry
router.delete(
  "/:id",
  authorize(ROLES.DOCTOR, ROLES.ADMIN),
  diagnosisController.deleteDiagnosis,
);

module.exports = router;
