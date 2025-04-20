import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaChalkboardTeacher,
  FaComments,
  FaClipboardList,
  FaBook,
} from "react-icons/fa";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import DashboardCard from "../../components/common_components/DashboardCard";
import DashboardLayout from "../../components/common_components/DashboardLayout";
import SearchBar from "../../components/common_components/SearchBar";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(8);
  const [quizzes, setQuizzes] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/home");
    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    } catch (error) {
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [quizRes, subjectRes] = await Promise.all([
          axios.get(`${globalBackendRoute}/api/get-all-quizzes`, config),
          axios.get(`${globalBackendRoute}/api/get-all-subjects`, config),
        ]);
        const all = quizRes.data.data || [];
        setAllQuizzes(all);
        setQuizzes(all);
        setSubjects(subjectRes.data || []);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    fetchData();
  }, []);

  const handleSubjectFilter = (subjectId) => {
    setSelectedSubject(subjectId);
    setCurrentPage(1);
    if (!subjectId) return setQuizzes(allQuizzes);
    const filtered = allQuizzes.filter((quiz) => {
      return quiz.subject?._id?.toString() === subjectId.toString();
    });
    setQuizzes(filtered);
  };

  const filteredCards = quizzes
    .filter((q) =>
      `${q.title} ${q.description || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .map((quiz) => ({
      title: quiz.title,
      value: `${quiz.questionCount || quiz.questions?.length || 0} Questions`,
      link: `/attempt-quiz/${quiz._id}`,
      icon: <FaClipboardList className="text-indigo-600" />,
      bgColor: "bg-indigo-100",
    }));

  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const renderSidebar = () => (
    <div className="w-full sm:w-64 bg-white shadow-sm rounded-lg p-4 space-y-2">
      <div
        className="cursor-pointer flex items-center gap-3 p-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50"
        onClick={() => handleSubjectFilter(null)}
      >
        <FaChalkboardTeacher className="text-blue-600" />
        <span>All Exams</span>
      </div>
      <div
        className="cursor-pointer flex items-center gap-3 p-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50"
        onClick={() => navigate("/chat")}
      >
        <FaComments className="text-green-600" />
        <span>Chat with Friends</span>
      </div>
      {subjects.map((subj, index) => (
        <div
          key={index}
          className="cursor-pointer flex items-center gap-3 p-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50"
          onClick={() => handleSubjectFilter(subj._id)}
        >
          <FaBook className="text-orange-500" />
          <span>{subj.title}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fullWidth py-6">
      <div className="containerWidth">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap mb-6 gap-4">
          <div>
            <h1 className="headingText">Student Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Showing {paginatedCards.length} of {filteredCards.length} cards
            </p>
          </div>
          <div className="flex items-center flex-wrap gap-3">
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes..."
            />
          </div>
        </div>

        <DashboardLayout
          left={renderSidebar()}
          right={
            <div>
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                    : view === "card"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {paginatedCards.map((card, index) => (
                  <DashboardCard
                    key={index}
                    card={card}
                    view={view}
                    onClick={() => navigate(card.link)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-4 flex-wrap">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
