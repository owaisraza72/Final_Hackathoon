const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const authService = require("../services/auth.service");
const env = require("../config/env.config");
const { HTTP_STATUS } = require("../constants");

// ── Cookie Helpers ──
const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge,
});

const ACCESS_MAX_AGE = 15 * 60 * 1000;         // 15 min
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, cookieOptions(ACCESS_MAX_AGE));
  res.cookie("refreshToken", refreshToken, cookieOptions(REFRESH_MAX_AGE));
};

const clearTokenCookies = (res) => {
  const opts = cookieOptions(0);
  res.cookie("accessToken", "", opts);
  res.cookie("refreshToken", "", opts);
};

// ─────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
// ─────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(
    req.body
  );

  setTokenCookies(res, accessToken, refreshToken);

  res
    .status(HTTP_STATUS.CREATED)
    .json(
      new ApiResponse(HTTP_STATUS.CREATED, { user }, "User registered successfully")
    );
});

// ─────────────────────────────────────────
// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
// ─────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  setTokenCookies(res, accessToken, refreshToken);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { user }, "Logged in successfully"));
});

// ─────────────────────────────────────────
// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
// ─────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);
  clearTokenCookies(res);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, null, "Logged out successfully"));
});

// ─────────────────────────────────────────
// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
// @access  Public (needs refresh cookie)
// ─────────────────────────────────────────
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = await authService.refreshToken(
    req.cookies?.refreshToken
  );

  setTokenCookies(res, accessToken, refreshToken);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, null, "Token refreshed successfully"));
});

// ─────────────────────────────────────────
// @desc    Get current logged-in user
// @route   GET  /api/v1/auth/me
// @access  Private
// ─────────────────────────────────────────
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { user }, "User fetched successfully"));
});

module.exports = { register, login, logout, refreshAccessToken, getCurrentUser };