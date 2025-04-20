import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBook,
  FaClock,
  FaListAlt,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaUsers,
  FaUserGraduate,
  FaGlobe,
  FaUpload,
  FaPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import globalBackendRoute from "../../config/Config";

const AddTopic = () => {
  const navigate = useNavigate();
  const [allSubjects, setAllSubjects] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [topic, setTopic] = useState({
    title: "",
    description: "",
    subject: "",
    learningObjectives: [],
    subtopics: [],
    lectureCount: 1,
    estimatedHours: 2,
    deliveryMode: "offline",
    resources: [],
    weekNumber: 1,
    sessionPlan: "",
    assessmentIncluded: false,
    syllabusTag: "core",
    status: "active",
    feedbackCount: 0,
    completionRate: 0,
    linkedOutcomes: [],
    prerequisiteTopics: [],
    discussionForumLink: "",
    labRequirement: false,
    assignedTA: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized");
    const decoded = jwtDecode(token);
    setTeacherId(decoded.id);

    const fetchSubjects = async () => {
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/get-all-subjects`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAllSubjects(res.data);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };

    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTopic((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayInput = (e, key) => {
    setTopic((prev) => ({
      ...prev,
      [key]: e.target.value.split(",").map((s) => s.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const payload = {
        ...topic,
        lastUpdatedBy: teacherId,
      };

      // FIX: Remove assignedTA if empty string
      if (!payload.assignedTA) {
        delete payload.assignedTA;
      }

      await axios.post(`${globalBackendRoute}/api/add-topic`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Topic added successfully!");
      navigate("/all-topics");
    } catch (err) {
      console.error("Error adding topic:", err.response?.data || err);
      alert("Failed to add topic.");
    }
  };

  const inputGroup = "grid grid-cols-1 sm:grid-cols-3 items-center gap-4";

  return (
    <div className="fullWidth py-10">
      <div className="compactWidth">
        <h2 className="headingText text-center">Add New Topic</h2>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className={inputGroup}>
            <label className="formLabel flex items-center gap-2">
              <FaBook /> Topic Title
            </label>
            <input
              type="text"
              name="title"
              value={topic.title}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              required
            />
          </div>

          <div className={inputGroup}>
            <label className="formLabel flex items-center gap-2">
              <FaListAlt /> Description
            </label>
            <textarea
              name="description"
              value={topic.description}
              onChange={handleChange}
              rows="3"
              className="formInput sm:col-span-2"
            />
          </div>

          <div className={inputGroup}>
            <label className="formLabel flex items-center gap-2">
              <FaChalkboardTeacher /> Select Subject
            </label>
            <select
              name="subject"
              value={topic.subject}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              required
            >
              <option value="">-- Select Subject --</option>
              {allSubjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.title} ({s.courseCode})
                </option>
              ))}
            </select>
          </div>

          <div className={inputGroup}>
            <label className="formLabel flex items-center gap-2">
              <FaUsers /> Learning Objectives
            </label>
            <input
              type="text"
              onChange={(e) => handleArrayInput(e, "learningObjectives")}
              placeholder="Comma separated list"
              className="formInput sm:col-span-2"
            />
          </div>

          <div className={inputGroup}>
            <label className="formLabel flex items-center gap-2">
              <FaPlus /> Subtopics
            </label>
            <input
              type="text"
              onChange={(e) => handleArrayInput(e, "subtopics")}
              placeholder="Comma separated list"
              className="formInput sm:col-span-2"
            />
          </div>

          <div className={inputGroup}>
            <label className="formLabel flex items-center gap-2">
              <FaClock /> Estimated Hours
            </label>
            <input
              type="number"
              name="estimatedHours"
              value={topic.estimatedHours}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              min={0.5}
            />
          </div>

          <div className={inputGroup}>
            <label className="formLabel flex items-center gap-2">
              <FaGlobe /> Delivery Mode
            </label>
            <select
              name="deliveryMode"
              value={topic.deliveryMode}
              onChange={handleChange}
              className="formInput sm:col-span-2"
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex items-center gap-3 px-2">
            <input
              type="checkbox"
              name="assessmentIncluded"
              checked={topic.assessmentIncluded}
              onChange={handleChange}
              id="assessmentIncluded"
            />
            <label htmlFor="assessmentIncluded" className="formLabel">
              Include Assessment?
            </label>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="primaryBtn px-6 py-2 flex items-center gap-2 mx-auto"
            >
              <FaUpload /> Add Topic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTopic;
