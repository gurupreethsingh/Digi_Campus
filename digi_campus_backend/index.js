const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken"); // For token verification
const path = require("path");
const fs = require("fs");

//import user routes.
const UserRoutes = require("./routes/UserRoutes");
const ContactRoutes = require("./routes/ContactRoutes");
const BlogRoutes = require("./routes/BlogRoutes");
const SubjectRoutes = require("./routes/SubjectRoutes");
const TopicRoutes = require("./routes/TopicRoutes");
const QuizRoutes = require("./routes/QuizRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Replace with your frontend's URL
    credentials: true, // Enable credentials
  })
);

app.use(express.json());
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", UserRoutes);
app.use("/api", ContactRoutes);
app.use("/api", BlogRoutes);
app.use("/api", SubjectRoutes);
app.use("/api", TopicRoutes);
app.use("/api", QuizRoutes);

const PORT = process.env.PORT || 3009;

mongoose
  .connect("mongodb://127.0.0.1:27017/digi_campus")
  .then(() => {
    console.log("Connected to mongodb.");
  })
  .catch((err) => {
    console.log("Connection to mongo db failed,", err);
  });

app.listen(PORT, () => {
  console.log(`Connected to server successfully at port number ${PORT}`);
});
