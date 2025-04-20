import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBook,
  FaUniversity,
  FaCalendarAlt,
  FaCode,
  FaHourglassHalf,
  FaClipboardList,
  FaCheck,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import globalBackendRoute from "../../config/Config";

const AddSubject = () => {
  const navigate = useNavigate();
  const [teacherId, setTeacherId] = useState("");
  const [allTeachers, setAllTeachers] = useState([]);
  const [subject, setSubject] = useState({
    title: "",
    description: "",
    courseCode: "",
    semester: "1",
    department: "Computer Science",
    academicYear: "",
    creditHours: 3,
    isElective: false,
    teacher: "",
  });

  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const departments = [
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
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized access");

    try {
      const decoded = jwtDecode(token);
      setTeacherId(decoded.id);
    } catch (err) {
      console.error("Token decoding error", err);
    }

    const fetchTeachers = async () => {
      try {
        const res = await axios.get(`${globalBackendRoute}/api/all-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const teachers = res.data.filter((u) => u.role === "teacher");
        setAllTeachers(teachers);
      } catch (err) {
        console.error("Error fetching teachers", err);
      }
    };

    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSubject((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const payload = { ...subject, createdBy: teacherId };
      await axios.post(`${globalBackendRoute}/api/add-subject`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Subject added successfully!");
      navigate("/teacher-dashboard");
    } catch (err) {
      console.error("Error adding subject", err.response || err);
      alert("Failed to add subject.");
    }
  };

  const formGroupClass = "grid grid-cols-1 sm:grid-cols-3 items-center gap-4";

  return (
    <div className="fullWidth py-10">
      <div className="compactWidth">
        <h2 className="headingText text-center">Add New Subject</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Title */}
          <div className={formGroupClass}>
            <label className="formLabel flex items-center gap-2">
              <FaBook className="text-indigo-600" /> Subject Title
            </label>
            <input
              type="text"
              name="title"
              value={subject.title}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              required
            />
          </div>

          {/* Description */}
          <div className={formGroupClass}>
            <label className="formLabel flex items-center gap-2">
              <FaClipboardList className="text-pink-600" /> Description
            </label>
            <textarea
              name="description"
              value={subject.description}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              rows="3"
            />
          </div>

          {/* Course Code */}
          <div className={formGroupClass}>
            <label className="formLabel flex items-center gap-2">
              <FaCode className="text-gray-600" /> Course Code
            </label>
            <input
              type="text"
              name="courseCode"
              value={subject.courseCode}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              required
            />
          </div>

          {/* Academic Year */}
          <div className={formGroupClass}>
            <label className="formLabel flex items-center gap-2">
              <FaCalendarAlt className="text-amber-600" /> Academic Year
            </label>
            <input
              type="text"
              name="academicYear"
              value={subject.academicYear}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              placeholder="e.g., 2024-2025"
              required
            />
          </div>

          {/* Semester */}
          <div className={formGroupClass}>
            <label className="formLabel flex items-center gap-2">
              <FaHourglassHalf className="text-lime-600" /> Semester
            </label>
            <select
              name="semester"
              value={subject.semester}
              onChange={handleChange}
              className="formInput sm:col-span-2"
            >
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className={formGroupClass}>
            <label className="formLabel flex items-center gap-2">
              <FaUniversity className="text-blue-600" /> Department
            </label>
            <select
              name="department"
              value={subject.department}
              onChange={handleChange}
              className="formInput sm:col-span-2"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Credit Hours */}
          <div className={formGroupClass}>
            <label className="formLabel flex items-center gap-2">
              <FaClipboardList className="text-purple-600" /> Credit Hours
            </label>
            <input
              type="number"
              name="creditHours"
              value={subject.creditHours}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              min={1}
              max={10}
              required
            />
          </div>

          {/* Elective */}
          <div className="flex items-center gap-3 px-2">
            <input
              type="checkbox"
              name="isElective"
              checked={subject.isElective}
              onChange={handleChange}
              id="isElective"
            />
            <label htmlFor="isElective" className="formLabel">
              Mark as Elective Subject
            </label>
          </div>

          {/* Teacher Selection */}
          <div className={formGroupClass}>
            <label className="formLabel flex items-center gap-2">
              <FaChalkboardTeacher className="text-orange-500" /> Assigned
              Teacher
            </label>
            <select
              name="teacher"
              value={subject.teacher}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              required
            >
              <option value="">-- Select a Teacher --</option>
              {allTeachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.email})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-4">
            <button
              type="submit"
              className="primaryBtn px-6 py-2 flex items-center gap-2 mx-auto"
            >
              <FaCheck className="text-white" /> Add Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubject;
