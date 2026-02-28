// routes/ai.routes.js
const { Router } = require("express");
const aiController = require("../controllers/ai.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { requirePro } = require("../middlewares/subscription.middleware");
const validate = require("../middlewares/validate.middleware");
const { aiDiagnoseSchema } = require("../validators/ai.validator");
const { ROLES } = require("../constants");

const router = Router();

// All AI routes require authentication and PRO subscription!
router.use(authenticate, requirePro);

// ── POST /diagnose — AI analysis with Zod validation ──
router.post(
  "/diagnose",
  authorize(ROLES.DOCTOR, ROLES.ADMIN),
  validate(aiDiagnoseSchema),
  aiController.diagnose,
);

// ── GET /explain/:prescriptionId — AI explanation for patient (Patient + Doctor, PRO plan) ──
router.get(
  "/explain/:prescriptionId",
  authorize(ROLES.PATIENT, ROLES.DOCTOR, ROLES.ADMIN),
  aiController.explainPrescription,
);

module.exports = router;
