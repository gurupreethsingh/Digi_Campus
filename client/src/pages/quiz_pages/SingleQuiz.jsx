import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBook,
  FaClipboardList,
  FaClock,
  FaRegCalendarCheck,
  FaQuestionCircle,
  FaChalkboardTeacher,
  FaTasks,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

export default function SingleQuiz() {
  const [quiz, setQuiz] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${globalBackendRoute}/api/get-quiz-by-id/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setQuiz(res.data.data))
      .catch((err) => console.error("Error fetching quiz:", err));
  }, [id]);

  const handleUpdate = () => navigate(`/update-quiz/${id}`);

  if (!quiz) return <div className="text-center py-8">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="containerWidth my-6"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* === LEFT SIDE === */}
        <div className="lg:w-1/2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="headingText">Quiz Details</h2>
            <Link to="/all-quizzes">
              <button className="fileUploadBtn text-sm py-1 px-3">
                View All Quizzes
              </button>
            </Link>
          </div>

          <div className="border-t border-gray-200 divide-y divide-gray-100">
            <DetailField icon={<FaBook />} label="Title" value={quiz.title} />
            <DetailField
              icon={<FaClipboardList />}
              label="Description"
              value={quiz.description}
            />
            <DetailField
              icon={<FaClock />}
              label="Duration"
              value={`${quiz.durationMinutes} mins`}
            />
            <DetailField
              icon={<FaRegCalendarCheck />}
              label="Schedule Date"
              value={new Date(quiz.scheduleDate).toLocaleDateString()}
            />
            <DetailField
              icon={<FaClock />}
              label="Start - End Time"
              value={`${quiz.startTime} - ${quiz.endTime}`}
            />
            <DetailField
              icon={<FaTasks />}
              label="Max Attempts"
              value={quiz.maxAttempts}
            />
            <DetailField
              icon={<FaChalkboardTeacher />}
              label="Created By"
              value={quiz.createdBy?.name || "N/A"}
            />
            <DetailField
              icon={<FaCheckCircle />}
              label="Published"
              value={quiz.isPublished ? "Yes" : "No"}
            />
            <DetailField
              icon={<FaCheckCircle />}
              label="Feedback Enabled"
              value={quiz.feedbackEnabled ? "Yes" : "No"}
            />
            <DetailField
              icon={<FaTasks />}
              label="Grading Method"
              value={quiz.gradingMethod}
            />
            <DetailField
              icon={<FaClipboardList />}
              label="Questions"
              value={`${quiz.questionCount} questions`}
            />
            <DetailField
              icon={<FaInfoCircle />}
              label="Instructions"
              value={quiz.instructions}
            />
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleUpdate}
              className="primaryBtn w-fit px-4 flex items-center gap-2 rounded-full mx-auto"
            >
              <MdEdit /> Update Quiz
            </button>
          </div>
        </div>

        {/* === RIGHT SIDE === */}
        <div className="lg:w-1/2">
          <h2 className="headingText mb-4">Questions</h2>
          <div className="space-y-4">
            {quiz.questions.map((q, index) => (
              <div
                key={index}
                className="border rounded shadow-sm p-4 bg-white"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setActiveQuestionIndex(
                      index === activeQuestionIndex ? null : index
                    )
                  }
                >
                  <h4 className="font-medium text-blue-700">
                    Q{index + 1}: {q.questionText}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {q.questionType === "mcq" ? "MCQ" : "Written"} • {q.marks}{" "}
                    marks
                  </span>
                </div>

                {activeQuestionIndex === index && (
                  <div className="mt-4 text-sm text-gray-800 space-y-2">
                    {q.questionType === "mcq" && (
                      <>
                        <p className="font-medium">Options:</p>
                        <ul className="list-disc pl-6">
                          {q.options.map((opt, i) => (
                            <li key={i}>
                              {opt}{" "}
                              {opt === q.correctAnswer && (
                                <strong className="text-green-600">
                                  (Correct)
                                </strong>
                              )}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    <p>
                      <span className="font-medium">Correct Answer:</span>{" "}
                      {q.correctAnswer}
                    </p>
                    {q.teacherFeedback && (
                      <p>
                        <span className="font-medium">Feedback:</span>{" "}
                        {q.teacherFeedback}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
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
