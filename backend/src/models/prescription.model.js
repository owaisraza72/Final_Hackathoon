const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },
    dosage: {
      type: String,
      required: [true, "Dosage is required"],
      // e.g. "500mg", "10ml"
    },
    frequency: {
      type: String,
      required: [true, "Frequency is required"],
      // e.g. "Once daily", "Twice daily", "Every 8 hours"
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      // e.g. "7 days", "2 weeks", "1 month"
    },
    instructions: {
      type: String,
      default: "",
      // e.g. "Take after meals", "Take on empty stomach"
    },
  },
  { _id: false },
);

const prescriptionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor is required"],
      index: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
      index: true,
    },
    diagnosis: {
      type: String,
      required: [true, "Diagnosis is required"],
      trim: true,
      maxlength: [1000, "Diagnosis cannot exceed 1000 characters"],
    },
    medicines: {
      type: [medicineSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one medicine is required",
      },
    },
    instructions: {
      type: String,
      default: "",
      trim: true,
      maxlength: [2000, "Instructions cannot exceed 2000 characters"],
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    // AI-generated explanation for patient (PRO plan only)
    aiExplanation: {
      type: String,
      default: null,
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

// Fast lookup: all prescriptions for a patient within a clinic
prescriptionSchema.index({ clinicId: 1, patientId: 1, createdAt: -1 });

module.exports = mongoose.model("Prescription", prescriptionSchema);
