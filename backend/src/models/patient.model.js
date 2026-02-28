const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
      max: [150, "Age seems invalid"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender",
      },
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      match: [/^[0-9+\-\s]{7,15}$/, "Please provide a valid contact number"],
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"],
        message: "{VALUE} is not a valid blood group",
      },
      default: "unknown",
    },
    medicalHistory: [
      {
        condition: { type: String },
        diagnosedAt: { type: Date },
        notes: { type: String },
      },
    ],
    allergies: [{ type: String }],
    emergencyContact: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
      relation: { type: String, default: "" },
    },
    // Who registered this patient (receptionist)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Which clinic this patient belongs to
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Index for fast search within a clinic
patientSchema.index({ clinicId: 1, name: 1 });
patientSchema.index({ clinicId: 1, contact: 1 });

module.exports = mongoose.model("Patient", patientSchema);
