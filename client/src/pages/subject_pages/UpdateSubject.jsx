import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBook,
  FaUniversity,
  FaCalendarAlt,
  FaCode,
  FaHourglassHalf,
  FaClipboardList,
  FaCheck,
} from "react-icons/fa";
import { MdSave } from "react-icons/md";
import { useParams, useNavigate, Link } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

export default function UpdateSubject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseCode: "",
    semester: "",
    department: "",
    academicYear: "",
    creditHours: "",
    isElective: false,
    teacher: "",
  });

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${globalBackendRoute}/api/get-subject-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching subject:", err);
      }
    };

    fetchSubject();
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
        `${globalBackendRoute}/api/update-subject/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Subject updated successfully!");
      navigate(`/single-subject/${id}`);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update subject.");
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
          <h2 className="headingText">Update Subject Details</h2>
          <Link to="/all-subjects">
            <button className="fileUploadBtn text-sm py-1 px-3">
              View All Subjects
            </button>
          </Link>
        </div>

        {renderField("Subject Title", "title", <FaBook />)}
        {renderField("Description", "description", <FaClipboardList />)}
        {renderField("Course Code", "courseCode", <FaCode />)}
        {renderField("Semester", "semester", <FaHourglassHalf />)}
        {renderField("Department", "department", <FaUniversity />)}
        {renderField("Academic Year", "academicYear", <FaCalendarAlt />)}
        {renderField(
          "Credit Hours",
          "creditHours",
          <FaClipboardList />,
          "number"
        )}

        <div className="flex items-center gap-3 px-2 mt-4">
          <input
            type="checkbox"
            name="isElective"
            checked={formData.isElective}
            onChange={handleChange}
            id="isElective"
          />
          <label htmlFor="isElective" className="formLabel">
            Mark as Elective
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
