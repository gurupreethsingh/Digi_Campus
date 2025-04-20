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
  FaChalkboardTeacher,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

export default function SingleSubject() {
  const [subject, setSubject] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${globalBackendRoute}/api/get-subject-by-id/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSubject(res.data))
      .catch((err) => console.error("Error fetching subject:", err.message));
  }, [id]);

  const handleUpdate = () => navigate(`/update-subject/${id}`);

  if (!subject) return <div className="text-center py-8">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="containerWidth my-6"
    >
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="headingText">Subject Details</h2>
          <Link to="/all-subjects">
            <button className="fileUploadBtn text-sm py-1 px-3">
              View All Subjects
            </button>
          </Link>
        </div>

        <div className="border-t border-gray-200 divide-y divide-gray-100">
          <DetailField icon={<FaBook />} label="Title" value={subject.title} />
          <DetailField
            icon={<FaClipboardList />}
            label="Description"
            value={subject.description}
          />
          <DetailField
            icon={<FaCode />}
            label="Course Code"
            value={subject.courseCode}
          />
          <DetailField
            icon={<FaHourglassHalf />}
            label="Semester"
            value={subject.semester}
          />
          <DetailField
            icon={<FaUniversity />}
            label="Department"
            value={subject.department}
          />
          <DetailField
            icon={<FaCalendarAlt />}
            label="Academic Year"
            value={subject.academicYear}
          />
          <DetailField
            icon={<FaClipboardList />}
            label="Credit Hours"
            value={subject.creditHours}
          />
          <DetailField
            icon={<FaCheck />}
            label="Is Elective"
            value={subject.isElective ? "Yes" : "No"}
          />
          <DetailField
            icon={<FaChalkboardTeacher />}
            label="Assigned Teacher"
            value={subject.teacher?.name}
          />
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleUpdate}
            className="primaryBtn w-fit px-4 flex items-center gap-2 rounded-full mx-auto"
          >
            <MdEdit /> Update
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DetailField({ icon, label, value }) {
  return (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 px-2 sm:px-4">
      <dt className="flex items-center text-sm font-medium text-gray-700 gap-2">
        {icon} {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        {value || "N/A"}
      </dd>
    </div>
  );
}
