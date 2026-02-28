const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");
const env = require("../config/env.config");

class AuthService {
  /**
   * Generate access + refresh tokens and persist refresh token in DB
   */
  async generateTokens(userId) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  }

  /**
   * Register new user
   */
  async register({ name, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "User with this email already exists"
      );
    }

    const user = await User.create({ name, email, password });
    const { accessToken, refreshToken } = await this.generateTokens(user._id);
    const userData = user.toJSON();

    return { user: userData, accessToken, refreshToken };
  }

  /**
   * Login user
   */
  async login({ email, password }) {
    // Always use generic message to prevent user enumeration
    const user = await User.findOne({ email, isActive: true }).select(
      "+password"
    );
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await this.generateTokens(user._id);
    const userData = user.toJSON();

    return { user: userData, accessToken, refreshToken };
  }

  /**
   * Logout user — remove refresh token from DB
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
        "Invalid or expired refresh token"
      );
    }

    const user = await User.findById(decoded._id).select("+refreshToken");
    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = await this.generateTokens(user._id);
    return { accessToken, refreshToken };
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    return user;
  }
}

module.exports = new AuthService();