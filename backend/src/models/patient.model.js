const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
      max: [150, "Age seems invalid"],
    },

    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },

    contact: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9+\-\s]{7,20}$/, "Please provide a valid contact number"],
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
    },

    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"],
      default: "unknown",
    },

    medicalHistory: [
      {
        condition: String,
        diagnosedAt: Date,
        notes: String,
      },
    ],

    allergies: [{ type: String }],

    emergencyContact: {
      name: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      relation: {
        type: String,
        default: "",
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// ─────────────────────────────
// PASSWORD HASHING (Mongoose 8 Compatible)
// ─────────────────────────────
patientSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─────────────────────────────
// COMPARE PASSWORD
// ─────────────────────────────
patientSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;

  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Patient", patientSchema);
