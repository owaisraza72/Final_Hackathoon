const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");
const env = require("../config/env.config");
const logger = require("../utils/logger");

// ── Central Error Handler ──
const errorHandler = (err, req, res, _next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    // Mongoose Validation Error
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      error = new ApiError(HTTP_STATUS.BAD_REQUEST, "Validation Error", errors);
    }
    // Mongoose Duplicate Key (11000)
    else if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      error = new ApiError(
        HTTP_STATUS.CONFLICT,
        `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      );
    }
    // Mongoose Bad ObjectId
    else if (err.name === "CastError") {
      error = new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        `Invalid ${err.path}: ${err.value}`
      );
    }
    // JWT Errors
    else if (err.name === "JsonWebTokenError") {
      error = new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid token");
    } else if (err.name === "TokenExpiredError") {
      error = new ApiError(HTTP_STATUS.UNAUTHORIZED, "Token has expired");
    }
    // Fallback
    else {
      error = new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        err.message || "Internal Server Error"
      );
    }
  }

  logger.error(
    `${error.statusCode} - ${error.message} - ${req.method} ${req.originalUrl}`
  );

  res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// ── 404 Handler ──
const notFoundHandler = (req, _res, next) => {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `Route not found: ${req.originalUrl}`));
};

module.exports = { errorHandler, notFoundHandler };