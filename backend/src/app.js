const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");

const corsOptions = require("./config/cors.config");
const env = require("./config/env.config");
const { globalLimiter } = require("./middlewares/rateLimiter.middleware");
const { errorHandler, notFoundHandler } = require("./middlewares/error.middleware");
const routes = require("./routes");

const app = express();

// ── Security ──
app.use(helmet());
app.use(cors(corsOptions));
app.use(hpp());

// ── Rate Limiting ──
app.use(globalLimiter);

// ── Body Parsing ──
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ── Custom Mongo Sanitizer (replaces express-mongo-sanitize) ──
const sanitize = (obj) => {
  if (obj && typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else {
        sanitize(obj[key]);
      }
    }
  }
  return obj;
};

app.use((req, _res, next) => {
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  next();
});

// ── Logging ──
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

// ── Health Check ──
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "🏥 Server is healthy",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ──
app.use("/api/v1", routes);

// ── Error Handling (must be last) ──
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;