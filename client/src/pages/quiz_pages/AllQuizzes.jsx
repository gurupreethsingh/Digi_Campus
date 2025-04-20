import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaTrash,
  FaBook,
  FaClock,
  FaRegCalendarCheck,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import globalBackendRoute from "../../config/Config";
import SearchBar from "../../components/common_components/SearchBar";
import stopwords from "../../components/common_components/stopwords";

const AllQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
          `${globalBackendRoute}/api/get-all-quizzes`,
          config
        );
        setQuizzes(res.data.data); // ✅ Correctly access the array
        setTotalCount(res.data.data.length);
      } catch (err) {
        console.error("Error fetching quizzes:", err.message);
        toast.error("Failed to fetch quizzes.");
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${globalBackendRoute}/api/delete-quiz/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
      toast.success("Quiz deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete quiz.");
    }
  };

  const filtered = searchQuery.trim()
    ? quizzes.filter((q) => {
        const full = `${q.title} ${q.subject?.title}`.toLowerCase();
        const words = searchQuery
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w && !stopwords.includes(w));
        return words.some((word) => full.includes(word));
      })
    : quizzes;

  return (
    <div className="fullWidth py-10">
      <div className="containerWidth">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="headingText">
            All Quizzes{" "}
            <span className="text-sm text-gray-500 ml-2">
              Showing {filtered.length} of {totalCount}
            </span>
          </h2>
          <div className="flex items-center gap-4">
            <FaThList
              className={`text-xl cursor-pointer ${
                view === "list" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("list")}
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${
                view === "card" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("card")}
            />
            <FaTh
              className={`text-xl cursor-pointer ${
                view === "grid" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("grid")}
            />
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quizzes..."
            />
          </div>
        </div>

        <div className="mt-6">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500">No quizzes found.</p>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                  : view === "card"
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
                  : "flex flex-col gap-3"
              }
            >
              {filtered.map((q) => (
                <div
                  key={q._id}
                  onClick={() => navigate(`/single-quiz/${q._id}`)}
                  className={`relative cursor-pointer bg-white shadow rounded-lg p-4 hover:shadow-lg transition ${
                    view === "list"
                      ? "flex flex-wrap gap-2 text-sm text-gray-700"
                      : "flex flex-col"
                  }`}
                >
                  <h3 className="font-semibold text-blue-700 mb-1">
                    <FaBook className="inline mr-2" />
                    {q.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Subject: {q.subject?.title || "N/A"}
                  </p>
                  <p className="text-sm">
                    <FaRegCalendarCheck className="inline mr-1 text-green-600" />
                    {new Date(q.scheduleDate).toLocaleDateString()} |{" "}
                    <FaClock className="inline mr-1 text-blue-500" />
                    {q.durationMinutes} mins |{" "}
                    <span className="text-gray-700">
                      {q.questionCount} questions
                    </span>
                  </p>
                  <p className="text-sm mt-1 text-gray-500 flex items-center gap-2">
                    <FaCheckCircle
                      className={
                        q.isPublished ? "text-green-600" : "text-red-500"
                      }
                    />
                    {q.isPublished ? "Published" : "Not Published"}
                  </p>

                  <button
                    onClick={(e) => handleDelete(q._id, e)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllQuizzes;
