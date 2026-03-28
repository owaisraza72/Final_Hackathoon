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

    // Notify Patient if linked to a user
    const patient = await Patient.findById(patientId);
    if (patient?.userId) {
      const doctor = await require("../models/user.model").findById(doctorId);
      require("./notification.service")
        .createNotification({
          recipient: patient.userId,
          title: "New Prescription Issued",
          message: `Dr. ${doctor?.name || "Practitioner"} has issued a new medical directive for you.`,
          type: "PRESCRIPTION",
          relatedId: prescription._id,
        })
        .catch((err) => console.error("Notification failed:", err.message));
    }

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
    // 1. Fetch prescription with full population
    const prescription = await this.getPrescriptionById(prescriptionId);
    console.log(`[PDF] STARTING GENERATION: ID ${prescriptionId}`);

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: "A4" });
        let buffers = [];

        doc.on("data", (chunk) => {
          if (chunk) buffers.push(chunk);
        });

        doc.on("end", () => {
          console.log(
            `[PDF] GENERATION FINISHED: ID ${prescriptionId} Chunks: ${buffers.length}`,
          );
          if (buffers.length === 0) {
            return reject(
              new ApiError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                "Generated PDF is empty",
              ),
            );
          }
          resolve(Buffer.concat(buffers));
        });

        doc.on("error", (err) => {
          console.error("PDFKit Stream Error:", err);
          reject(err);
        });

        const primaryTeal = "#14b8a6";
        const slate900 = "#0f172a";
        const slate500 = "#64748b";

        // Helvetica-safe Sanitizer (Strict ASCII)
        const s = (txt) =>
          String(txt || "")
            .replace(/[^\x00-\x7F]/g, "")
            .trim();

        // 🟢 Header (Logo and ID)
        doc.rect(0, 0, doc.page.width, 100).fill(primaryTeal);
        doc
          .fontSize(28)
          .fillColor("#ffffff")
          .text("ClinicOS", 50, 35, { bold: true });
        doc
          .fontSize(10)
          .fillColor("#ccfbf1")
          .text("Authorized Digital Health Node", 50, 65);

        const dDate = prescription.createdAt
          ? new Date(prescription.createdAt).toLocaleDateString()
          : "DATE UNKNOWN";
        doc
          .fontSize(10)
          .fillColor("#ffffff")
          .text(`Date: ${dDate}`, 350, 45, { width: 195, align: "right" });
        doc.text(
          `ID: PX-${prescription._id.toString().slice(-8).toUpperCase()}`,
          350,
          60,
          { width: 195, align: "right" },
        );

        // 🟢 Information Blocks
        doc.y = 130;
        const infoY = doc.y;

        // Patient Box
        doc
          .fillColor("#f1f5f9")
          .rect(50, infoY, 235, 80)
          .fill()
          .fillColor(primaryTeal)
          .fontSize(10)
          .text("PATIENT INFORMATION", 65, infoY + 10, { bold: true })
          .fillColor(slate900)
          .fontSize(12)
          .text(s(prescription.patientId?.name || "Patient Profile"), 65, infoY + 25, {
            bold: true,
          })
          .fillColor(slate500)
          .fontSize(9)
          .text(
            `Age: ${prescription.patientId?.age || "--"} | ${s(prescription.patientId?.gender || "--").toUpperCase()}`,
            65,
            infoY + 45,
          )
          .text(
            `Contact: ${s(prescription.patientId?.contact || "N/A")}`,
            65,
            infoY + 58,
          );

        // Doctor Box
        doc
          .fillColor("#f1f5f9")
          .rect(310, infoY, 235, 80)
          .fill()
          .fillColor(primaryTeal)
          .fontSize(10)
          .text("MEDICAL PRACTITIONER", 325, infoY + 10, { bold: true })
          .fillColor(slate900)
          .fontSize(12)
          .text(`Dr. ${s(prescription.doctorId?.name || "Practitioner")}`, 325, infoY + 25, {
            bold: true,
          })
          .fillColor(slate500)
          .fontSize(9)
          .text(
            `Validation ID: ${prescription.doctorId?._id.toString().slice(-8).toUpperCase()}`,
            325,
            infoY + 45,
          )
          .text(
            `Email: ${s(prescription.doctorId?.email || "N/A")}`,
            325,
            infoY + 58,
          );

        // 🟢 Diagnosis Area
        doc.y = infoY + 100;
        doc
          .fillColor(slate900)
          .fontSize(14)
          .text("Clinical Diagnosis", 50, doc.y, { bold: true });
        doc.moveDown(0.3);
        const diagY = doc.y;
        doc
          .fillColor("#f8fafc")
          .rect(50, diagY, 495, 30)
          .fill()
          .fillColor(primaryTeal)
          .fontSize(12)
          .text(s(prescription.diagnosis || "General Record"), 65, diagY + 8, {
            bold: true,
          });

        // 🟢 Medication List (Table)
        doc.y = diagY + 50;
        doc
          .fillColor(slate900)
          .fontSize(14)
          .text("Prescribed Medications", 50, doc.y, { bold: true });
        doc.moveDown(0.4);

        const tableTop = doc.y;
        doc
          .fillColor(primaryTeal)
          .rect(50, tableTop, 495, 25)
          .fill()
          .fillColor("#ffffff")
          .fontSize(9)
          .text("MEDICINE", 65, tableTop + 8, { bold: true })
          .text("DOSAGE", 250, tableTop + 8, { bold: true })
          .text("SCHEDULE / DURATION", 380, tableTop + 8, { bold: true });

        let currentY = tableTop + 25;
        const meds = Array.isArray(prescription.medicines)
          ? prescription.medicines
          : [];

        meds.forEach((m, idx) => {
          if (currentY > 700) {
            doc.addPage();
            currentY = 50;
          }
          doc
            .fillColor(idx % 2 === 0 ? "#ffffff" : "#f1f5f9")
            .rect(50, currentY, 495, 30)
            .fill()
            .fillColor(slate900)
            .fontSize(10)
            .text(s(m.name).toUpperCase(), 65, currentY + 10, { bold: true })
            .fillColor(slate500)
            .fontSize(10)
            .text(s(m.dosage), 250, currentY + 10)
            .text(`${s(m.frequency)} | ${s(m.duration)}`, 380, currentY + 10);
          currentY += 30;
        });

        // 🟢 Additional Instructions
        doc.y = currentY + 20;
        if (prescription.instructions) {
          if (doc.y > 650) doc.addPage();
          doc
            .fillColor(slate900)
            .fontSize(12)
            .text("System Directives", 50, doc.y, { bold: true });
          doc.moveDown(0.3);
          doc
            .fillColor(slate500)
            .fontSize(10)
            .text(s(prescription.instructions), 50, doc.y, { width: 495 });
        }

        // 🟢 AI Section (PRO)
        if (prescription.aiExplanation) {
          doc.moveDown(2);
          if (doc.y > 600) doc.addPage();
          const aiY = doc.y;
          const aiText = s(prescription.aiExplanation).slice(0, 1000);
          const aiH = doc.heightOfString(aiText, { width: 455 }) + 40;

          doc
            .fillColor("#f0fdfa")
            .rect(50, aiY, 495, aiH)
            .fill()
            .strokeColor(primaryTeal)
            .lineWidth(1)
            .stroke()
            .fillColor(primaryTeal)
            .fontSize(11)
            .text("ClinicOS Smart Insight (AI Interpretation)", 65, aiY + 10, {
              bold: true,
            })
            .fillColor(slate500)
            .fontSize(9)
            .text(aiText, 65, aiY + 25, { width: 455, align: "justify" });
        }

        // 🟢 Footer
        doc
          .fillColor("#94a3b8")
          .fontSize(8)
          .text(
            "This document is a cryptographically verified digital medical record generated by ClinicOS.",
            50,
            doc.page.height - 40,
            { align: "center", width: 495 },
          );

        doc.end();
      } catch (err) {
        console.error("PDF CORE CRASH:", err);
        reject(err);
      }
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

  /**
   * Get all prescriptions (Global Admin list)
   */
  getAllPrescriptions = async () => {
    const prescriptions = await Prescription.find({})
      .populate("patientId", "name age gender contact")
      .populate("doctorId", "name email")
      .sort({ createdAt: -1 });

    return prescriptions;
  };
}

module.exports = new PrescriptionService();
