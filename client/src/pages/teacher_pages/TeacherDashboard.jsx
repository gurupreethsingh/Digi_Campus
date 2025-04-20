import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FaBook,
  FaClipboardList,
  FaFileAlt,
  FaPlusSquare,
  FaUserGraduate,
  FaChartLine,
  FaFileSignature,
  FaThList,
  FaThLarge,
  FaTh,
} from "react-icons/fa";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import DashboardCard from "../../components/common_components/DashboardCard";
import DashboardLayout from "../../components/common_components/DashboardLayout";
import LeftSidebarNav from "../../components/common_components/LeftSidebarNav";
import SearchBar from "../../components/common_components/SearchBar";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(8);

  const [counts, setCounts] = useState({
    subjects: 0,
    topics: 0,
    tests: 0,
    questions: 0,
    students: 0,
    markscards: 0,
  });

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
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const subjectRes = await axios.get(
          `${globalBackendRoute}/api/count-all-subjects`,
          config
        );

        setCounts((prev) => ({
          ...prev,
          subjects: subjectRes.data.totalSubjects,
        }));
      } catch (error) {
        console.error("Failed to fetch teacher dashboard stats", error);
      }
    };

    fetchCounts();
  }, []);

  const allCards = [
    {
      title: "Subjects",
      value: counts.subjects,
      link: "/all-subjects",
      icon: <FaBook className="text-blue-600" />,
      bgColor: "bg-blue-100",
    },
    {
      title: "Topics",
      value: counts.topics,
      link: "/all-topics",
      icon: <FaClipboardList className="text-green-600" />,
      bgColor: "bg-green-100",
    },
    {
      title: "Tests",
      value: counts.tests,
      link: "/all-tests",
      icon: <FaFileAlt className="text-purple-600" />,
      bgColor: "bg-purple-100",
    },
    {
      title: "Questions",
      value: counts.questions,
      link: "/all-questions",
      icon: <FaPlusSquare className="text-yellow-600" />,
      bgColor: "bg-yellow-100",
    },
    {
      title: "Students",
      value: counts.students,
      link: "/all-students",
      icon: <FaUserGraduate className="text-cyan-600" />,
      bgColor: "bg-cyan-100",
    },
    {
      title: "Markscards",
      value: counts.markscards,
      link: "/all-markscards",
      icon: <FaFileSignature className="text-red-600" />,
      bgColor: "bg-red-100",
    },
  ];

  const filteredCards =
    search.trim() === ""
      ? allCards
      : allCards.filter((card) =>
          `${card.title} ${card.value}`
            .toLowerCase()
            .includes(search.toLowerCase())
        );

  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  return (
    <div className="fullWidth py-6">
      <div className="containerWidth">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap mb-6 gap-4">
          <div>
            <h1 className="headingText">Teacher Dashboard</h1>
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
              placeholder="Search cards..."
            />
          </div>
        </div>

        <DashboardLayout
          left={
            <LeftSidebarNav
              navigate={navigate}
              items={[
                {
                  label: "Add Subject",
                  icon: <FaBook className="text-blue-600" />,
                  path: "/add-subject",
                },
                {
                  label: "Add Topics",
                  icon: <FaClipboardList className="text-green-600" />,
                  path: "/add-topic",
                },
                {
                  label: "Add Tests",
                  icon: <FaFileAlt className="text-purple-600" />,
                  path: "/add-test",
                },
                {
                  label: "Add Questions",
                  icon: <FaPlusSquare className="text-yellow-600" />,
                  path: "/add-questions",
                },
                {
                  label: "View Students",
                  icon: <FaUserGraduate className="text-teal-600" />,
                  path: "/all-students",
                },
                {
                  label: "View Marks",
                  icon: <FaChartLine className="text-indigo-600" />,
                  path: "/all-marks",
                },
                {
                  label: "Generate Markscards",
                  icon: <FaFileSignature className="text-red-600" />,
                  path: "/generate-markscard",
                },
              ]}
            />
          }
          right={
            <div>
              <div
                className={`${
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                    : view === "card"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }`}
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

export default TeacherDashboard;
