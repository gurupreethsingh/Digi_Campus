import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaThList, FaThLarge, FaTh, FaUser } from "react-icons/fa";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import DashboardCard from "../../components/common_components/DashboardCard";
import DashboardLayout from "../../components/common_components/DashboardLayout";
import LeftSidebarNav from "../../components/common_components/LeftSidebarNav";
import SearchBar from "../../components/common_components/SearchBar";

const SuperadminDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(8);

  const [counts, setCounts] = useState({
    total: 0,
    superadmin: 0,
    teacher: 0,
    student: 0,
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

        const [total, superadmin, teacher, student] = await Promise.all([
          axios.get(`${globalBackendRoute}/api/get-totaluser-count`, config),
          axios.get(`${globalBackendRoute}/api/get-superadmin-count`, config),
          axios.get(`${globalBackendRoute}/api/get-teacher-count`, config),
          axios.get(`${globalBackendRoute}/api/get-student-count`, config),
        ]);

        setCounts({
          total: total.data.totalUserCount,
          superadmin: superadmin.data.superadminCount,
          teacher: teacher.data.teacherCount,
          student: student.data.studentCount,
        });
      } catch (error) {
        console.error("Failed to fetch counts", error);
      }
    };

    fetchCounts();
  }, []);

  const allCards = [
    {
      title: "Total Users",
      value: counts.total,
      link: "/all-users",
      icon: <FaUser className="text-blue-600" />,
      bgColor: "bg-blue-100",
    },
    {
      title: "Superadmins",
      value: counts.superadmin,
      link: "/all-users",
      icon: <FaUser className="text-purple-600" />,
      bgColor: "bg-purple-100",
    },
    {
      title: "Teachers",
      value: counts.teacher,
      link: "/all-users",
      icon: <FaUser className="text-green-600" />,
      bgColor: "bg-green-100",
    },
    {
      title: "Students",
      value: counts.student,
      link: "/all-users",
      icon: <FaUser className="text-yellow-600" />,
      bgColor: "bg-yellow-100",
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
            <h1 className="headingText">Superadmin Dashboard</h1>
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
                  label: "Account Settings",
                  icon: <FaUser className="text-indigo-600" />,
                  path: `/profile/${userId}`,
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

export default SuperadminDashboard;
