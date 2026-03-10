const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const env = require("../config/env.config");
const { HTTP_STATUS, ROLES } = require("../constants");

/**
 * Authenticate user via Access Token
 */
const authenticate = asyncHandler(async (req, _res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Authentication required. Please login.",
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
      "User not found or account is deactivated",
    );
  }

  // Lifecycle log (debugging)
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[Auth] Authenticated → id=${user._id} | role=${user.role} | ${req.method} ${req.originalUrl}`,
    );
  }

  req.user = user;

  next();
});

/**
 * Role-Based Access Control
 * Usage: authorize(ROLES.ADMIN)
 */
const authorize = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        `Access denied. Role '${req.user.role}' is not authorized to access this resource.`,
      );
    }

    next();
  };
};

/**
 * Ownership Authorization
 * Allows user to access only their own data
 * Admin can bypass
 */
const authorizeOwner = (req, _res, next) => {
  const paramId = req.params.id;
  const userId = req.user._id.toString();
  const isAdmin = req.user.role === ROLES.ADMIN;

  if (paramId !== userId && !isAdmin) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Access denied. You can only access your own data.",
    );
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  authorizeOwner,
};
