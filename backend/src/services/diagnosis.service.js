// services/diagnosis.service.js
const DiagnosisLog = require("../models/diagnosisLog.model");
const Patient = require("../models/patient.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");

class DiagnosisService {
  /**
   * Create a new diagnosis log record
   */
  createDiagnosisLog = async (data, doctorId, clinicId) => {
    const { patientId, symptoms, additionalNotes, riskLevel, doctorNotes } =
      data;

    // Verify patient exists and belongs to the clinical context
    const patientExists = await Patient.findOne({ _id: patientId, clinicId });
    if (!patientExists) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Patient not found in this clinic",
      );
    }

    const diagnosisRecord = await DiagnosisLog.create({
      patientId,
      doctorId,
      clinicId,
      symptoms,
      additionalNotes: additionalNotes || "",
      doctorNotes: doctorNotes || "",
      riskLevel: riskLevel || "low",
      isAiFallback: false, // Not an AI generated record yet
    });

    return diagnosisRecord;
  };

  /**
   * Get all diagnosis logs for a patient
   */
  getPatientDiagnoses = async (patientId, clinicId) => {
    const logs = await DiagnosisLog.find({ patientId, clinicId })
      .populate("doctorId", "name email")
      .sort({ createdAt: -1 });

    return logs;
  };

  /**
   * Get single diagnosis log by id
   */
  getDiagnosisById = async (id, clinicId) => {
    const log = await DiagnosisLog.findOne({ _id: id, clinicId })
      .populate("patientId", "name age gender")
      .populate("doctorId", "name email");

    if (!log) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Diagnosis record not found");
    }

    return log;
  };
}

module.exports = new DiagnosisService();
