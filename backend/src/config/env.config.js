const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const buildMongoURI = () => {
  const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, MONGODB_URI } = process.env;
  if (MONGODB_URI) return MONGODB_URI;
  if (DB_USERNAME && DB_PASSWORD && DB_NAME && DB_HOST) {
    return `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
  }
  if (DB_NAME) return `mongodb://localhost:27017/${DB_NAME}`;
  return null;
};

const envConfig = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT, 10) || 5000,

  // Database
  MONGODB_URI: buildMongoURI(),

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || "15m",
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || "7d",

  // Client
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
});

// ── Validate required env vars ──
const required = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];
const missing = required.filter((key) => !envConfig[key]);

if (missing.length > 0) {
  throw new Error(
    `❌ Missing required environment variables: ${missing.join(", ")}`
  );
}

module.exports = envConfig;