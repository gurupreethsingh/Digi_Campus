import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThList, FaThLarge, FaTh, FaTrash, FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";
import { toast } from "react-toastify";
import SearchBar from "../../components/common_components/SearchBar";
import stopwords from "../../components/common_components/stopwords";

const AllTopics = () => {
  const [topics, setTopics] = useState([]);
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
          `${globalBackendRoute}/api/get-all-topics`,
          config
        );
        setTopics(res.data);
        setTotalCount(res.data.length);
      } catch (error) {
        console.error("Error fetching topics:", error.message);
        toast.error("Failed to fetch topics.");
      }
    };
    fetchTopics();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this topic?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${globalBackendRoute}/api/delete-topic/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopics((prev) => prev.filter((t) => t._id !== id));
      toast.success("Topic deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete topic.");
    }
  };

  const filtered = searchQuery.trim()
    ? topics.filter((t) => {
        const full = `${t.title} ${t.subject?.title}`.toLowerCase();
        const words = searchQuery
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w && !stopwords.includes(w));
        return words.some(
          (word) => full.includes(word) || full.includes(word.replace(/s$/, ""))
        );
      })
    : topics;

  return (
    <div className="fullWidth py-10">
      <div className="containerWidth">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="headingText">
            All Topics{" "}
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
              placeholder="Search topics..."
            />
          </div>
        </div>

        <div className="mt-6">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500">No topics found.</p>
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
              {filtered.map((t) => (
                <div
                  key={t._id}
                  onClick={() => navigate(`/single-topic/${t._id}`)}
                  className={`relative cursor-pointer bg-white shadow rounded-lg p-4 hover:shadow-lg transition ${
                    view === "list"
                      ? "flex flex-wrap gap-2 text-sm text-gray-700"
                      : "flex flex-col"
                  }`}
                >
                  <h3 className="font-semibold text-blue-700">
                    <FaBook className="inline mr-2" />
                    {t.title}
                  </h3>
                  <p className="text-sm text-gray-600">{t.subject?.title}</p>

                  <button
                    onClick={(e) => handleDelete(t._id, e)}
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

export default AllTopics;
