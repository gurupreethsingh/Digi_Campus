import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBook,
  FaClock,
  FaClipboardList,
  FaCalendarAlt,
  FaTasks,
  FaCheckCircle,
} from "react-icons/fa";
import { MdSave } from "react-icons/md";
import { useParams, useNavigate, Link } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

export default function UpdateQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    durationMinutes: "",
    scheduleDate: "",
    startTime: "",
    endTime: "",
    maxAttempts: 1,
    gradingMethod: "highest",
    isPublished: false,
    feedbackEnabled: true,
    instructions: "",
    questions: [],
    questionCount: 0,
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${globalBackendRoute}/api/get-quiz-by-id/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFormData(res.data.data);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${globalBackendRoute}/api/update-quiz/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Quiz updated successfully!");
      navigate(`/single-quiz/${id}`);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update quiz.");
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
          <h2 className="headingText">Update Quiz</h2>
          <Link to="/all-quizzes">
            <button className="fileUploadBtn text-sm py-1 px-3">
              View All Quizzes
            </button>
          </Link>
        </div>

        {renderField("Title", "title", <FaBook />)}
        {renderField("Description", "description", <FaClipboardList />)}
        {renderField(
          "Duration (min)",
          "durationMinutes",
          <FaClock />,
          "number"
        )}
        {renderField(
          "Schedule Date",
          "scheduleDate",
          <FaCalendarAlt />,
          "date"
        )}
        {renderField("Start Time", "startTime", <FaClock />, "time")}
        {renderField("End Time", "endTime", <FaClock />, "time")}
        {renderField("Max Attempts", "maxAttempts", <FaTasks />, "number")}
        {renderField("Instructions", "instructions", <FaClipboardList />)}

        <div className="flex items-center gap-3 px-2 mt-4">
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            id="isPublished"
          />
          <label htmlFor="isPublished" className="formLabel">
            Published
          </label>
        </div>

        <div className="flex items-center gap-3 px-2 mt-4">
          <input
            type="checkbox"
            name="feedbackEnabled"
            checked={formData.feedbackEnabled}
            onChange={handleChange}
            id="feedbackEnabled"
          />
          <label htmlFor="feedbackEnabled" className="formLabel">
            Feedback Enabled
          </label>
        </div>

        <h3 className="text-lg font-semibold mt-8 mb-4">Questions</h3>
        {formData.questions.map((q, index) => (
          <div key={index} className="border p-4 mb-4 rounded">
            <div className="mb-2">
              <label className="block text-sm font-medium">Question Text</label>
              <input
                type="text"
                value={q.questionText}
                onChange={(e) =>
                  handleQuestionChange(index, "questionText", e.target.value)
                }
                className="formInput"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Question Type</label>
              <select
                value={q.questionType}
                onChange={(e) =>
                  handleQuestionChange(index, "questionType", e.target.value)
                }
                className="formInput"
              >
                <option value="mcq">MCQ</option>
                <option value="written">Written</option>
              </select>
            </div>
            {q.questionType === "mcq" && (
              <div className="mb-2">
                <label className="block text-sm font-medium">
                  Options (comma separated)
                </label>
                <input
                  type="text"
                  value={q.options.join(", ")}
                  onChange={(e) =>
                    handleQuestionChange(
                      index,
                      "options",
                      e.target.value.split(", ")
                    )
                  }
                  className="formInput"
                />
              </div>
            )}
            <div className="mb-2">
              <label className="block text-sm font-medium">
                Correct Answer
              </label>
              <input
                type="text"
                value={q.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(index, "correctAnswer", e.target.value)
                }
                className="formInput"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Marks</label>
              <input
                type="number"
                value={q.marks}
                onChange={(e) =>
                  handleQuestionChange(index, "marks", Number(e.target.value))
                }
                className="formInput"
              />
            </div>
          </div>
        ))}

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="primaryBtn w-fit px-4 flex items-center gap-2 rounded-full mx-auto"
          >
            <MdSave /> Save Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
