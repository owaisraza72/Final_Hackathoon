// services/patient.service.js
const Patient = require("../models/patient.model");
const Appointment = require("../models/appointment.model");
const Prescription = require("../models/prescription.model");
const DiagnosisLog = require("../models/diagnosisLog.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");

class PatientService {
  // ── Register new patient ──
  registerPatient = async (data, createdBy, clinicId) => {
    const {
      name,
      age,
      gender,
      contact,
      address,
      bloodGroup,
      allergies,
      emergencyContact,
    } = data;

    // Check duplicate contact within clinic
    const existing = await Patient.findOne({
      contact,
      clinicId,
      isActive: true,
    });
    if (existing) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        `A patient with contact '${contact}' already exists in this clinic`,
      );
    }

    const patient = await Patient.create({
      name,
      age,
      gender,
      contact,
      address: address || "",
      bloodGroup: bloodGroup || "unknown",
      allergies: allergies || [],
      emergencyContact: emergencyContact || {},
      createdBy,
      clinicId,
    });

    return patient;
  };

  // ── Get single patient by ID ──
  getPatientById = async (patientId, clinicId) => {
    const patient = await Patient.findOne({
      _id: patientId,
      clinicId,
      isActive: true,
    }).populate("createdBy", "name email role");

    if (!patient) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Patient not found");
    }

    return patient;
  };

  // ── Update patient info ──
  updatePatient = async (patientId, updateData, clinicId) => {
    // Protect sensitive fields
    delete updateData.createdBy;
    delete updateData.clinicId;

    const patient = await Patient.findOneAndUpdate(
      { _id: patientId, clinicId, isActive: true },
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!patient) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Patient not found");
    }

    return patient;
  };

  // ── List patients with search & pagination ──
  listPatients = async (
    clinicId,
    { search = "", page = 1, limit = 20 } = {},
  ) => {
    const query = { clinicId, isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { contact: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [patients, total] = await Promise.all([
      Patient.find(query)
        .select("name age gender contact bloodGroup createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Patient.countDocuments(query),
    ]);

    return {
      patients,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  // ── Get full patient history (appointments + prescriptions + diagnoses) ──
  getPatientHistory = async (patientId, clinicId) => {
    const patient = await Patient.findOne({
      _id: patientId,
      clinicId,
      isActive: true,
    });
    if (!patient) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Patient not found");
    }

    const [appointments, prescriptions, diagnoses] = await Promise.all([
      Appointment.find({ patientId, clinicId })
        .populate("doctorId", "name email")
        .sort({ date: -1 })
        .limit(20),
      Prescription.find({ patientId, clinicId })
        .populate("doctorId", "name email")
        .sort({ createdAt: -1 })
        .limit(20),
      DiagnosisLog.find({ patientId, clinicId })
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
}

module.exports = new PatientService();
