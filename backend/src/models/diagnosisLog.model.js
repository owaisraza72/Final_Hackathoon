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
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symptoms: {
      type: [String],
      required: true,
    },
    additionalNotes: {
      type: String,
      default: "",
    },
    aiResponse: {
      type: String,
      default: null,
    },
    aiParsed: {
      possibleConditions: [String],
      recommendations: [String],
      urgency: String,
    },
    riskLevel: {
      type: String,
      enum: Object.values(RISK_LEVELS),
      default: RISK_LEVELS.LOW,
    },
    isAiFallback: {
      type: Boolean,
      default: false,
    },
    doctorNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("DiagnosisLog", diagnosisLogSchema);
module.exports.RISK_LEVELS = RISK_LEVELS;