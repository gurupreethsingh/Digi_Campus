// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: "User" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
    avatar: { type: String }, // Optional profile picture path
    phone: { type: String }, // Optional phone number

    address: { type: String }, // Simplified address as a single string

    role: {
      type: String,
      enum: ["superadmin", "teacher", "student"],
      default: "student",
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

module.exports = mongoose.model("User", userSchema);
