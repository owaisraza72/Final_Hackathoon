// routes/patient.routes.js
const { Router } = require("express");
const patientController = require("../controllers/patient.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  registerPatientSchema,
  updatePatientSchema,
} = require("../validators/patient.validator");
const { checkPatientLimit } = require("../middlewares/subscription.middleware");
const { ROLES } = require("../constants");

const router = Router();

// All patient routes require authentication
router.use(authenticate);

// ── POST / — Register new patient (Receptionist only, with Zod validation) ──
router.post(
  "/",
  authorize(ROLES.RECEPTIONIST),
  validate(registerPatientSchema),
  checkPatientLimit,
  patientController.registerPatient,
);

// ── GET / — List all patients with search (Doctor + Receptionist + Admin) ──
router.get(
  "/",
  authorize(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
  patientController.listPatients,
);

// ── GET /:id — Get single patient (Doctor + Receptionist) ──
router.get(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
  patientController.getPatient,
);

// ── PATCH /:id — Update patient info (Receptionist only, with Zod validation) ──
router.patch(
  "/:id",
  authorize(ROLES.RECEPTIONIST, ROLES.ADMIN),
  validate(updatePatientSchema),
  patientController.updatePatient,
);

// ── GET /:id/history — Full patient history (Doctor + Receptionist) ──
router.get(
  "/:id/history",
  authorize(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
  patientController.getPatientHistory,
);

module.exports = router;
