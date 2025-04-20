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
  FaChalkboardTeacher,
  FaCheck,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

export default function SingleTopic() {
  const [topic, setTopic] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${globalBackendRoute}/api/get-topic-by-id/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTopic(res.data))
      .catch((err) => console.error("Error fetching topic:", err));
  }, [id]);

  const handleUpdate = () => navigate(`/update-topic/${id}`);

  if (!topic) return <div className="text-center py-8">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="containerWidth my-6"
    >
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="headingText">Topic Details</h2>
          <Link to="/all-topics">
            <button className="fileUploadBtn text-sm py-1 px-3">
              View All Topics
            </button>
          </Link>
        </div>

        <div className="border-t border-gray-200 divide-y divide-gray-100">
          <DetailField icon={<FaBook />} label="Title" value={topic.title} />
          <DetailField
            icon={<FaClipboardList />}
            label="Description"
            value={topic.description}
          />
          <DetailField
            icon={<FaClock />}
            label="Estimated Hours"
            value={`${topic.estimatedHours} hrs`}
          />
          <DetailField
            icon={<FaCode />}
            label="Lecture Count"
            value={topic.lectureCount}
          />
          <DetailField
            icon={<FaChalkboardTeacher />}
            label="Assigned TA"
            value={topic.assignedTA?.name || "None"}
          />
          <DetailField
            icon={<FaFlask />}
            label="Lab Requirement"
            value={topic.labRequirement ? "Yes" : "No"}
          />
          <DetailField
            icon={<FaUsers />}
            label="Learning Objectives"
            value={topic.learningObjectives?.join(", ")}
          />
          <DetailField
            icon={<FaUsers />}
            label="Subtopics"
            value={topic.subtopics?.join(", ")}
          />
          <DetailField
            icon={<FaCalendarAlt />}
            label="Week Number"
            value={topic.weekNumber}
          />
          <DetailField
            icon={<FaClipboardList />}
            label="Session Plan"
            value={topic.sessionPlan}
          />
          <DetailField
            icon={<FaCheck />}
            label="Assessment Included"
            value={topic.assessmentIncluded ? "Yes" : "No"}
          />
          <DetailField
            icon={<FaLink />}
            label="Discussion Forum"
            value={topic.discussionForumLink}
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
