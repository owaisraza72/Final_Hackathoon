const { z } = require("zod");

// ── Book Appointment Schema ──
const bookAppointmentSchema = z.object({
  body: z.object({
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
        /^([01]\d|2[0-3]):?([0-5]\d)$/,
        "Invalid time slot. Use HH:MM format (e.g. 09:30)",
      ),
    reason: z.string().max(500).optional(),
  }),
});

// ── Update Status Schema ──
const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(
      ["pending", "confirmed", "completed", "cancelled", "no_show"],
      {
        required_error:
          "Status must be: pending, confirmed, completed, cancelled, or no_show",
      },
    ),
  }),
});

module.exports = { bookAppointmentSchema, updateStatusSchema };
