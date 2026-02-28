const mongoose = require("mongoose");

const RISK_LEVELS = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
});

const diagnosisLogSchema = new mongoose.Schema(
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
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
      index: true,
    },
    // What symptoms were entered by the doctor
    symptoms: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one symptom is required",
      },
    },
    // Additional context sent to AI
    additionalNotes: {
      type: String,
      default: "",
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    // Full AI response stored as text
    aiResponse: {
      type: String,
      default: null,
    },
    // Structured parsed response from AI
    aiParsed: {
      possibleConditions: [{ type: String }],
      recommendations: [{ type: String }],
      urgency: { type: String, default: "" },
    },
    // Risk level extracted from AI response
    riskLevel: {
      type: String,
      enum: {
        values: Object.values(RISK_LEVELS),
        message: "{VALUE} is not a valid risk level",
      },
      default: RISK_LEVELS.LOW,
    },
    // Was this a fallback response (AI was unavailable)?
    isAiFallback: {
      type: Boolean,
      default: false,
    },
    // Doctor's own assessment (can override AI)
    doctorNotes: {
      type: String,
      default: "",
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

// Fast lookup by patient in clinic
diagnosisLogSchema.index({ clinicId: 1, patientId: 1, createdAt: -1 });

module.exports = mongoose.model("DiagnosisLog", diagnosisLogSchema);
module.exports.RISK_LEVELS = RISK_LEVELS;
