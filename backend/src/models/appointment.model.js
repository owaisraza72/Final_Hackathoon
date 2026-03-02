const mongoose = require("mongoose");

const APPOINTMENT_STATUS = Object.freeze({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
});

const appointmentSchema = new mongoose.Schema(
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
    receptionistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),
      default: APPOINTMENT_STATUS.PENDING,
    },
    reason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
    duration: {
      type: Number,
      default: 30,
    },
  },
  {
    timestamps: true,
  },
);

// One doctor = one slot per date+time
appointmentSchema.index(
  { doctorId: 1, date: 1, timeSlot: 1 },
  { unique: true },
);

module.exports = mongoose.model("Appointment", appointmentSchema);
module.exports.APPOINTMENT_STATUS = APPOINTMENT_STATUS;