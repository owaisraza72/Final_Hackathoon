// controllers/appointment.controller.js
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { HTTP_STATUS } = require("../constants");
const appointmentService = require("../services/appointment.service");

class AppointmentController {
  // ── POST /api/v1/appointments ──
  bookAppointment = asyncHandler(async (req, res) => {
    const receptionistId = req.user._id;
    const clinicId = req.user.clinicId;

    const appointment = await appointmentService.bookAppointment(
      req.body,
      receptionistId,
      clinicId,
    );

    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          { appointment },
          "Appointment booked successfully",
        ),
      );
  });

  // ── GET /api/v1/appointments ──
  listAppointments = asyncHandler(async (req, res) => {
    const clinicId = req.user.clinicId;
    const { status, date } = req.query;
    const { role, _id: userId } = req.user;

    const appointments = await appointmentService.getAppointments(clinicId, {
      role,
      userId,
      status,
      date,
    });

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { appointments },
          "Appointments fetched successfully",
        ),
      );
  });

  // ── GET /api/v1/appointments/schedule ──
  getDailySchedule = asyncHandler(async (req, res) => {
    const clinicId = req.user.clinicId;
    const { date } = req.query;

    const appointments = await appointmentService.getDailySchedule(
      clinicId,
      date,
    );

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { appointments },
          "Daily schedule fetched successfully",
        ),
      );
  });

  // ── PATCH /api/v1/appointments/:id/status ──
  updateStatus = asyncHandler(async (req, res) => {
    const clinicId = req.user.clinicId;
    const { id } = req.params;
    const { status } = req.body;

    const updatedAppointment = await appointmentService.updateStatus(
      id,
      status,
      clinicId,
    );

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { appointment: updatedAppointment },
          "Appointment status updated",
        ),
      );
  });

  // ── DELETE /api/v1/appointments/:id ──
  cancelAppointment = asyncHandler(async (req, res) => {
    const clinicId = req.user.clinicId;
    const { id } = req.params;

    const result = await appointmentService.cancelAppointment(id, clinicId);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          { appointment: result },
          "Appointment cancelled successfully",
        ),
      );
  });
}

module.exports = new AppointmentController();
