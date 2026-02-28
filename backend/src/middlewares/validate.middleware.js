const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");

/**
 * Validates request body against a Zod schema.
 * Replaces req.body with parsed (sanitized) data on success.
 */
const validate = (schema) => (req, _res, next) => {
  try {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Zod v4 uses .issues, Zod v3 uses .errors — handle both
      const issues = result.error?.issues || result.error?.errors || [];
      const errors = Array.isArray(issues)
        ? issues.map((err) => ({
            field: Array.isArray(err.path) ? err.path.join(".") : "unknown",
            message: err.message,
          }))
        : [];

      return next(
        new ApiError(
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Validation failed",
          errors
        )
      );
    }

    req.body = result.data;
    next();
  } catch (error) {
    next(
      new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid request body")
    );
  }
};

module.exports = validate;