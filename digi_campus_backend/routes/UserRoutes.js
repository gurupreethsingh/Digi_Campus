const express = require("express");
const {
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
} = require("../controllers/UserController.js");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const User = require("../models/UserModel.js");
const authMiddleware = require("../authMiddleware.js");

const router = express.Router();

// Middleware to authenticate the logged-in user
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token validated. Decoded payload:", decoded); // Debug log
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    console.error("Invalid token:", err.message); // Debug log
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Middleware to require admin role
const requireAdmin = (req, res, next) => {
  if (req.user && ["admin", "superadmin"].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ error: "Permission denied" });
  }
};

// Set up multer storage for handling file uploads
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const user = await User.findById(req.params.id);
      const role = user?.role || "others";
      const uploadFolder = path.join("uploads", role);

      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      cb(null, uploadFolder);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

// Routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Protected routes
router.put(
  "/update-user/:id",
  authenticateToken,
  upload.single("avatar"),
  updateUser
);

// Protected routes
router.put(
  "/update-shipping-address/:id",
  authenticateToken,
  upload.single("avatar"),
  updateShippingAddress
);

// count routes.
router.get("/get-totaluser-count", authenticateToken, getTotalUserCount);
router.get("/get-superadmin-count", authenticateToken, getSuperAdminCount);
router.get("/get-customer-count", authenticateToken, getUserCount);
router.get("/get-admin-count", authenticateToken, getAdminCount);
router.get("/get-employee-count", authenticateToken, getEmployeeCount);
// delete user route
router.delete("/delete-user/:id", authenticateToken, requireAdmin, deleteUser);
// Routes
router.get("/all-users", authenticateToken, requireAdmin, getAllUsers);
router.get("/user/:id", authenticateToken, getUserById);

// Route to fetch all superadmins
router.get("/get-all-superadmins", authenticateToken, getAllSuperAdmins);

// Route to fetch all admins
router.get("/get-all-admins", authenticateToken, getAllAdmins);

// Route to fetch all customers
router.get("/get-all-customers", authenticateToken, getAllCustomers);

// Route to fetch all employees
router.get("/get-all-employees", authenticateToken, getAllEmployees);

//  getLoggedInUser,
router.get("/user", authenticateToken, getLoggedInUser);

router.get("/user/:id/shipping-address", authenticateToken, getShippingAddress);

router.put(
  "/update-user-role/:id",
  authMiddleware,
  updateUserRoleAndPrivileges
);

router.get(
  "/get-logged-in-user",
  authenticateToken,
  getLoggedInUserForRoleChange
);

router.delete(
  "/user/:id/shipping-address/:index",
  authenticateToken,
  deleteShippingAddress
);

// fetching all the deivery agents.
// Route to fetch all delivery agents
router.get("/delivery-agents", getAllDeliveryAgents);

module.exports = router;
