// models/User.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: "User" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
    avatar: { type: String }, // Field to store the avatar path
    phone: { type: String }, // Field to store phone number
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    shipping_addresses: [addressSchema], // Array of shipping addresses

    role: {
      type: String,
      enum: [
        "vendor", // System Administrator
        "superadmin", // Super Administrator
        "admin",
        "user", // Default role, customer
        "employee",
        "outlet",
        "delivery_agent",
      ],
      default: "user", // Default role
    },
    privileges: { type: [String], default: [] },

    // New fields for company and GST details
    companyName: { type: String }, // Optional field for the user's company
    companyAddress: { type: String },
    companyEmail: { type: String },
    gstNumber: { type: String }, // Optional field for GST number

    // Checkbox for promotional materials
    promotionalConsent: { type: Boolean, default: false }, // Defaults to not receiving promotions

    createdAt: { type: Date, default: Date.now }, // Timestamp for record creation
    updatedAt: { type: Date, default: Date.now }, // Timestamp for last update
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
