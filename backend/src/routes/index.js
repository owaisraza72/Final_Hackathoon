/**
 * API v1 Routing Configuration
 *
 * Namespaces:
 * /auth         -> Session and registration management
 * /users        -> Staff profile and directory management
 * /admin        -> Clinic setting, roles and analytics
 * /patients     -> Patient demographic and records
 * /appointments -> Booking and scheduling
 * /prescriptions-> Medication and PDF generation
 * /diagnoses    -> Clinical diagnosis logging
 * /ai           -> Gemini Powered Clinical Intelligence
 */

const { Router } = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const adminRoutes = require("./admin.routes");
const patientRoutes = require("./patient.routes");
const appointmentRoutes = require("./appointment.routes");
const prescriptionRoutes = require("./prescription.routes");
const diagnosisRoutes = require("./diagnosis.routes");
const aiRoutes = require("./ai.routes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/patients", patientRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/diagnoses", diagnosisRoutes);
router.use("/ai", aiRoutes);

module.exports = router;
