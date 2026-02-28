const mongoose = require("mongoose");
const { PLANS } = require("../constants");

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Clinic name is required"],
      trim: true,
    },
    address: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    subscriptionPlan: {
      type: String,
      enum: Object.values(PLANS),
      default: PLANS.FREE,
    },
    maxPatients: {
      type: Number,
      default: 20, // FREE plan limit
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Clinic", clinicSchema);