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

// ── Public ──
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh-token", refreshAccessToken);

// ── Protected ──
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getCurrentUser);

module.exports = router;