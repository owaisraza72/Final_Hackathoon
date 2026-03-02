// services/patient.service.js
const Patient = require("../models/patient.model");
const Appointment = require("../models/appointment.model");
const Prescription = require("../models/prescription.model");
const DiagnosisLog = require("../models/diagnosisLog.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");

class PatientService {
  // ── Register new patient ──
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
    } = data;

    // Check duplicate contact
    const existing = await Patient.findOne({
      contact,
      isActive: true,
    });

    if (existing) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        `A patient with contact '${contact}' already exists`,
      );
    }

    const patient = await Patient.create({
      name,
      age,
      gender,
      contact,
      email: email || undefined,
      address: address || undefined,
      bloodGroup: bloodGroup || "unknown",
      allergies: allergies || [],
      emergencyContact: emergencyContact || {},
      createdBy: registeredBy,
    });

    return patient;
  };

  // ── Get single patient by ID ──
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

  // ── Update patient info ──
  updatePatient = async (patientId, updateData) => {
    delete updateData.createdBy;

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

  // ── List patients with search & pagination ──
  listPatients = async ({ search = "", page = 1, limit = 20 } = {}) => {
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { contact: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 20);
    const skip = (pageNum - 1) * limitNum;

    const [patients, total] = await Promise.all([
      Patient.find(query)
        .select("name age gender contact bloodGroup createdAt isActive")
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

  // ── Get full patient history (appointments + prescriptions + diagnoses) ──
  getPatientHistory = async (patientId) => {
    const patient = await Patient.findOne({
      _id: patientId,
      isActive: true,
    });
    if (!patient) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Patient not found");
    }

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

  // ── Soft delete patient ──
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
