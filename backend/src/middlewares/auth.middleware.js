const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const env = require("../config/env.config");
const { HTTP_STATUS } = require("../constants");

/**
 * Verifies access token from cookies or Authorization header.
 * Attaches authenticated user to req.user
 */
const authenticate = asyncHandler(async (req, _res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Authentication required. Please login."
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
  } catch {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid or expired token");
  }

  const user = await User.findById(decoded._id);

  if (!user || !user.isActive) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "User not found or account is deactivated"
    );
  }

  req.user = user;
  next();
});

/**
 * RBAC — Restrict access to specific roles
 * Usage: authorize("admin") or authorize("admin", "moderator")
 */
const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Authentication required"
      );
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        `Access denied. Role '${req.user.role}' is not authorized to access this resource.`
      );
    }

    next();
  };
};

/**
 * Ownership check — ensures user can only access their own data
 * Compares req.params.id with req.user._id
 * Admins can bypass this check
 */
const authorizeOwner = (req, _res, next) => {
  const paramId = req.params.id;
  const userId = req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (paramId !== userId && !isAdmin) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Access denied. You can only access your own data."
    );
  }

  next();
};

module.exports = { authenticate, authorize, authorizeOwner };