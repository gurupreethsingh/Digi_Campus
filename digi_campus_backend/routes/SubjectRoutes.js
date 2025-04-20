const express = require("express");
const router = express.Router();
const {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  countSubjects,
} = require("../controllers/SubjectController");

const jwt = require("jsonwebtoken");

// 🔒 Auth Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// ✅ Routes
router.post("/add-subject", authenticateToken, createSubject);
router.get("/get-all-subjects", authenticateToken, getAllSubjects);
router.get("/get-subject-by-id/:id", authenticateToken, getSubjectById);
router.put("/update-subject/:id", authenticateToken, updateSubject);
router.delete("/delete-subject/:id", authenticateToken, deleteSubject);
router.get("/count-all-subjects", authenticateToken, countSubjects);

module.exports = router;
