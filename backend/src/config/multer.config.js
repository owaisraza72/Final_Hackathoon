const multer = require("multer");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");

// ── Use memory storage (buffer) — no temp files on disk ──
const storage = multer.memoryStorage();

// ── File filter — only images ──
const fileFilter = (_req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid file type. Only JPEG, JPG, PNG, and WEBP are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1,
  },
});

module.exports = upload;