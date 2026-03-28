const { z } = require("zod");

// ── Register Patient Schema ──
// Creates both a Patient medical record AND a User auth account (if email provided)
// so the patient can later login to their portal.
const registerPatientSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  age: z.coerce
    .number({ required_error: "Age is required" })
    .min(0, "Age cannot be negative")
    .max(150, "Age seems invalid"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required (male, female, other)",
  }),
  contact: z
    .string({ required_error: "Contact number is required" })
    .regex(/^[0-9+\-\s]{7,20}$/, "Please provide a valid contact number"),
  email: z.string().email("Invalid email format").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
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
});

// ── Update Patient Schema ──
// FIXED: Removed outer body: wrapper.
const updatePatientSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  age: z.coerce.number().min(0).max(150).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  contact: z
    .string()
    .regex(/^[0-9+\-\s]{7,20}$/)
    .optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown", ""])
    .optional()
    .transform((val) => (val === "" ? "unknown" : val)),
  allergies: z
    .preprocess((val) => {
      if (typeof val === "string") {
        return val
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return val;
    }, z.array(z.string()))
    .optional(),
});

module.exports = { registerPatientSchema, updatePatientSchema };
