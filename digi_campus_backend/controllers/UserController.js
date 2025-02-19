// controllers/UserController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel.js");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv");
const twilio = require("twilio");
const fs = require("fs");
const path = require("path");

dotenv.config();

// Helper to send email
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

// helper function to send messages.
// Initialize Twilio client with environment variables
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
// Function to send SMS
const sendSMS = async (phone, message) => {
  try {
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Twilio number
      to: phone, // Recipient's phone number
    });
    console.log("SMS sent with SID: " + sms.sid);
  } catch (error) {
    console.error("Error sending SMS:", error.message);
  }
};

// Register a new user
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      companyName,
      companyAddress,
      companyEmail,
      gstNumber,
      promotionalConsent,
    } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      name: name?.trim() || "User",
      email,
      password: hashedPassword,
      companyName,
      companyAddress,
      companyEmail,
      gstNumber,
      promotionalConsent: promotionalConsent || false,
    });

    // Send a welcome email
    sendEmail(
      email,
      "Welcome to Our Application",
      `Hello ${newUser.name}, Welcome!`
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};



//updated login code.

const login = async (req, res) => {
  try {
    const { email, loginType } = req.body;

    if (loginType === "google") {
      // Check if the user exists in the database
      let user = await User.findOne({ email });
      if (!user) {
        // Create a new user if not found
        user = await User.create({
          name: email.split("@")[0], // Placeholder name from email
          email,
          role: "user", // Default role
        });
      }

      // Generate a JWT token for the user
      const token = jwt.sign(
        { id: user._id, name: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ token, user });
    } else {
      // Handle email-password login
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "User not found" });

      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordCorrect)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user._id, name: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ token, user });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot Password - Send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
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

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp });
    if (!user || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res
      .status(200)
      .json({ message: "OTP verified. Proceed to reset password." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    console.log("Reset Password Request Received:");
    console.log("Email:", email);
    console.log("OTP:", otp);
    console.log("New Password:", newPassword);

    const user = await User.findOne({ email, otp });
    console.log("User found:", user);

    // Check if user exists and if OTP has not expired
    if (!user) {
      console.log("User not found or invalid OTP");
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (user.otpExpires < Date.now()) {
      console.log("OTP expired");
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash and update the password
    user.password = await bcrypt.hash(newPassword, 10);
    console.log("Password hashed");

    // Clear the OTP fields after successful reset
    user.otp = undefined;
    user.otpExpires = undefined;

    // Save the updated user with the new password
    await user.save();
    console.log("User saved with new password");

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      companyName,
      companyAddress,
      companyEmail,
      gstNumber,
      promotionalConsent,
    } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...JSON.parse(address) };
    if (companyName) user.companyName = companyName;
    if (companyAddress) user.companyAddress = companyAddress;
    if (companyEmail) user.companyEmail = companyEmail;
    if (gstNumber) user.gstNumber = gstNumber;
    if (promotionalConsent !== undefined)
      user.promotionalConsent = promotionalConsent;

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

// Update shipping address or add a new one
const updateShippingAddress = async (req, res) => {
  try {
    const { shipping_address } = req.body;

    if (!shipping_address) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const parsedAddress =
      typeof shipping_address === "string"
        ? JSON.parse(shipping_address)
        : shipping_address;

    user.shipping_addresses.push(parsedAddress);
    await user.save();

    res
      .status(200)
      .json({ message: "Shipping address added successfully", user });
  } catch (error) {
    console.error("Error updating shipping address:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findByIdAndDelete(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userToDelete.avatar) {
      const imagePath = path.join(__dirname, "..", userToDelete.avatar);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// count functions.
// Fetch the total count of all users (irrespective of roles)
const getTotalUserCount = async (req, res) => {
  try {
    const totalUserCount = await User.countDocuments();
    res.status(200).json({ totalUserCount });
  } catch (error) {
    console.error("Error fetching total user count:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch the count of users with the role of 'superadmin'
const getSuperAdminCount = async (req, res) => {
  try {
    const superAdminCount = await User.countDocuments({ role: "superadmin" });
    res.status(200).json({ superAdminCount });
  } catch (error) {
    console.error("Error fetching superadmin count:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch the count of users with the role of 'user'
const getUserCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: "user" });
    res.status(200).json({ userCount });
  } catch (error) {
    console.error("Error fetching user count:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch the count of users with the role of 'admin'
const getAdminCount = async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    res.status(200).json({ adminCount });
  } catch (error) {
    console.error("Error fetching admin count:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all users with the role of 'employee'
const getEmployeeCount = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllSuperAdmins = async (req, res) => {
  try {
    const superAdmins = await User.find({ role: "superadmin" }).select(
      "-password"
    ); // Exclude password
    res.status(200).json(superAdmins);
  } catch (error) {
    console.error("Error fetching superadmins:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password"); // Exclude password
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password"); // Exclude password
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password"); // Exclude password
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getShippingAddress = async (req, res) => {
  try {
    const userId = req.params.id;

    // Log the incoming userId for debugging
    console.log("Fetching shipping address for user ID:", userId);

    const user = await User.findById(userId).select("shipping_address");
    if (!user) {
      console.error("User not found for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Handle missing shipping_address field
    if (!user.shipping_address) {
      console.warn("Shipping address not found for user ID:", userId);
      return res.status(404).json({ message: "Shipping address not found" });
    }

    res.status(200).json({ shippingAddress: user.shipping_address });
  } catch (error) {
    console.error("Error fetching shipping address:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getLoggedInUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add privileges or a default role if missing
    const userData = {
      ...user._doc,
      privileges: user.role || ["user"], // Example default privilege
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching logged-in user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getLoggedInUserForRoleChange = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add privileges or a default role if missing
    const userData = {
      ...user._doc,
      privileges: user.role || ["user"], // Example default privilege
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching logged-in user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//update roles and previlages.
// Update user role and privileges
const updateUserRoleAndPrivileges = async (req, res) => {
  try {
    const { role, privileges } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update role and privileges
    if (role) user.role = role;
    if (privileges) user.privileges = privileges;

    await user.save();
    res.status(200).json({ message: "User role and privileges updated", user });
  } catch (error) {
    console.error("Error updating user role and privileges:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// remove shipping address from the index.
const deleteShippingAddress = async (req, res) => {
  try {
    const userId = req.params.id; // Extract user ID from URL
    const index = parseInt(req.params.index, 10); // Extract index from URL

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      index === undefined ||
      isNaN(index) ||
      index < 0 ||
      index >= user.shipping_addresses.length
    ) {
      return res.status(400).json({ message: "Invalid address index" });
    }

    // Remove the selected shipping address
    user.shipping_addresses.splice(index, 1);
    await user.save();

    res.status(200).json({
      message: "Shipping address deleted successfully",
      shippingAddresses: user.shipping_addresses,
    });
  } catch (error) {
    console.error("Error deleting shipping address:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// fetching all the delivery_agents.
// Fetch all users with the role of 'delivery_agent'
const getAllDeliveryAgents = async (req, res) => {
  try {
    const deliveryAgents = await User.find({ role: "delivery_agent" }).select(
      "-password"
    ); // Exclude password
    res.status(200).json(deliveryAgents);
  } catch (error) {
    console.error("Error fetching delivery agents:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  // Add the new function to the exports
  deleteShippingAddress,
};

// Export functions
module.exports = {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateShippingAddress,
  getTotalUserCount,
  getSuperAdminCount,
  getUserCount,
  getAdminCount,
  getEmployeeCount,
  getAllSuperAdmins,
  getAllAdmins,
  getAllCustomers,
  getAllEmployees,
  getShippingAddress,
  getLoggedInUser,
  updateUserRoleAndPrivileges,
  getLoggedInUserForRoleChange,
  deleteShippingAddress,
  getAllDeliveryAgents,
};
