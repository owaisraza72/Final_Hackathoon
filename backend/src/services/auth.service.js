const jwt = require("jsonwebtoken");
const User = require("../models/user.model"); // ✅ Fixed: was wrongly importing patient.model
const Patient = require("../models/patient.model"); // ✅ needed to create patient profile on self-register

const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, ROLES, PLANS } = require("../constants");
const env = require("../config/env.config");

class AuthService {
  /**
   * Generate access + refresh tokens and persist refresh token in DB
   * Accepts the live user document directly to avoid extra DB round-trip
   * and issues with select:false fields.
   */
  async generateTokens(user) {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  }

  /**
   * Register new user (self-registration)
   * Also creates a Patient record so they appear in the clinic's patient list
   */
  async register({ name, email, password }) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "User with this email already exists",
      );
    }

    // Create the User auth account
    const user = await User.create({
      name,
      email,
      password,
      role: ROLES.PATIENT,
      subscriptionPlan: PLANS.FREE,
      isActive: true,
    });

    // ── Also create a Patient medical record ──
    // So this patient appears in receptionist's patient list
    const existingPatient = await Patient.findOne({ email, isActive: true });
    if (!existingPatient) {
      await Patient.create({
        name,
        email,
        userId: user._id, // LINK TO AUTH ACCOUNT
        // contact is required in Patient model — use email prefix as placeholder
        contact:
          email.split("@")[0].replace(/[^0-9+\-\s]/g, "") || "00000000000",
        age: 0, // placeholder — patient should update profile later
        gender: "other", // placeholder
        createdBy: user._id, // self-registered
        isActive: true,
      });
    } else if (!existingPatient.userId) {
      existingPatient.userId = user._id;
      await existingPatient.save({ validateBeforeSave: false });
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);

    const userData = user.toJSON();

    return {
      user: userData,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user
   */
  async login({ email, password }) {
    const user = await User.findOne({ email, isActive: true }).select(
      "+password",
    );

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);

    // ── SYNC: Link existing Patient record by email if not already linked ──
    if (user.role === ROLES.PATIENT) {
      const existingPatient = await Patient.findOne({
        email: user.email,
        isActive: true,
      });

      if (existingPatient && !existingPatient.userId) {
        existingPatient.userId = user._id;
        await existingPatient.save({ validateBeforeSave: false });
      }
    }

    const userData = user.toJSON();

    return {
      user: userData,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logout user
   */
  async logout(userId) {
    await User.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 },
    });
  }

  /**
   * Rotate refresh token
   */
  async refreshToken(oldRefreshToken) {
    if (!oldRefreshToken) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Refresh token is required");
    }

    let decoded;

    try {
      decoded = jwt.verify(oldRefreshToken, env.JWT_REFRESH_SECRET);
    } catch {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Invalid or expired refresh token",
      );
    }

    const user = await User.findById(decoded._id).select("+refreshToken");

    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);

    return { accessToken, refreshToken };
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    return user.toJSON();
  }
}

module.exports = new AuthService();
