const { z } = require("zod");

// ── Prescription Schema ──
// FIXED: Removed outer body: wrapper. Validation middleware passes req.body directly.
const createPrescriptionSchema = z.object({
  patientId: z
    .string({ required_error: "Patient ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid patient ID format"),
  appointmentId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  diagnosis: z
    .string({ required_error: "Diagnosis is required" })
    .min(3, "Diagnosis must be descriptive")
    .max(1000, "Diagnosis cannot exceed 1000 characters"),
  medicines: z
    .array(
      z.object({
        name: z.string({ required_error: "Medicine name is required" }),
        dosage: z.string({ required_error: "Dosage is required" }),
        frequency: z.string({ required_error: "Frequency is required" }), // e.g. "1-0-1"
        duration: z.string({ required_error: "Duration is required" }), // e.g. "5 days"
        instructions: z.string().max(500).optional(),
      }),
    )
    .min(1, "At least one medicine is required"),
  instructions: z.string().max(2000).optional(),
  followUpDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

module.exports = { createPrescriptionSchema };
