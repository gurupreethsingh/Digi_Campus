const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken"); // For token verification
const path = require("path");
const fs = require("fs");


//import user routes.
const userRoutes = require("./routes/UserRoutes");

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
app.use("/api", userRoutes);


const PORT = process.env.PORT || 3008;

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