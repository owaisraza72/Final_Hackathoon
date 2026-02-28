const mongoose = require("mongoose");
const env = require("./env.config");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    logger.info(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(` MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;