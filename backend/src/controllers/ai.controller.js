// controllers/ai.controller.js
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { HTTP_STATUS } = require("../constants");
const aiService = require("../services/ai.service");
const Patient = require("../models/patient.model");
const Prescription = require("../models/prescription.model");

class AIController {
  // ── POST /api/v1/ai/diagnose ── (For Doctors)
  diagnose = asyncHandler(async (req, res) => {
    const { patientId, symptoms, notes } = req.body;
    const clinicId = req.user.clinicId;

    // Get patient details for better AI context
    const patient = await Patient.findOne({ _id: patientId, clinicId });
    if (!patient)
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json(
          new ApiResponse(HTTP_STATUS.NOT_FOUND, null, "Patient not found"),
        );

    const result = await aiService.getDiagnosis({
      symptoms,
      patientAge: patient.age,
      patientGender: patient.gender,
      notes,
    });

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { result },
          "AI diagnosis fetched successfully",
        ),
      );
  });

  // ── GET /api/v1/ai/explain/:prescriptionId ── (For Patients)
  explainPrescription = asyncHandler(async (req, res) => {
    const clinicId = req.user.clinicId;
    const { prescriptionId } = req.params;

    const prescription = await Prescription.findOne({
      _id: prescriptionId,
      clinicId,
    });
    if (!prescription)
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json(
          new ApiResponse(
            HTTP_STATUS.NOT_FOUND,
            null,
            "Prescription not found",
          ),
        );

    const result = await aiService.explainPrescription(prescription);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          "AI explanation generated successfully",
        ),
      );
  });
}

module.exports = new AIController();
