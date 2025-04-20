const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Subject title is required"],
    },
    description: {
      type: String,
      default: "",
    },
    courseCode: {
      type: String,
      required: [true, "Course code is required"],
      unique: true,
      uppercase: false,
      trim: true,
    },
    semester: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "6", "7", "8"],
      required: [true, "Semester is required"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: [
        "Computer Science",
        "Electronics",
        "Mechanical",
        "Civil",
        "Electrical",
        "Information Science",
        "Biotechnology",
        "Physics",
        "Chemistry",
        "Mathematics",
      ],
    },
    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      match: [/^\d{4}-\d{4}$/, "Academic year must be in format YYYY-YYYY"],
    },
    creditHours: {
      type: Number,
      required: [true, "Credit hours are required"],
      min: [1, "Credit hours must be at least 1"],
      max: [10, "Credit hours can't exceed 10"],
    },
    isElective: {
      type: Boolean,
      default: false,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (value) {
          const user = await mongoose.model("User").findById(value);
          return user && user.role === "teacher";
        },
        message: "Assigned user must be a teacher",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subject", subjectSchema);
