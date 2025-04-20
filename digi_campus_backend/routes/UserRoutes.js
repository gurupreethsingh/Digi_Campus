const express = require("express");
const {
  loginSuperadmin,
  teacherLogin,
  studentLogin,
  forgotPassword,
  verifyOTP,
  resetPassword,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getTotalUserCount,
  getStudentCount,
  getTeacherCount,
  getSuperadminCount,
  getLoggedInUser,
  registerPublicUser,
} = require("../controllers/UserController.js");

const multer = require("multer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const User = require("../models/UserModel.js");

const router = express.Router();

// === Auth Middleware ===
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// === Multer Setup ===
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

// === Public Auth Routes ===
router.post("/register", upload.single("avatar"), registerPublicUser);

router.post("/login-superadmin", loginSuperadmin);
router.post("/teacher-login", teacherLogin);
router.post("/student-login", studentLogin);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// === Protected User Routes ===
router.put(
  "/update-user/:id",
  authenticateToken,
  upload.single("avatar"),
  updateUser
);
router.delete("/delete-user/:id", authenticateToken, deleteUser);

router.get("/all-users", authenticateToken, getAllUsers);
router.get("/user/:id", authenticateToken, getUserById);
router.get("/user", authenticateToken, getLoggedInUser);

// === Count Routes ===
router.get("/get-totaluser-count", authenticateToken, getTotalUserCount);
router.get("/get-student-count", authenticateToken, getStudentCount);
router.get("/get-teacher-count", authenticateToken, getTeacherCount);
router.get("/get-superadmin-count", authenticateToken, getSuperadminCount);

module.exports = router;
