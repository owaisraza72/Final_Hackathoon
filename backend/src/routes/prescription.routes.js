// routes/prescription.routes.js
const { Router } = require("express");
const prescriptionController = require("../controllers/prescription.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createPrescriptionSchema,
} = require("../validators/prescription.validator");
const { ROLES } = require("../constants");

const router = Router();

// All prescription routes require authentication
router.use(authenticate);

// ── GET /patient/:id — Patient prescriptions history (Doctor + Patient + Admin) ──
router.get(
  "/patient/:id",
  authorize(ROLES.DOCTOR, ROLES.PATIENT, ROLES.ADMIN, ROLES.RECEPTIONIST),
  prescriptionController.getPatientPrescriptions,
);

// ── GET /:id — Detail for single prescription (Doctor + Patient + Admin) ──
router.get(
  "/:id",
  authorize(ROLES.DOCTOR, ROLES.PATIENT, ROLES.ADMIN, ROLES.RECEPTIONIST),
  prescriptionController.getPrescription,
);

// ── GET /:id/pdf — Download PDF for printing (Doctor + Patient + Admin) ──
router.get(
  "/:id/pdf",
  authorize(ROLES.DOCTOR, ROLES.PATIENT, ROLES.ADMIN),
  prescriptionController.downloadPDF,
);

// ── POST / — Store doctor's new prescription (Doctor only, with Zod validation) ──
router.post(
  "/",
  authorize(ROLES.DOCTOR, ROLES.ADMIN),
  validate(createPrescriptionSchema),
  prescriptionController.createPrescription,
);

module.exports = router;
