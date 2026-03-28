// controllers/prescription.controller.js
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");
const prescriptionService = require("../services/prescription.service");
const Patient = require("../models/patient.model");

class PrescriptionController {
  // ── POST /api/v1/prescriptions ──
  createPrescription = asyncHandler(async (req, res) => {
    const subscriptionPlan = req.admin.subscriptionPlan;
    const doctorId = req.user._id;

    const prescription = await prescriptionService.createPrescription(
      req.body,
      doctorId,
      subscriptionPlan,
    );

    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          { prescription },
          "Prescription created successfully",
        ),
      );
  });

  // ── GET /api/v1/prescriptions/patient/:id ──
  getPatientPrescriptions = asyncHandler(async (req, res) => {
    let patientId = req.params.id;

    // Handle "me" alias for logged-in patients
    if (patientId === "me") {
      patientId = req.user._id;

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

    const prescriptions =
      await prescriptionService.getPatientPrescriptions(patientId);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { prescriptions },
          "Prescriptions fetched successfully",
        ),
      );
  });

  // ── GET /api/v1/prescriptions/doctor ──
  getDoctorPrescriptions = asyncHandler(async (req, res) => {
    const doctorId = req.user._id;

    const prescriptions =
      await prescriptionService.getDoctorPrescriptions(doctorId);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { prescriptions },
          "Doctor's prescriptions fetched successfully",
        ),
      );
  });

  // ── GET /api/v1/prescriptions/:id ──
  getPrescription = asyncHandler(async (req, res) => {
    const prescriptionId = req.params.id;

    const prescription =
      await prescriptionService.getPrescriptionById(prescriptionId);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { prescription },
          "Prescription fetched successfully",
        ),
      );
  });

  // ── GET /api/v1/prescriptions/:id/pdf ──
  downloadPDF = asyncHandler(async (req, res) => {
    const prescriptionId = req.params.id;

    try {
      const pdfBuffer = await prescriptionService.generatePdfBuffer(prescriptionId);

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=prescription_${prescriptionId}.pdf`,
      });

      res.send(pdfBuffer);
    } catch (err) {
      console.error(">>> PDF CONTROLLER CRASH:", err);
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "PDF Generation Failed: " + err.message,
      );
    }
  });

  // ── PATCH /api/v1/prescriptions/:id ──
  updatePrescription = asyncHandler(async (req, res) => {
    const prescriptionId = req.params.id;

    const updatedPrescription = await prescriptionService.updatePrescription(
      prescriptionId,
      req.body,
    );

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { prescription: updatedPrescription },
          "Prescription updated successfully",
        ),
      );
  });

  // ── DELETE /api/v1/prescriptions/:id ──
  deletePrescription = asyncHandler(async (req, res) => {
    const prescriptionId = req.params.id;

    await prescriptionService.deletePrescription(prescriptionId);

    res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, null, "Prescription deleted"));
  });

  // ── GET /api/v1/prescriptions ──
  listAllPrescriptions = asyncHandler(async (req, res) => {
    const prescriptions = await prescriptionService.getAllPrescriptions();

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { prescriptions },
          "All prescriptions fetched successfully",
        ),
      );
  });
}

module.exports = new PrescriptionController();
