// services/prescription.service.js
const Prescription = require("../models/prescription.model");
const Patient = require("../models/patient.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");
const PDFDocument = require("pdfkit"); // Will be installed in final phase

class PrescriptionService {
  /**
   * Create a new prescription
   */
  createPrescription = async (data, doctorId, clinicId) => {
    const {
      patientId,
      appointmentId,
      diagnosis,
      medicines,
      instructions,
      followUpDate,
    } = data;

    // Verify patient exists and belongs to the same clinic
    const patientExists = await Patient.findOne({ _id: patientId, clinicId });
    if (!patientExists) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Patient not found in this clinic",
      );
    }

    const prescription = await Prescription.create({
      patientId,
      doctorId,
      appointmentId,
      clinicId,
      diagnosis,
      medicines,
      instructions,
      followUpDate,
    });

    return prescription;
  };

  /**
   * Get all prescriptions for a patient
   */
  getPatientPrescriptions = async (patientId, clinicId) => {
    const prescriptions = await Prescription.find({ patientId, clinicId })
      .populate("doctorId", "name email")
      .sort({ createdAt: -1 });

    return prescriptions;
  };

  /**
   * Get single prescription by ID
   */
  getPrescriptionById = async (id, clinicId) => {
    const prescription = await Prescription.findOne({ _id: id, clinicId })
      .populate("patientId", "name age gender contact")
      .populate("doctorId", "name email");

    if (!prescription) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Prescription not found");
    }

    return prescription;
  };

  /**
   * Generate PDF buffer for printing/download
   */
  generatePdfBuffer = async (prescriptionId, clinicId) => {
    const prescription = await this.getPrescriptionById(
      prescriptionId,
      clinicId,
    );

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      // 🏢 Clinic Info Header
      doc
        .fontSize(20)
        .text("ClinicOS Medical Report", { align: "center", underline: true });
      doc.moveDown();

      // 🏥 Prescription Details
      doc.fontSize(12);
      doc.text(
        `Prescription Date: ${new Date(prescription.createdAt).toLocaleDateString()}`,
      );
      doc.text(
        `Patient: ${prescription.patientId.name} (${prescription.patientId.age}y / ${prescription.patientId.gender})`,
      );
      doc.text(`Doctor: Dr. ${prescription.doctorId.name}`);
      doc.moveDown();

      doc.fontSize(14).text("Diagnosis:", { underline: true });
      doc.fontSize(11).text(prescription.diagnosis);
      doc.moveDown();

      // 💊 Medicines Table Header
      doc.fontSize(14).text("Medicines:", { underline: true });
      doc.moveDown(0.5);

      prescription.medicines.forEach((med, idx) => {
        doc.fontSize(11).text(`${idx + 1}. ${med.name} - ${med.dosage}`);
        doc
          .fontSize(9)
          .text(`   Frequency: ${med.frequency} | Duration: ${med.duration}`, {
            color: "grey",
          });
        if (med.instructions) {
          doc.fontSize(9).text(`   (Note: ${med.instructions})`);
        }
        doc.moveDown(0.5);
      });

      doc.moveDown();
      if (prescription.instructions) {
        doc.fontSize(14).text("Additional Instructions:", { underline: true });
        doc.fontSize(11).text(prescription.instructions);
      }

      if (prescription.followUpDate) {
        doc.moveDown();
        doc
          .fontSize(12)
          .text(
            `Next Follow-up: ${new Date(prescription.followUpDate).toLocaleDateString()}`,
            { oblique: true },
          );
      }

      doc.end();
    });
  };
}

module.exports = new PrescriptionService();
