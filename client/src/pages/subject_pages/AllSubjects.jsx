import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaTrash,
  FaBook,
  FaUniversity,
  FaUserTie,
  FaCode,
  FaHourglassHalf,
} from "react-icons/fa";
import { toast } from "react-toastify";
import globalBackendRoute from "../../config/Config";
import SearchBar from "../../components/common_components/SearchBar";
import stopwords from "../../components/common_components/stopwords";

const AllSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${globalBackendRoute}/api/get-all-subjects`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubjects(res.data);
        setTotalCount(res.data.length);
      } catch (error) {
        console.error("Error fetching subjects:", error.message);
        toast.error("Failed to fetch subjects.");
      }
    };
    fetchSubjects();
  }, []);

  const handleDeleteSubject = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    const confirm = window.confirm(
      "Are you sure you want to delete this subject?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${globalBackendRoute}/api/delete-subject/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        setSubjects((prev) => prev.filter((s) => s._id !== id));
        toast.success("Subject deleted successfully.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete subject.");
    }
  };

  const filtered = searchQuery.trim()
    ? subjects.filter((s) => {
        const full =
          `${s.title} ${s.courseCode} ${s.department} ${s.academicYear}`.toLowerCase();
        const words = searchQuery
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w && !stopwords.includes(w));
        return words.some((word) => full.includes(word));
      })
    : subjects;

  return (
    <div className="fullWidth py-10">
      <div className="containerWidth">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="headingText">
            All Subjects{" "}
            <span className="text-sm text-gray-500 ml-2">
              Showing {filtered.length} of {totalCount}
            </span>
          </h2>
          <div className="flex items-center flex-wrap gap-4">
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
              placeholder="Search subjects..."
            />
          </div>
        </div>

        <div className="mt-6">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500">No subjects found.</p>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
                  : view === "card"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-3"
              }
            >
              {filtered.map((s) => (
                <div
                  key={s._id}
                  onClick={() => navigate(`/single-subject/${s._id}`)}
                  className={`relative cursor-pointer bg-white shadow rounded-lg p-4 hover:shadow-lg transition ${
                    view === "list"
                      ? "flex flex-wrap items-center gap-2 text-sm text-gray-700"
                      : "flex flex-col items-start"
                  }`}
                >
                  {view === "list" ? (
                    <>
                      <span className="text-indigo-600 font-medium truncate max-w-full">
                        <FaBook className="inline mr-1" />
                        {s.title}
                      </span>
                      <span>|</span>
                      <span>
                        <FaCode className="inline mr-1" />
                        {s.courseCode}
                      </span>
                      <span>|</span>
                      <span>
                        <FaUniversity className="inline mr-1" />
                        {s.department}
                      </span>
                      <span>|</span>
                      <span>
                        <FaHourglassHalf className="inline mr-1" />
                        Sem {s.semester}
                      </span>
                      <span>|</span>
                      <span>{s.academicYear}</span>
                    </>
                  ) : (
                    <>
                      <h3 className="subHeadingTextMobile flex items-center gap-2 mb-1 break-words whitespace-normal w-full">
                        <FaBook className="text-indigo-500" /> {s.title}
                      </h3>
                      <p className="paragraphTextMobile flex items-center gap-2 break-words whitespace-normal w-full">
                        <FaCode /> {s.courseCode}
                      </p>
                      <p className="paragraphTextMobile flex items-center gap-2 break-words whitespace-normal w-full">
                        <FaUniversity /> {s.department}
                      </p>
                      <p className="paragraphTextMobile flex items-center gap-2 break-words whitespace-normal w-full">
                        <FaHourglassHalf /> Semester {s.semester}
                      </p>
                      <p className="paragraphTextMobile flex items-center gap-2 break-words whitespace-normal w-full">
                        <FaUserTie /> {s.teacher?.name || "N/A"}
                      </p>
                      <p className="paragraphTextMobile text-sm text-gray-600 break-words whitespace-normal w-full">
                        {s.academicYear}
                      </p>
                    </>
                  )}

                  <button
                    onClick={(e) => handleDeleteSubject(s._id, e)}
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

export default AllSubjects;
