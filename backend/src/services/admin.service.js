// services/admin.service.js
const User = require("../models/user.model");
const Clinic = require("../models/clinic.model");
const Patient = require("../models/patient.model");
const Appointment = require("../models/appointment.model");
const Prescription = require("../models/prescription.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, ROLES, PLANS } = require("../constants");
const bcrypt = require("bcryptjs");

class AdminService {
  // ── Create Doctor / Receptionist ──
  createUser = async ({ name, email, password, role, clinicId }) => {
    if (![ROLES.DOCTOR, ROLES.RECEPTIONIST].includes(role)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid role. Must be DOCTOR or RECEPTIONIST",
      );
    }

    const exists = await User.findOne({ email });
    if (exists) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "User with this email already exists",
      );
    }

    // Verify clinic exists
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Clinic not found");
    }

    const defaultPassword = password || "Clinic@123"; // default password

    const newUser = await User.create({
      name,
      email,
      password: defaultPassword,
      role,
      clinicId,
      isActive: true,
    });

    return newUser.toJSON();
  };

  // ── List Users by Role (within clinic) ──
  listUsersByRole = async (role, clinicId) => {
    const validRoles = [ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.PATIENT];
    if (!validRoles.includes(role)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid role filter");
    }

    const users = await User.find({ role, clinicId, isActive: true })
      .select("-refreshToken -password")
      .sort({ createdAt: -1 });

    return users;
  };

  // ── Update User ──
  updateUser = async (id, updateData) => {
    // Prevent changing role to ADMIN
    if (updateData.role === ROLES.ADMIN) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        "Cannot assign ADMIN role this way",
      );
    }

    // Don't allow password update here (use separate endpoint)
    delete updateData.password;
    delete updateData.refreshToken;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    return user.toJSON();
  };

  // ── Deactivate User (soft delete) ──
  deleteUser = async (id) => {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true },
    );

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    return { message: "User deactivated successfully", userId: user._id };
  };

  // ── Get Real Analytics ──
  getAnalytics = async (clinicId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      doctors,
      receptionists,
      totalPatients,
      totalAppointments,
      todayAppointments,
      totalPrescriptions,
      clinic,
    ] = await Promise.all([
      User.countDocuments({ role: ROLES.DOCTOR, clinicId, isActive: true }),
      User.countDocuments({
        role: ROLES.RECEPTIONIST,
        clinicId,
        isActive: true,
      }),
      Patient.countDocuments({ clinicId, isActive: true }),
      Appointment.countDocuments({ clinicId }),
      Appointment.countDocuments({ clinicId, date: { $gte: today } }),
      Prescription.countDocuments({ clinicId }),
      Clinic.findById(clinicId),
    ]);

    // Simple revenue simulation based on plan and usage
    const simulatedRevenue = clinic?.subscriptionPlan === PLANS.PRO ? 49.99 : 0;

    return {
      overview: {
        doctors,
        receptionists,
        totalPatients,
        totalAppointments,
        todayAppointments,
        totalPrescriptions,
      },
      business: {
        plan: clinic?.subscriptionPlan,
        maxPatients: clinic?.maxPatients,
        revenue: simulatedRevenue.toFixed(2),
        currency: "USD",
      },
      clinicName: clinic?.name,
    };
  };

  // ── Update Clinic Subscription Plan ──
  updateClinicPlan = async (clinicId, plan) => {
    if (!Object.values(PLANS).includes(plan)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid plan. Must be FREE or PRO",
      );
    }

    const clinic = await Clinic.findByIdAndUpdate(
      clinicId,
      {
        $set: {
          subscriptionPlan: plan,
          maxPatients: plan === PLANS.PRO ? 999999 : 20,
        },
      },
      { new: true },
    );

    if (!clinic) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Clinic not found");
    }

    return clinic;
  };
}

module.exports = new AdminService();
