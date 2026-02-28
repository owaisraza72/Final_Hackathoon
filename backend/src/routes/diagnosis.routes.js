// routes/diagnosis.routes.js
const { Router } = require("express");
const diagnosisController = require("../controllers/diagnosis.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { ROLES } = require("../constants");

const router = Router();

// All diagnosis routes require authentication
router.use(authenticate);

// ── GET /patient/:id — Diagnosis history (Doctor + Patient + Admin) ──
router.get(
  "/patient/:id",
  authorize(ROLES.DOCTOR, ROLES.PATIENT, ROLES.ADMIN),
  diagnosisController.getPatientDiagnoses,
);

// ── GET /:id — Detail for single diagnosis record (Doctor + Patient + Admin) ──
router.get(
  "/:id",
  authorize(ROLES.DOCTOR, ROLES.PATIENT, ROLES.ADMIN),
  diagnosisController.getDiagnosisDetail,
);

// ── POST / — Store doctor's symptoms and diagnosis (Doctor only) ──
router.post(
  "/",
  authorize(ROLES.DOCTOR, ROLES.ADMIN),
  diagnosisController.createDiagnosis,
);

module.exports = router;
