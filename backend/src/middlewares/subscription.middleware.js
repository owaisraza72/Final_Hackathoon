// middlewares/subscription.middleware.js
const Clinic = require("../models/clinic.model");
const Patient = require("../models/patient.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, PLANS } = require("../constants");

/**
 * requirePro — blocks access if clinic is on FREE plan
 * Use on routes that require PRO features (e.g., AI)
 */
const requirePro = async (req, _res, next) => {
  try {
    const clinicId = req.user?.clinicId;
    if (!clinicId) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Clinic not associated with your account",
      );
    }

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Clinic not found");
    }

    if (clinic.subscriptionPlan !== PLANS.PRO) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        "This feature requires a PRO subscription. Please upgrade your plan to access AI features and advanced analytics.",
        [{ field: "plan", message: "Upgrade to PRO required" }],
      );
    }

    // Attach clinic to request for downstream use
    req.clinic = clinic;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * attachClinic — attaches clinic to req.clinic (no plan restriction)
 * Use on routes that just need clinic info
 */
const attachClinic = async (req, _res, next) => {
  try {
    const clinicId = req.user?.clinicId;
    if (!clinicId) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Clinic not associated with your account",
      );
    }

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Clinic not found");
    }

    req.clinic = clinic;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * checkPatientLimit — FREE plan max 20 patients
 * Use before registerPatient route
 */
const checkPatientLimit = async (req, _res, next) => {
  try {
    const clinicId = req.user?.clinicId;
    if (!clinicId) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Clinic not associated with your account",
      );
    }

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Clinic not found");
    }

    // PRO plan: no patient limit
    if (clinic.subscriptionPlan === PLANS.PRO) {
      req.clinic = clinic;
      return next();
    }

    // FREE plan: count existing patients
    const patientCount = await Patient.countDocuments({
      clinicId,
      isActive: true,
    });

    if (patientCount >= clinic.maxPatients) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        `Patient limit reached (${clinic.maxPatients} max on FREE plan). Upgrade to PRO for unlimited patients.`,
        [
          {
            field: "plan",
            message: `Max ${clinic.maxPatients} patients allowed on FREE plan`,
          },
        ],
      );
    }

    req.clinic = clinic;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { requirePro, attachClinic, checkPatientLimit };
