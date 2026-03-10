// controllers/patient.controller.js
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { HTTP_STATUS } = require("../constants");
const patientService = require("../services/patient.service");
const Patient = require("../models/patient.model");

class PatientController {
  // ── POST /api/v1/patients ──
  registerPatient = asyncHandler(async (req, res) => {
    const registeredBy = req.user._id;

    const patient = await patientService.registerPatient(
      req.body,
      registeredBy,
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
    const { search, page, limit } = req.query;

    const result = await patientService.listPatients({
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
    const { id } = req.params;

    const patient = await patientService.getPatientById(id);

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
    const { id } = req.params;

    const patient = await patientService.updatePatient(id, req.body);

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
    let { id } = req.params;

    // Handle "me" alias for logged-in patients
    if (id === "me") {
      id = req.user._id;

      // PROACTIVE SYNC: Link by email if not already linked
      const existingPatient = await Patient.findOne({
        email: req.user.email,
        isActive: true,
      });

      if (existingPatient && !existingPatient.userId) {
        existingPatient.userId = req.user._id;
        await existingPatient.save({ validateBeforeSave: false });
      }
    }

    const history = await patientService.getPatientHistory(id);

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

  // ── DELETE /api/v1/patients/:id ──
  deletePatient = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const patient = await patientService.deletePatient(id);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { patient },
          "Patient deleted successfully",
        ),
      );
  });
}

module.exports = new PatientController();
