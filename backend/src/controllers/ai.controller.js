// controllers/ai.controller.js
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { HTTP_STATUS } = require("../constants");
const aiService = require("../services/ai.service");
const Patient = require("../models/patient.model");
const Prescription = require("../models/prescription.model");
const DiagnosisLog = require("../models/diagnosisLog.model");

class AIController {
  // ── POST /api/v1/ai/diagnosis ── (For Doctors)
  diagnose = asyncHandler(async (req, res) => {
    const { patientId, symptoms, notes } = req.body;
    const doctorId = req.user._id;

    // Get patient details
    const patient = await Patient.findOne({
      _id: patientId,
      isActive: true,
    });
    if (!patient) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json(
          new ApiResponse(HTTP_STATUS.NOT_FOUND, null, "Patient not found"),
        );
    }

    // Get AI diagnosis
    const aiResult = await aiService.getDiagnosis({
      symptoms,
      patientAge: patient.age,
      patientGender: patient.gender,
      notes,
    });

    // Store the AI diagnosis result
    const diagnosisLog = await DiagnosisLog.create({
      patientId,
      doctorId,
      symptoms,
      additionalNotes: notes || "",
      aiResponse: JSON.stringify(aiResult),
      aiParsed: {
        possibleConditions: aiResult.possibleConditions || [],
        recommendations: aiResult.recommendations || [],
        urgency: aiResult.riskLevel || "unknown",
      },
      riskLevel: aiResult.riskLevel || "low",
      isAiFallback: aiResult.isFallback || false,
    });

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { result: aiResult, diagnosisId: diagnosisLog._id },
          "AI diagnosis generated and saved successfully",
        ),
      );
  });

  // ── GET /api/v1/ai/explain/:prescriptionId ── (For Patients)
  explainPrescription = asyncHandler(async (req, res) => {
    const { prescriptionId } = req.params;

    const prescription = await Prescription.findById(prescriptionId);

    if (!prescription) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json(
          new ApiResponse(
            HTTP_STATUS.NOT_FOUND,
            null,
            "Prescription not found",
          ),
        );
    }

    // Return stored or generated explanation
    let explanation = prescription.aiExplanation;

    // If explanation not stored yet, generate it now
    if (!explanation) {
      const result = await aiService.explainPrescription(prescription);
      explanation =
        result?.explanation || "Unable to generate explanation at this time.";

      // Update prescription with the explanation (don't await)
      Prescription.findByIdAndUpdate(
        prescription._id,
        { $set: { aiExplanation: explanation } },
        { new: false },
      ).catch((err) =>
        console.error("Failed to cache explanation:", err.message),
      );
    }

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { explanation },
          "AI explanation generated successfully",
        ),
      );
  });
}

module.exports = new AIController();
