// controllers/UserController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel.js");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

// === Email Helper ===
const sendEmail = (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error(err);
    else console.log("Email sent: " + info.response);
  });
};

// === Register Functions ===
const registerSuperadmin = async (req, res) =>
  registerWithRole(req, res, "superadmin");
const registerTeacher = async (req, res) =>
  registerWithRole(req, res, "teacher");
const registerStudent = async (req, res) =>
  registerWithRole(req, res, "student");

const registerWithRole = async (req, res, role) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarPath = req.file ? `uploads/${role}/${req.file.filename}` : null;

    const newUser = await User.create({
      name,
      email,
      phone,
      address,
      role,
      avatar: avatarPath,
      password: hashedPassword,
    });

    sendEmail(
      email,
      "Welcome!",
      `Hello ${name}, your ${role} account has been created.`
    );
    res.status(201).json({ message: `${role} registered successfully` });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// === Login Functions ===
const loginSuperadmin = async (req, res) =>
  loginWithRole(req, res, "superadmin");
const loginTeacher = async (req, res) => loginWithRole(req, res, "teacher");
const loginStudent = async (req, res) => loginWithRole(req, res, "student");

const loginWithRole = async (req, res, role) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role });

    if (!user) return res.status(404).json({ message: `${role} not found` });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// === Forgot / Reset Password ===
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    sendEmail(
      email,
      "Password Reset OTP",
      `Your OTP is ${otp}. It expires in 10 minutes.`
    );
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp });
    if (!user || user.otpExpires < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });
    res
      .status(200)
      .json({ message: "OTP verified. Proceed to reset password." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email, otp });
    if (!user || user.otpExpires < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// === User Fetching ===
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    if (req.file) {
      const newAvatarPath = `uploads/${user.role}/${req.file.filename}`;
      if (user.avatar) {
        const oldAvatarPath = path.join(__dirname, "..", user.avatar);
        if (fs.existsSync(oldAvatarPath)) fs.unlinkSync(oldAvatarPath);
      }
      user.avatar = newAvatarPath;
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findByIdAndDelete(req.params.id);
    if (!userToDelete) return res.status(404).json({ error: "User not found" });

    if (userToDelete.avatar) {
      const imagePath = path.join(__dirname, "..", userToDelete.avatar);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// === Count Functions ===
const getTotalUserCount = async (req, res) => {
  try {
    const totalUserCount = await User.countDocuments();
    res.status(200).json({ totalUserCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "student" });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeacherCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "teacher" });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSuperadminCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "superadmin" });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// === Logged-in User ===
const getLoggedInUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerPublicUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!["teacher", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    sendEmail(
      email,
      "Welcome!",
      `Hello ${name}, your ${role} account is created.`
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// === Exports ===
module.exports = {
  registerSuperadmin,
  registerTeacher,
  registerStudent,
  loginSuperadmin,
  loginTeacher,
  loginStudent,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getTotalUserCount,
  getStudentCount,
  getTeacherCount,
  getSuperadminCount,
  getLoggedInUser,
  registerPublicUser,
};
