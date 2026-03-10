// services/diagnosis.service.js
const DiagnosisLog = require("../models/diagnosisLog.model");
const Patient = require("../models/patient.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");

class DiagnosisService {
  /**
   * Create a new diagnosis log record
   */
  createDiagnosisLog = async (data, doctorId) => {
    const { patientId, symptoms, additionalNotes, riskLevel, doctorNotes } =
      data;

    // Verify patient exists
    const patientExists = await Patient.findOne({
      _id: patientId,
      isActive: true,
    });
    if (!patientExists) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Patient not found");
    }

    const diagnosisRecord = await DiagnosisLog.create({
      patientId,
      doctorId,
      symptoms,
      additionalNotes: additionalNotes || "",
      doctorNotes: doctorNotes || "",
      riskLevel: riskLevel || "low",
      isAiFallback: false,
    });

    return diagnosisRecord;
  };

  /**
   * Get all diagnosis logs for a patient
   */
  getPatientDiagnoses = async (patientId) => {
    const logs = await DiagnosisLog.find({ patientId })
      .populate("doctorId", "name email")
      .sort({ createdAt: -1 });

    return logs;
  };

  /**
   * Get single diagnosis log by id
   */
  getDiagnosisById = async (id) => {
    const log = await DiagnosisLog.findById(id)
      .populate("patientId", "name age gender")
      .populate("doctorId", "name email");

    if (!log) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Diagnosis record not found");
    }

    return log;
  };
  /**
   * Update a diagnosis log
   */
  updateDiagnosis = async (id, data) => {
    const diagnosis = await DiagnosisLog.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    );

    if (!diagnosis) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Diagnosis record not found");
    }

    return diagnosis;
  };

  /**
   * Delete a diagnosis log
   */
  deleteDiagnosis = async (id) => {
    const diagnosis = await DiagnosisLog.findByIdAndDelete(id);

    if (!diagnosis) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Diagnosis record not found");
    }

    return diagnosis;
  };
}

module.exports = new DiagnosisService();
