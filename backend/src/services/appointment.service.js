// services/appointment.service.js
const AppointmentModel = require("../models/appointment.model");
const Appointment = AppointmentModel;
const APPOINTMENT_STATUS = AppointmentModel.APPOINTMENT_STATUS;
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, ROLES } = require("../constants");
const mongoose = require("mongoose");

class AppointmentService {
  /**
   * Book a new appointment
   */
  bookAppointment = async (data, receptionistId, clinicId) => {
    const { patientId, doctorId, date, timeSlot, reason } = data;

    // Check if the doctor already has an appointment at this slot
    // The model has a unique index, but we check manually for a better error message
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      timeSlot,
      status: { $ne: APPOINTMENT_STATUS.CANCELLED },
    });

    if (existingAppointment) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "Doctor is already booked for this time slot",
      );
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      receptionistId,
      clinicId,
      date: new Date(date),
      timeSlot,
      reason,
      status: APPOINTMENT_STATUS.PENDING,
    });

    return appointment;
  };

  /**
   * Get all appointments (filtered by role)
   */
  getAppointments = async (clinicId, { role, userId, status, date }) => {
    const query = { clinicId };

    // Role based filtering
    if (role === ROLES.DOCTOR) {
      query.doctorId = userId;
    } else if (role === ROLES.PATIENT) {
      query.patientId = userId;
    }

    if (status) query.status = status;
    if (date) query.date = new Date(date);

    const appointments = await Appointment.find(query)
      .populate("patientId", "name contact age gender")
      .populate("doctorId", "name email")
      .sort({ date: 1, timeSlot: 1 });

    return appointments;
  };

  /**
   * Get daily schedule for receptionist
   */
  getDailySchedule = async (clinicId, date) => {
    const targetDate = date ? new Date(date) : new Date();
    // Normalize date to start of day for accurate filtering
    targetDate.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      clinicId,
      date: {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
      },
    })
      .populate("patientId", "name contact")
      .populate("doctorId", "name")
      .sort({ timeSlot: 1 });

    return appointments;
  };

  /**
   * Update appointment status (Doctor action)
   */
  updateStatus = async (appointmentId, status, clinicId) => {
    if (!Object.values(APPOINTMENT_STATUS).includes(status)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid status");
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, clinicId },
      { $set: { status } },
      { new: true },
    )
      .populate("patientId", "name")
      .populate("doctorId", "name");

    if (!appointment) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Appointment not found");
    }

    return appointment;
  };

  /**
   * Cancel appointment
   */
  cancelAppointment = async (appointmentId, clinicId) => {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, clinicId },
      { $set: { status: APPOINTMENT_STATUS.CANCELLED } },
      { new: true },
    );

    if (!appointment) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Appointment not found");
    }

    return appointment;
  };
}

module.exports = new AppointmentService();
