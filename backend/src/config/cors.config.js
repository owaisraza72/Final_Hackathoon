const env = require("./env.config");

const corsOptions = {
  origin: function (origin, callback) {
    // Parse multiple URLs from CLIENT_URL (comma-separated)
    const allowedOrigins = env.CLIENT_URL.split(",").map(url => url.trim());

    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400, // 24 hours preflight cache
};

module.exports = corsOptions;