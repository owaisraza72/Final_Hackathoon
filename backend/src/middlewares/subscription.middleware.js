const User = require("../models/user.model");
const Patient = require("../models/patient.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, PLANS, ROLES } = require("../constants");

const getClinicAdmin = async () => {
  const admin = await User.findOne({ role: ROLES.ADMIN, isActive: true });
  if (!admin) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Clinic Admin not found");
  }
  return admin;
};

/**
 * requirePro — blocks access if admin is on FREE plan
 * Use on routes that require PRO features (e.g., AI)
 */
const requirePro = async (req, _res, next) => {
  try {
    const admin = await getClinicAdmin();

    if (admin.subscriptionPlan !== PLANS.PRO) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        "This feature requires a PRO subscription. Please upgrade to access AI insights.",
      );
    }

    req.admin = admin;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * attachAdmin — attaches admin to req.admin (no plan restriction)
 * Use on routes that just need admin/environment info
 */
const attachAdmin = async (req, _res, next) => {
  try {
    const admin = await getClinicAdmin();
    req.admin = admin;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * checkPatientLimit — FREE plan max 10 patients (as per hackathon requirements)
 * Use before registerPatient route
 */
const checkPatientLimit = async (req, _res, next) => {
  try {
    const admin = await getClinicAdmin();

    if (admin.subscriptionPlan === PLANS.PRO) {
      req.admin = admin;
      return next();
    }

    const LIMIT = 10;
    const patientCount = await Patient.countDocuments({ isActive: true });

    if (patientCount >= LIMIT) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        `Patient limit reached (max ${LIMIT} on FREE plan). Upgrade to PRO for unlimited patients.`,
      );
    }

    req.admin = admin;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { requirePro, attachAdmin, checkPatientLimit };
