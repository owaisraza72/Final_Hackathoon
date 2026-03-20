// services/patient.service.js

const Patient = require("../models/patient.model");
const User = require("../models/user.model"); // ✅ needed to create auth account for patient
const Appointment = require("../models/appointment.model");
const Prescription = require("../models/prescription.model");
const DiagnosisLog = require("../models/diagnosisLog.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, ROLES, PLANS } = require("../constants");

class PatientService {
  // ─────────────────────────
  // Register new patient
  // ─────────────────────────
  registerPatient = async (data, registeredBy) => {
    const {
      name,
      age,
      gender,
      contact,
      email,
      address,
      bloodGroup,
      allergies,
      emergencyContact,
      password,
    } = data;

    // ── Duplicate contact check ──
    const existingContact = await Patient.findOne({
      contact,
      isActive: true,
    });

    if (existingContact) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        `Patient with contact '${contact}' already exists`,
      );
    }

    // ── Duplicate email check (Patient collection) ──
    if (email) {
      const existingEmail = await Patient.findOne({
        email,
        isActive: true,
      });

      if (existingEmail) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          `Patient with email '${email}' already exists`,
        );
      }
    }

    // ── Create Patient medical record ──
    const patient = await Patient.create({
      name,
      age,
      gender,
      contact,
      email,
      password: password || undefined,
      address: address || "",
      bloodGroup: bloodGroup || "unknown",
      allergies: allergies || [],
      emergencyContact: emergencyContact || {},
      createdBy: registeredBy,
    });

    // ── Also create a User auth account if email is provided ──
    // This allows the patient to login to their portal
    if (email) {
      let existingUser = await User.findOne({ email });

      if (!existingUser) {
        // Use provided password, or generate a default one
        const userPassword = password || "Patient@123";

        const newUser = await User.create({
          name,
          email,
          password: userPassword,
          role: ROLES.PATIENT,
          subscriptionPlan: PLANS.FREE,
          isActive: true,
        });

        // Link User ID back to Patient
        patient.userId = newUser._id;
        await patient.save({ validateBeforeSave: false });
      } else if (existingUser.role === ROLES.PATIENT) {
        // Link existing user if not already linked
        patient.userId = existingUser._id;
        await patient.save({ validateBeforeSave: false });
      }
    }

    return patient;
  };

  // ─────────────────────────
  // Get patient by ID
  // ─────────────────────────
  getPatientById = async (patientId) => {
    const patient = await Patient.findOne({
      _id: patientId,
      isActive: true,
    }).populate("createdBy", "name email role");

    if (!patient) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Patient not found");
    }

    return patient;
  };

  // ─────────────────────────
  // Update patient
  // ─────────────────────────
  updatePatient = async (patientId, updateData) => {
    delete updateData.createdBy;
    delete updateData.password;

    const patient = await Patient.findOneAndUpdate(
      { _id: patientId, isActive: true },
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!patient) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Patient not found");
    }

    return patient;
  };

  // ─────────────────────────
  // List patients
  // ─────────────────────────
  listPatients = async ({ search = "", page = 1, limit = 20, user = null } = {}) => {
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { contact: { $regex: search, $options: "i" } },
      ];
    }

    // ── DOCTOR SPECIFIC FILTERING ──
    if (user && user.role === ROLES.DOCTOR) {
      // Find all patient IDs from Appointments matching this doctor
      const appointments = await Appointment.find({ doctorId: user._id }).select("patientId").lean();
      // Find all patient IDs from Prescriptions matching this doctor
      const prescriptions = await Prescription.find({ doctorId: user._id }).select("patientId").lean();

      // Get unique patient IDs
      const patientIds = new Set();
      appointments.forEach(a => patientIds.add(String(a.patientId)));
      prescriptions.forEach(p => patientIds.add(String(p.patientId)));

      // Add to query
      query._id = { $in: Array.from(patientIds) };
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 20);
    const skip = (pageNum - 1) * limitNum;

    const [patients, total] = await Promise.all([
      Patient.find(query)
        .select("name age gender contact email bloodGroup createdAt isActive")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),

      Patient.countDocuments(query),
    ]);

    return {
      patients,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  };

  // ─────────────────────────
  // Patient full history
  // ─────────────────────────
  getPatientHistory = async (identifier) => {
    // Try finding by direct _id first, then by linked userId
    const patient = await Patient.findOne({
      $or: [{ _id: identifier }, { userId: identifier }],
      isActive: true,
    });

    if (!patient) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Patient record not found");
    }

    const patientId = patient._id;

    const [appointments, prescriptions, diagnoses] = await Promise.all([
      Appointment.find({ patientId })
        .populate("doctorId", "name email")
        .sort({ date: -1 })
        .limit(20),

      Prescription.find({ patientId })
        .populate("doctorId", "name email")
        .sort({ createdAt: -1 })
        .limit(20),

      DiagnosisLog.find({ patientId })
        .populate("doctorId", "name email")
        .sort({ createdAt: -1 })
        .limit(20),
    ]);

    return {
      patient,
      appointments,
      prescriptions,
      diagnoses,
    };
  };

  // ─────────────────────────
  // Delete patient (soft)
  // ─────────────────────────
  deletePatient = async (patientId) => {
    const patient = await Patient.findOneAndUpdate(
      { _id: patientId, isActive: true },
      { $set: { isActive: false } },
      { new: true },
    );

    if (!patient) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Patient not found");
    }

    return patient;
  };
}

module.exports = new PatientService();
