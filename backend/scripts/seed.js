// scripts/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const Patient = require("../src/models/patient.model");
const Appointment = require("../src/models/appointment.model");
const { ROLES, PLANS } = require("../src/constants");

const SEED_EMAIL = "admin@clinic.com"; // Change as needed

const seedData = async () => {
  try {
    console.log("🚀 Starting Medical Matrix Seeding...");
    await mongoose.connect(process.env.MONGODB_URI);

    // 1. Find or Create Admin
    let admin = await User.findOne({ email: SEED_EMAIL });
    if (!admin) {
      console.log("Creating default Admin...");
      admin = await User.create({
        name: "Admin Developer",
        email: SEED_EMAIL,
        password: "admin123",
        role: ROLES.ADMIN,
        subscriptionPlan: PLANS.PRO,
        isActive: true,
      });
    }

    // 2. Create Doctors
    console.log("Seeding Medical Professionals...");
    const doctorData = [
      {
        name: "Dr. Sarah Chen",
        email: "sarah.chen@clinic.com",
        role: ROLES.DOCTOR,
      },
      {
        name: "Dr. James Wilson",
        email: "james.wilson@clinic.com",
        role: ROLES.DOCTOR,
      },
    ];

    const doctors = [];
    for (const d of doctorData) {
      let doc = await User.findOne({ email: d.email });
      if (!doc) {
        doc = await User.create({
          ...d,
          password: "doctor123",
          isActive: true,
        });
      }
      doctors.push(doc);
    }

    // 3. Create Receptionists
    console.log("Seeding Support Staff...");
    let recep = await User.findOne({ email: "recep@clinic.com" });
    if (!recep) {
      recep = await User.create({
        name: "Alex Support",
        email: "recep@clinic.com",
        password: "reception123",
        role: ROLES.RECEPTIONIST,
        isActive: true,
      });
    }

    // 4. Create Patients
    console.log("Seeding Patient Database...");
    const patientData = [
      { name: "Robert Miller", age: 45, gender: "male", contact: "555-0101" },
      { name: "Emily Watson", age: 28, gender: "female", contact: "555-0102" },
      { name: "John Doe", age: 60, gender: "male", contact: "555-0103" },
    ];

    const patients = [];
    for (const p of patientData) {
      let pat = await Patient.findOne({
        contact: p.contact,
        isActive: true,
      });
      if (!pat) {
        pat = await Patient.create({
          ...p,
          address: "123 Medical Way",
        });
      }
      patients.push(pat);
    }

    // 5. Create Appointments
    console.log("Scheduling Initial Queues...");
    const timeSlots = ["09:00", "10:30", "14:00"];
    for (let i = 0; i < patients.length; i++) {
      const date = new Date();
      date.setDate(date.getDate() + (i % 3));

      await Appointment.findOneAndUpdate(
        {
          patientId: patients[i]._id,
          doctorId: doctors[i % doctors.length]._id,
        },
        {
          patientId: patients[i]._id,
          doctorId: doctors[i % doctors.length]._id,
          receptionistId: recep._id,
          date: date,
          timeSlot: timeSlots[i % timeSlots.length],
          reason: "Routine Checkup",
          status: "pending",
        },
        { upsert: true },
      );
    }

    console.log("✅ Medical Node Synchronized successfully!");
    console.log("-----------------------------------------");
    console.log(`Admin Login: ${SEED_EMAIL} / admin123`);
    console.log(`Doctor Login: ${doctorData[0].email} / doctor123`);
    console.log(`Receptionist Login: recep@clinic.com / reception123`);
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedData();
