// services/prescription.service.js
const Prescription = require("../models/prescription.model");
const Patient = require("../models/patient.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, PLANS } = require("../constants");
const PDFDocument = require("pdfkit");
const aiService = require("./ai.service");

class PrescriptionService {
  /**
   * Create a new prescription
   */
  createPrescription = async (data, doctorId, subscriptionPlan) => {
    const {
      patientId,
      appointmentId,
      diagnosis,
      medicines,
      instructions,
      followUpDate,
    } = data;

    // Verify patient exists
    const patientExists = await Patient.findOne({
      _id: patientId,
      isActive: true,
    });
    if (!patientExists) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Patient not found");
    }

    const prescription = await Prescription.create({
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      medicines,
      instructions,
      followUpDate,
    });

    // Generate AI explanation asynchronously if Admin is PRO
    if (subscriptionPlan === PLANS.PRO) {
      aiService
        .explainPrescription({
          diagnosis,
          medicines,
          instructions,
        })
        .then((aiExplanation) => {
          Prescription.findByIdAndUpdate(prescription._id, {
            $set: { aiExplanation: aiExplanation?.explanation || null },
          }).catch((err) =>
            console.error("Failed to update AI explanation:", err.message),
          );
        })
        .catch((err) =>
          console.error("AI explanation generation failed:", err.message),
        );
    }

    return prescription;
  };

  /**
   * Get all prescriptions for a patient
   * Supports both direct patientId or linked userId
   */
  getPatientPrescriptions = async (identifier) => {
    // 1. Resolve patient record from identifier (it could be a direct ID or userId)
    const patient = await Patient.findOne({
      $or: [{ _id: identifier }, { userId: identifier }],
      isActive: true,
    });

    const targetPatientId = patient ? patient._id : identifier;

    const prescriptions = await Prescription.find({
      patientId: targetPatientId,
    })
      .populate("doctorId", "name email")
      .sort({ createdAt: -1 });

    return prescriptions;
  };

  /**
   * Get all prescriptions issued by a doctor
   */
  getDoctorPrescriptions = async (doctorId) => {
    const prescriptions = await Prescription.find({ doctorId })
      .populate("patientId", "name age gender contact")
      .sort({ createdAt: -1 });

    return prescriptions;
  };

  /**
   * Get single prescription by ID
   */
  getPrescriptionById = async (id) => {
    const prescription = await Prescription.findById(id)
      .populate("patientId", "name age gender contact")
      .populate("doctorId", "name email");

    if (!prescription) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Prescription not found");
    }

    return prescription;
  };

  /**
   * Update a prescription (Doctor only)
   */
  updatePrescription = async (id, updateData) => {
    // Prevent updating protected fields
    delete updateData.patientId;
    delete updateData.doctorId;

    const prescription = await Prescription.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    )
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
  generatePdfBuffer = async (prescriptionId) => {
    const prescription = await this.getPrescriptionById(prescriptionId);
    const clinicHeader = "ClinicOS Digital Prescription";

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      // 🏢 Header
      doc
        .fontSize(22)
        .fillColor("#0f172a") // slate-900
        .text(clinicHeader, {
          align: "center",
          bold: true,
        });

      doc.fontSize(10).fillColor("#64748b").text("Healthcare Excellence Node", {
        align: "center",
      });

      doc.moveDown(2);
      doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#e2e8f0").stroke();
      doc.moveDown(2);

      // 🏥 Details Row
      const dateStr = new Date(prescription.createdAt).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      );

      doc
        .fontSize(10)
        .fillColor("#1e293b")
        .text(`DATE: ${dateStr.toUpperCase()}`, { align: "right" });
      doc.moveDown();

      doc
        .fontSize(12)
        .fillColor("#0f172a")
        .text("PATIENT INFORMATION", { bold: true });
      doc
        .fontSize(11)
        .fillColor("#334155")
        .text(`Name: ${prescription.patientId.name}`);
      doc.text(
        `Details: ${prescription.patientId.age} years / ${prescription.patientId.gender.toUpperCase()}`,
      );
      doc.text(`Contact: ${prescription.patientId.contact}`);
      doc.moveDown();

      doc
        .fontSize(12)
        .fillColor("#0f172a")
        .text("MEDICAL PRACTITIONER", { bold: true });
      doc
        .fontSize(11)
        .fillColor("#334155")
        .text(`Dr. ${prescription.doctorId.name}`);
      doc.text(
        `Medical Node ID: ${prescription.doctorId._id.toString().slice(-8).toUpperCase()}`,
      );
      doc.moveDown(2);

      // Diagnosis Section
      doc
        .rect(50, doc.y, 500, 40)
        .fill("#f8fafc")
        .strokeColor("#e2e8f0")
        .stroke();
      doc.y += 10;
      doc.fontSize(14).fillColor("#0f172a").text(" DIAGNOSIS", { bold: true });
      doc.fontSize(11).fillColor("#475569").text(` ${prescription.diagnosis}`);
      doc.moveDown(2.5);

      // 💊 Medicines
      doc
        .fontSize(14)
        .fillColor("#0f172a")
        .text("PRESCRIPTION ORDERS / RX", { bold: true });
      doc.moveDown(1);

      prescription.medicines.forEach((med, idx) => {
        doc
          .fontSize(11)
          .fillColor("#0f172a")
          .text(`${idx + 1}. ${med.name.toUpperCase()} (${med.dosage})`, {
            bold: true,
          });
        doc
          .fontSize(10)
          .fillColor("#64748b")
          .text(`   Frequency: ${med.frequency} | Duration: ${med.duration}`);
        if (med.instructions) {
          doc
            .fontSize(10)
            .fillColor("#475569")
            .text(`   Note: ${med.instructions}`, { oblique: true });
        }
        doc.moveDown(0.5);
      });

      doc.moveDown(1.5);
      if (prescription.instructions) {
        doc
          .fontSize(14)
          .fillColor("#0f172a")
          .text("ADDITIONAL INSTRUCTIONS", { bold: true });
        doc.fontSize(11).fillColor("#475569").text(prescription.instructions);
        doc.moveDown(2);
      }

      // 🧠 AI Insight Layer (Premium PRO feature)
      if (prescription.aiExplanation) {
        doc
          .rect(50, doc.y, 500, 100)
          .fill("#f0fdf4")
          .strokeColor("#bbf7d0")
          .stroke();
        doc.y += 10;
        doc
          .fontSize(12)
          .fillColor("#15803d")
          .text(" ✨ CLINIC-OS AI INSIGHTS (BETA)", { bold: true });
        doc
          .fontSize(10)
          .fillColor("#166534")
          .text(prescription.aiExplanation.slice(0, 400), {
            width: 480,
            align: "justify",
          });
        doc.moveDown();
      }

      doc.end();
    });
  };

  /**
   * Delete a prescription
   */
  deletePrescription = async (id) => {
    const prescription = await Prescription.findByIdAndDelete(id);

    if (!prescription) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Prescription not found");
    }

    return prescription;
  };
}

module.exports = new PrescriptionService();
