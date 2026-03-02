const { z } = require("zod");

// ── Book Appointment Schema ──
// FIXED: Removed outer body: wrapper. Validation middleware passes req.body directly.
const bookAppointmentSchema = z.object({
  patientId: z
    .string({ required_error: "Patient ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid patient ID format"),
  doctorId: z
    .string({ required_error: "Doctor ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid doctor ID format"),
  date: z
    .string({ required_error: "Date is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"),
  timeSlot: z
    .string({ required_error: "Time slot is required" })
    .regex(
      /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i,
      "Invalid time slot. Use HH:MM AM/PM format (e.g. 09:30 AM)",
    ),
  reason: z.string().max(500).optional(),
});

// ── Update Status Schema ──
// FIXED: Removed outer body: wrapper.
const updateStatusSchema = z.object({
  status: z.enum(
    ["pending", "confirmed", "completed", "cancelled", "no_show"],
    {
      required_error:
        "Status must be: pending, confirmed, completed, cancelled, or no_show",
    },
  ),
});

module.exports = { bookAppointmentSchema, updateStatusSchema };
