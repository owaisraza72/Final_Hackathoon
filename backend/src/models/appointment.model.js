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
      required: [true, "Patient is required"],
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor is required"],
      index: true,
    },
    receptionistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
      // e.g. "09:00", "09:30", "10:00"
    },
    status: {
      type: String,
      enum: {
        values: Object.values(APPOINTMENT_STATUS),
        message: "{VALUE} is not a valid status",
      },
      default: APPOINTMENT_STATUS.PENDING,
      index: true,
    },
    reason: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Reason cannot exceed 500 characters"],
    },
    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    // Duration in minutes (default 30 mins)
    duration: {
      type: Number,
      default: 30,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Compound index: one doctor can have only one slot per date+time
appointmentSchema.index(
  { doctorId: 1, date: 1, timeSlot: 1 },
  { unique: true, sparse: true },
);

// Index for daily schedule queries
appointmentSchema.index({ clinicId: 1, date: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
module.exports.APPOINTMENT_STATUS = APPOINTMENT_STATUS;
