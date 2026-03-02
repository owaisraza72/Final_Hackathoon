const { z } = require("zod");

// ── Create Diagnosis Schema ──
// Added: Validation for manual diagnosis creation by doctors
const createDiagnosisSchema = z.object({
  patientId: z
    .string({ required_error: "Patient ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid patient ID format"),
  symptoms: z
    .array(z.string({ required_error: "Symptom must be a string" }), {
      required_error: "At least one symptom is required",
    })
    .min(1, "Symptom list cannot be empty")
    .max(10, "Cannot add more than 10 symptoms"),
  additionalNotes: z
    .string()
    .max(1000, "Additional notes cannot exceed 1000 characters")
    .optional(),
  riskLevel: z
    .enum(["low", "medium", "high", "critical"])
    .optional(),
  doctorNotes: z
    .string()
    .max(2000, "Doctor notes cannot exceed 2000 characters")
    .optional(),
});

module.exports = { createDiagnosisSchema };
