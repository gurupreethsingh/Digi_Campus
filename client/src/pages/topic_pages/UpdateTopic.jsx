import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBook,
  FaClipboardList,
  FaCode,
  FaClock,
  FaUsers,
  FaLink,
  FaFlask,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdSave } from "react-icons/md";
import { useParams, useNavigate, Link } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

export default function UpdateTopic() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    estimatedHours: "",
    lectureCount: "",
    sessionPlan: "",
    discussionForumLink: "",
    labRequirement: false,
    assessmentIncluded: false,
    learningObjectives: [],
    subtopics: [],
    weekNumber: "",
  });

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${globalBackendRoute}/api/get-topic-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching topic:", err);
      }
    };
    fetchTopic();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${globalBackendRoute}/api/update-topic/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Topic updated successfully!");
      navigate(`/single-topic/${id}`);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update topic.");
    }
  };

  const renderField = (label, name, icon, type = "text") => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 px-2 sm:px-4">
      <dt className="flex items-center text-sm font-medium text-gray-700 gap-2">
        {icon} {label}
      </dt>
      <dd className="mt-1 sm:col-span-2 sm:mt-0">
        <input
          type={type}
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          className="w-full text-sm border-b border-gray-300 bg-transparent focus:outline-none"
        />
      </dd>
    </div>
  );

  return (
    <div className="containerWidth my-6">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="headingText">Update Topic</h2>
          <Link to="/all-topics">
            <button className="fileUploadBtn text-sm py-1 px-3">
              View All Topics
            </button>
          </Link>
        </div>

        {renderField("Title", "title", <FaBook />)}
        {renderField("Description", "description", <FaClipboardList />)}
        {renderField(
          "Estimated Hours",
          "estimatedHours",
          <FaClock />,
          "number"
        )}
        {renderField("Lecture Count", "lectureCount", <FaCode />, "number")}
        {renderField("Session Plan", "sessionPlan", <FaClipboardList />)}
        {renderField(
          "Discussion Forum Link",
          "discussionForumLink",
          <FaLink />
        )}
        {renderField("Week Number", "weekNumber", <FaCalendarAlt />, "number")}

        <div className="flex items-center gap-3 px-2 mt-4">
          <input
            type="checkbox"
            name="assessmentIncluded"
            checked={formData.assessmentIncluded}
            onChange={handleChange}
            id="assessmentIncluded"
          />
          <label htmlFor="assessmentIncluded" className="formLabel">
            Assessment Included
          </label>
        </div>

        <div className="flex items-center gap-3 px-2 mt-4">
          <input
            type="checkbox"
            name="labRequirement"
            checked={formData.labRequirement}
            onChange={handleChange}
            id="labRequirement"
          />
          <label htmlFor="labRequirement" className="formLabel">
            Requires Lab
          </label>
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="primaryBtn w-fit px-4 flex items-center gap-2 rounded-full mx-auto"
          >
            <MdSave /> Save
          </button>
        </div>
      </form>
    </div>
  );
}
