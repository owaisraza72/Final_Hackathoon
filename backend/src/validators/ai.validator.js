const { z } = require("zod");

// ── AI Diagnosis Schema ──
// FIXED: Removed outer body: wrapper. Validation middleware passes req.body directly.
const aiDiagnoseSchema = z.object({
  patientId: z
    .string({ required_error: "Patient ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid patient ID format"),
  symptoms: z
    .array(z.string(), {
      required_error: "At least one symptom is required",
    })
    .min(1, "Symptom list cannot be empty"),
  notes: z.string().max(1000).optional(),
});

module.exports = { aiDiagnoseSchema };
