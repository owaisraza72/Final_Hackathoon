const env = require("./env.config");

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    const allowedOrigins = env.CLIENT_URL
      ? env.CLIENT_URL.split(",").map((url) => url.trim())
      : [];

    if (env.NODE_ENV === "development") {
      allowedOrigins.push("http://localhost:5173");
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};

module.exports = corsOptions;