// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   FaBook,
//   FaChalkboardTeacher,
//   FaCommentDots,
//   FaListAlt,
// } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// export default function StudentDashboard() {
//   const navigate = useNavigate();
//   const [subjects, setSubjects] = useState([]);
//   const [quizzes, setQuizzes] = useState([]);
//   const [filteredQuizzes, setFilteredQuizzes] = useState([]);
//   const [selectedSubjectId, setSelectedSubjectId] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const config = { headers: { Authorization: `Bearer ${token}` } };

//     const fetchSubjects = async () => {
//       const res = await axios.get(
//         `${globalBackendRoute}/api/get-all-subjects`,
//         config
//       );
//       setSubjects(res.data);
//     };

//     const fetchQuizzes = async () => {
//       const res = await axios.get(
//         `${globalBackendRoute}/api/get-all-quizzes`,
//         config
//       );
//       setQuizzes(res.data.data);
//       setFilteredQuizzes(res.data.data);
//     };

//     fetchSubjects();
//     fetchQuizzes();
//   }, []);

//   const handleSubjectClick = (subjectId) => {
//     setSelectedSubjectId(subjectId);
//     if (subjectId) {
//       setFilteredQuizzes(
//         quizzes.filter((quiz) => quiz.subject?._id === subjectId)
//       );
//     } else {
//       setFilteredQuizzes(quizzes);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* === LEFT NAVIGATION === */}
//       <aside className="w-64 bg-white shadow-md p-4 space-y-4">
//         <h2 className="text-lg font-bold mb-2">Navigation</h2>

//         <button
//           onClick={() => handleSubjectClick(null)}
//           className="w-full text-left py-2 px-3 bg-blue-100 hover:bg-blue-200 rounded flex items-center gap-2"
//         >
//           <FaListAlt /> View All Exams
//         </button>

//         <button
//           onClick={() => navigate("/chat")}
//           className="w-full text-left py-2 px-3 bg-green-100 hover:bg-green-200 rounded flex items-center gap-2"
//         >
//           <FaCommentDots /> Chat with Friends
//         </button>

//         <h3 className="text-md font-semibold mt-4 mb-2">Subjects</h3>
//         {subjects.map((subject) => (
//           <button
//             key={subject._id}
//             onClick={() => handleSubjectClick(subject._id)}
//             className={`w-full text-left py-2 px-3 rounded hover:bg-gray-200 ${
//               selectedSubjectId === subject._id ? "bg-indigo-100 font-bold" : ""
//             }`}
//           >
//             <FaBook className="inline-block mr-2" /> {subject.title}
//           </button>
//         ))}
//       </aside>

//       {/* === MAIN CONTENT === */}
//       <main className="flex-1 p-6">
//         <h1 className="text-2xl font-bold mb-6">
//           {selectedSubjectId
//             ? `Exams for "${
//                 subjects.find((s) => s._id === selectedSubjectId)?.title
//               }"`
//             : "All Available Exams"}
//         </h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredQuizzes.map((quiz) => (
//             <div
//               key={quiz._id}
//               className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg"
//               onClick={() => navigate(`/attempt-quiz/${quiz._id}`)}
//             >
//               <h3 className="text-xl font-semibold text-blue-700">
//                 {quiz.title}
//               </h3>
//               <p className="text-sm text-gray-600 mt-1">
//                 Subject: {quiz.subject?.title || "N/A"}
//               </p>
//               <p className="text-sm mt-1">
//                 Duration: {quiz.durationMinutes} mins
//               </p>
//               <p className="text-sm mt-1">
//                 Questions: {quiz.questions?.length || quiz.questionCount || 0}
//               </p>
//               <p className="text-sm mt-1">Attempts: {quiz.maxAttempts}</p>
//               <p className="text-xs text-gray-400 mt-2">
//                 Starts at {quiz.startTime} on{" "}
//                 {new Date(quiz.scheduleDate).toLocaleDateString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }

//

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
