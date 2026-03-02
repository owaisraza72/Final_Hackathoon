/**
 * Base URL: /api/v1/auth
 *
 * POST /register      - Register new Admin
 * POST /login         - Login user
 * POST /logout        - Logout user
 * POST /refresh-token - Refresh access token
 * GET  /me            - Get current user profile
 */

const { Router } = require("express");
const {
  register,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
} = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const { authLimiter } = require("../middlewares/rateLimiter.middleware");

const router = Router();

// ── Public Routes ──

// @route   POST /api/v1/auth/register
// @desc    Register a new Admin (Clinic Owner)
// @body    { "name": "John Doe", "email": "admin@example.com", "password": "Password123!" }
router.post("/register", authLimiter, validate(registerSchema), register);

// @route   POST /api/v1/auth/login
// @desc    Login and receive JWT in cookies
// @body    { "email": "admin@example.com", "password": "Password123!" }
router.post("/login", authLimiter, validate(loginSchema), login);

// @route   POST /api/v1/auth/refresh-token
// @desc    Rotate access token using refresh token cookie
router.post("/refresh-token", refreshAccessToken);

// ── Protected Routes ──

// @route   POST /api/v1/auth/logout
// @desc    Invalidate current session and clear cookies
router.post("/logout", authenticate, logout);

// @route   GET /api/v1/auth/me
// @desc    Get details of the currently logged-in user
router.get("/me", authenticate, getCurrentUser);

module.exports = router;
