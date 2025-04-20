const express = require("express");
const router = express.Router();
const {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopic,
  deleteTopic,
  countTopics,
} = require("../controllers/TopicController");

const jwt = require("jsonwebtoken");

// 🔐 Auth Middleware
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

// ✅ Topic Routes
router.post("/add-topic", authenticateToken, createTopic);
router.get("/get-all-topics", authenticateToken, getAllTopics);
router.get("/get-topic-by-id/:id", authenticateToken, getTopicById);
router.put("/update-topic/:id", authenticateToken, updateTopic);
router.delete("/delete-topic/:id", authenticateToken, deleteTopic);
router.get("/count-all-topics", authenticateToken, countTopics);

module.exports = router;
