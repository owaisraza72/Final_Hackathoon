// controllers/patient.controller.js
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { HTTP_STATUS } = require("../constants");
const patientService = require("../services/patient.service");

class PatientController {
  // ── POST /api/v1/patients ──
  registerPatient = asyncHandler(async (req, res) => {
    const createdBy = req.user._id;
    const clinicId = req.user.clinicId;

    const patient = await patientService.registerPatient(
      req.body,
      createdBy,
      clinicId,
    );

    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          { patient },
          "Patient registered successfully",
        ),
      );
  });

  // ── GET /api/v1/patients ──
  listPatients = asyncHandler(async (req, res) => {
    const clinicId = req.user.clinicId;
    const { search, page, limit } = req.query;

    const result = await patientService.listPatients(clinicId, {
      search,
      page,
      limit,
    });

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          "Patients fetched successfully",
        ),
      );
  });

  // ── GET /api/v1/patients/:id ──
  getPatient = asyncHandler(async (req, res) => {
    const clinicId = req.user.clinicId;
    const { id } = req.params;

    const patient = await patientService.getPatientById(id, clinicId);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { patient },
          "Patient fetched successfully",
        ),
      );
  });

  // ── PATCH /api/v1/patients/:id ──
  updatePatient = asyncHandler(async (req, res) => {
    const clinicId = req.user.clinicId;
    const { id } = req.params;

    const patient = await patientService.updatePatient(id, req.body, clinicId);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { patient },
          "Patient updated successfully",
        ),
      );
  });

  // ── GET /api/v1/patients/:id/history ──
  getPatientHistory = asyncHandler(async (req, res) => {
    const clinicId = req.user.clinicId;
    const { id } = req.params;

    const history = await patientService.getPatientHistory(id, clinicId);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          history,
          "Patient history fetched successfully",
        ),
      );
  });
}

module.exports = new PatientController();
