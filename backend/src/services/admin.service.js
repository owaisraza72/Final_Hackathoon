// services/admin.service.js
const User = require("../models/user.model"); 
const Patient = require("../models/patient.model");
const Appointment = require("../models/appointment.model");
const Prescription = require("../models/prescription.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, ROLES, PLANS } = require("../constants");

class AdminService {
  /**
   * Create Doctor / Receptionist
   */
  createUser = async ({ name, email, password, role }) => {
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

    const newUser = await User.create({
      name,
      email,
      password: password || "Test@1234",
      role,
      isActive: true,
    });

    return newUser.toJSON();
  };

  /**
   * List Users by Role (associated with this admin)
   */
  listUsersByRole = async (role) => {
    const users = await User.find({
      role,
      isActive: true,
    })
      .select("-refreshToken -password")
      .sort({ createdAt: -1 });

    return users;
  };

  /**
   * Update User
   */
  updateUser = async (id, updateData) => {
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    delete updateData.password;
    delete updateData.refreshToken;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    return user.toJSON();
  };

  /**
   * Deactivate User
   */
  deleteUser = async (id) => {
    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true },
    );

    return { message: "User deactivated successfully", userId: user._id };
  };

  /**
   * Get Admin Analytics
   */
  getAnalytics = async (adminId) => {
    const [
      doctors,
      receptionists,
      totalPatients,
      totalAppointments,
      totalPrescriptions,
    ] = await Promise.all([
      User.countDocuments({ role: ROLES.DOCTOR, isActive: true }),
      User.countDocuments({ role: ROLES.RECEPTIONIST, isActive: true }),
      Patient.countDocuments({ isActive: true }),
      Appointment.countDocuments({}),
      Prescription.countDocuments({}),
    ]);

    const admin = await User.findById(adminId);
    if (!admin) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Admin not found");

    return {
      clinicName: "Clinic OS",
      overview: {
        totalPatients,
        doctors,
        receptionists,
        totalAppointments,
        totalPrescriptions,
        todayAppointments: Math.floor(totalAppointments / 30) || 0,
      },
      business: {
        plan: admin.subscriptionPlan,
        revenue: (totalAppointments * 50).toFixed(2),
      },
    };
  };

  /**
   * Update Subscription or Clinic Settings
   */
  updateSettings = async (adminId, { plan }) => {
    const update = {};
    if (plan) {
      if (!Object.values(PLANS).includes(plan)) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid plan");
      }
      update.subscriptionPlan = plan;
    }

    if (Object.keys(update).length === 0) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "No settings provided to update",
      );
    }

    const admin = await User.findOneAndUpdate(
      { _id: adminId, role: ROLES.ADMIN },
      { $set: update },
      { new: true, runValidators: true },
    );

    if (!admin) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Admin not found");
    }

    return admin;
  };
}

module.exports = new AdminService();
