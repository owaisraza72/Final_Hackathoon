// controllers/diagnosis.controller.js
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { HTTP_STATUS } = require("../constants");
const diagnosisService = require("../services/diagnosis.service");

class DiagnosisController {
  // ── POST /api/v1/diagnoses ──
  createDiagnosis = asyncHandler(async (req, res) => {
    const doctorId = req.user._id;

    const diagnosis = await diagnosisService.createDiagnosisLog(
      req.body,
      doctorId,
    );

    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          { diagnosis },
          "Diagnosis record stored successfully",
        ),
      );
  });

  // ── GET /api/v1/diagnoses/patient/:id ──
  getPatientDiagnoses = asyncHandler(async (req, res) => {
    const patientId = req.params.id;

    const diagnoses = await diagnosisService.getPatientDiagnoses(patientId);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { diagnoses },
          "History fetched successfully",
        ),
      );
  });

  // ── GET /api/v1/diagnoses/:id ──
  getDiagnosisDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const diagnosis = await diagnosisService.getDiagnosisById(id);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { diagnosis },
          "Diagnosis report fetched successfully",
        ),
      );
  });

  // ── PATCH /api/v1/diagnoses/:id ──
  updateDiagnosis = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const diagnosis = await diagnosisService.updateDiagnosis(id, req.body);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { diagnosis },
          "Diagnosis record updated successfully",
        ),
      );
  });

  // ── DELETE /api/v1/diagnoses/:id ──
  deleteDiagnosis = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await diagnosisService.deleteDiagnosis(id);

    res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, null, "Diagnosis record deleted"));
  });
}

module.exports = new DiagnosisController();
