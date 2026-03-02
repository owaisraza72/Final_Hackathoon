const { HTTP_STATUS, ROLES } = require("../constants");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Role-based access
 * Usage: authorize(ROLES.ADMIN, ROLES.DOCTOR)
 */
const authorize = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Authentication required");
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        `Access denied. Role '${user.role}' is not authorized.`,
      );
    }

    next();
  });
};

module.exports = { authorize };
