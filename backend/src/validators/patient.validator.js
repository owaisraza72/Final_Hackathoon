const { z } = require("zod");

// ── Register Patient Schema ──
const registerPatientSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    age: z
      .number({ required_error: "Age is required" })
      .min(0, "Age cannot be negative")
      .max(150, "Age seems invalid"),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Gender is required (male, female, other)",
    }),
    contact: z
      .string({ required_error: "Contact number is required" })
      .regex(/^[0-9+\-\s]{7,15}$/, "Please provide a valid contact number"),
    address: z.string().optional(),
    bloodGroup: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"])
      .optional(),
    allergies: z.array(z.string()).optional(),
    emergencyContact: z
      .object({
        name: z.string().optional(),
        phone: z.string().optional(),
        relation: z.string().optional(),
      })
      .optional(),
  }),
});

// ── Update Patient Schema ──
const updatePatientSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    age: z.number().min(0).max(150).optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    contact: z
      .string()
      .regex(/^[0-9+\-\s]{7,15}$/)
      .optional(),
    address: z.string().optional(),
    bloodGroup: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"])
      .optional(),
    allergies: z.array(z.string()).optional(),
  }),
});

module.exports = { registerPatientSchema, updatePatientSchema };
