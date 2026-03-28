/**
 * Base URL: /api/v1/ai
 *
 * POST /diagnosis              - Generate AI diagnosis (Doctors only, PRO plan)
 * GET  /explain/:prescriptionId - Generate AI explanation for prescription (PRO plan)
 */

const { Router } = require("express");
const aiController = require("../controllers/ai.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { requirePro } = require("../middlewares/subscription.middleware");
const validate = require("../middlewares/validate.middleware");
const { aiDiagnoseSchema } = require("../validators/ai.validator");
const { ROLES } = require("../constants");

const router = Router();

// All AI routes require authentication (Plan check disabled for Hackathon)
router.use(authenticate);

// ── AI Methods ──

// @route   POST /api/v1/ai/diagnosis
// @desc    Analyze symptoms using AI
// @access  DOCTOR, ADMIN
// @body    { "patientId": "ID", "symptoms": ["fever", "cough"], "notes": "Context" }
router.post(
  "/diagnosis",
  authorize(ROLES.DOCTOR, ROLES.ADMIN),
  validate(aiDiagnoseSchema),
  aiController.diagnose,
);

// @route   GET /api/v1/ai/explain/:prescriptionId
// @desc    Get AI explained summary of a prescription
// @access  PATIENT, DOCTOR, ADMIN
router.get(
  "/explain/:prescriptionId",
  authorize(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN),
  aiController.explainPrescription,
);

module.exports = router;
