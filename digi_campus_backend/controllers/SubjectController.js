const mongoose = require("mongoose");
const Subject = require("../models/SubjectModel");
const User = require("../models/UserModel");

// ✅ Create a subject
const createSubject = async (req, res) => {
  try {
    const {
      title,
      description,
      courseCode,
      semester,
      department,
      academicYear,
      creditHours,
      isElective,
      teacher,
      createdBy,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(teacher)) {
      return res.status(400).json({ error: "Invalid teacher ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ error: "Invalid createdBy ID" });
    }

    const teacherUser = await User.findById(teacher);
    if (!teacherUser || teacherUser.role !== "teacher") {
      return res
        .status(400)
        .json({ error: "Assigned user must be a valid teacher" });
    }

    const subject = await Subject.create({
      title,
      description,
      courseCode,
      semester,
      department,
      academicYear,
      creditHours,
      isElective,
      teacher,
      createdBy,
    });

    res.status(201).json(subject);
  } catch (error) {
    console.error("Subject creation error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get all subjects
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate("teacher", "name email");
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single subject by ID
const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid subject ID" });
    }

    const subject = await Subject.findById(id).populate(
      "teacher",
      "name email"
    );
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update subject
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid subject ID" });
    }

    const {
      title,
      description,
      courseCode,
      semester,
      department,
      academicYear,
      creditHours,
      isElective,
      teacher,
      createdBy,
    } = req.body;

    const updatedData = {
      title,
      description,
      courseCode,
      semester,
      department,
      academicYear,
      creditHours,
      isElective,
      teacher,
      createdBy,
    };

    const subject = await Subject.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.status(200).json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete subject
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid subject ID" });
    }

    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Count subjects
const countSubjects = async (req, res) => {
  try {
    const count = await Subject.countDocuments();
    res.status(200).json({ totalSubjects: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  countSubjects,
};
