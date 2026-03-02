// controllers/prescription.controller.js
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");
const prescriptionService = require("../services/prescription.service");

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
    const patientId = req.params.id;

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

    const pdfBuffer =
      await prescriptionService.generatePdfBuffer(prescriptionId);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=prescription_${prescriptionId}.pdf`,
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
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
}

module.exports = new PrescriptionController();
