import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBook,
  FaList,
  FaClock,
  FaRegCalendarCheck,
  FaChalkboardTeacher,
  FaClipboardList,
  FaInfoCircle,
  FaCheck,
  FaTasks,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import globalBackendRoute from "../../config/Config";

const AddQuiz = () => {
  const navigate = useNavigate();
  const [teacherId, setTeacherId] = useState("");
  const [allSubjects, setAllSubjects] = useState([]);
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    subject: "",
    questionCount: 1,
    durationMinutes: 30,
    scheduleDate: "",
    startTime: "09:00",
    endTime: "10:00",
    maxAttempts: 1,
    gradingMethod: "highest",
    isPublished: false,
    feedbackEnabled: true,
    instructions: "",
    questions: [
      {
        questionText: "",
        questionType: "mcq",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: 1,
        teacherFeedback: "",
      },
    ],
  });

  const gradingOptions = ["highest", "latest", "average"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized access");

    try {
      const decoded = jwtDecode(token);
      setTeacherId(decoded.id);
    } catch (err) {
      console.error("Token decode error", err);
    }

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
        console.error("Error fetching subjects", err);
      }
    };

    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuiz((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][field] = value;
    setQuiz((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuiz((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const addQuestion = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: "",
          questionType: "mcq",
          options: ["", "", "", ""],
          correctAnswer: "",
          marks: 1,
          teacherFeedback: "",
        },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const payload = { ...quiz, createdBy: teacherId };
      await axios.post(`${globalBackendRoute}/api/add-quiz`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Quiz added successfully!");
      navigate("/all-quizzes");
    } catch (err) {
      console.error("Error adding quiz", err.response || err);
      alert("Failed to add quiz.");
    }
  };

  const formGroup = "grid grid-cols-1 sm:grid-cols-3 items-center gap-4";

  return (
    <div className="fullWidth py-10">
      <div className="compactWidth">
        <h2 className="headingText text-center">Add New Quiz</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Title */}
          <div className={formGroup}>
            <label className="formLabel flex items-center gap-2">
              <FaBook className="text-indigo-600" /> Quiz Title
            </label>
            <input
              type="text"
              name="title"
              value={quiz.title}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              required
            />
          </div>

          {/* Description */}
          <div className={formGroup}>
            <label className="formLabel flex items-center gap-2">
              <FaClipboardList className="text-pink-600" /> Description
            </label>
            <textarea
              name="description"
              value={quiz.description}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              rows="3"
            />
          </div>

          {/* Subject */}
          <div className={formGroup}>
            <label className="formLabel flex items-center gap-2">
              <FaChalkboardTeacher className="text-orange-500" /> Select Subject
            </label>
            <select
              name="subject"
              value={quiz.subject}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              required
            >
              <option value="">-- Select --</option>
              {allSubjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.title} ({s.courseCode})
                </option>
              ))}
            </select>
          </div>

          {/* Date, Time & Duration */}
          <div className={formGroup}>
            <label className="formLabel flex items-center gap-2">
              <FaRegCalendarCheck className="text-green-600" /> Schedule Date
            </label>
            <input
              type="date"
              name="scheduleDate"
              value={quiz.scheduleDate}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              required
            />
          </div>

          <div className={formGroup}>
            <label className="formLabel">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={quiz.startTime}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              required
            />
          </div>

          <div className={formGroup}>
            <label className="formLabel">End Time</label>
            <input
              type="time"
              name="endTime"
              value={quiz.endTime}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              required
            />
          </div>

          <div className={formGroup}>
            <label className="formLabel">
              <FaClock className="text-blue-500" /> Duration (Minutes)
            </label>
            <input
              type="number"
              name="durationMinutes"
              value={quiz.durationMinutes}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              min={1}
              required
            />
          </div>

          {/* Grading Method */}
          <div className={formGroup}>
            <label className="formLabel">Grading Method</label>
            <select
              name="gradingMethod"
              value={quiz.gradingMethod}
              onChange={handleChange}
              className="formInput sm:col-span-2"
            >
              {gradingOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Attempts */}
          <div className={formGroup}>
            <label className="formLabel">
              <FaTasks className="text-purple-500" /> Max Attempts
            </label>
            <input
              type="number"
              name="maxAttempts"
              value={quiz.maxAttempts}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              min={1}
              required
            />
          </div>

          {/* Instructions */}
          <div className={formGroup}>
            <label className="formLabel flex items-center gap-2">
              <FaInfoCircle className="text-gray-600" /> Instructions
            </label>
            <textarea
              name="instructions"
              value={quiz.instructions}
              onChange={handleChange}
              className="formInput sm:col-span-2"
              rows="3"
            />
          </div>

          {/* Questions UI */}
          <div className="space-y-8">
            {quiz.questions.map((q, i) => (
              <div key={i} className="border p-4 rounded shadow-sm">
                <h4 className="font-semibold mb-2">Question {i + 1}</h4>
                <input
                  type="text"
                  placeholder="Question Text"
                  value={q.questionText}
                  onChange={(e) =>
                    handleQuestionChange(i, "questionText", e.target.value)
                  }
                  className="formInput mb-2 w-full"
                  required
                />
                <select
                  value={q.questionType}
                  onChange={(e) =>
                    handleQuestionChange(i, "questionType", e.target.value)
                  }
                  className="formInput mb-2 w-full"
                >
                  <option value="mcq">Multiple Choice</option>
                  <option value="written">Written Answer</option>
                </select>

                {q.questionType === "mcq" && (
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {q.options.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(i, idx, e.target.value)
                        }
                        className="formInput"
                      />
                    ))}
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Correct Answer"
                  value={q.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(i, "correctAnswer", e.target.value)
                  }
                  className="formInput mb-2 w-full"
                  required
                />

                <input
                  type="number"
                  placeholder="Marks"
                  value={q.marks}
                  min={0}
                  onChange={(e) =>
                    handleQuestionChange(i, "marks", e.target.value)
                  }
                  className="formInput mb-2 w-full"
                />

                <textarea
                  placeholder="Teacher Feedback"
                  value={q.teacherFeedback}
                  onChange={(e) =>
                    handleQuestionChange(i, "teacherFeedback", e.target.value)
                  }
                  className="formInput mb-2 w-full"
                  rows={2}
                />
              </div>
            ))}
          </div>

          {/* Add More Questions */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={addQuestion}
              className="secondaryBtn"
            >
              + Add Another Question
            </button>
          </div>

          {/* Submit */}
          <div className="text-center mt-6">
            <button
              type="submit"
              className="primaryBtn px-6 py-2 flex items-center gap-2 mx-auto"
            >
              <FaCheck className="text-white" /> Submit Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuiz;
