import React, { useEffect, useState } from "react";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import { jwtDecode } from "jwt-decode";

const AllUserMarks = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [latestQuiz, setLatestQuiz] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    setUserInfo(decoded);

    const fetchMarks = async () => {
      try {
        const res = await axios.get(`${globalBackendRoute}/api/user-attempts/${decoded.id}`);
        const quizData = res.data.data;

        setQuizzes(quizData);

        if (quizData.length > 0) {
          const latest = quizData
            .map(q => q.attempts.map(a => ({ ...a, quizTitle: q.title, quizId: q._id })))
            .flat()
            .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];

          setLatestQuiz(latest);
        }
      } catch (err) {
        console.error("Failed to fetch marks", err);
      }
    };

    fetchMarks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">🎓 Student Report</h2>

      <div className="bg-gray-100 p-4 rounded shadow mb-6">
        <p><strong>Name:</strong> {userInfo?.name || "Student"}</p>
        <p><strong>Role:</strong> {userInfo?.role}</p>
      </div>

      {latestQuiz && (
        <div className="bg-green-100 p-4 rounded shadow mb-6">
          <h3 className="text-xl font-semibold text-green-800">🧪 Latest Quiz Attempt</h3>
          <p><strong>Quiz:</strong> {latestQuiz.quizTitle}</p>
          <p><strong>Submitted At:</strong> {new Date(latestQuiz.submittedAt).toLocaleString()}</p>
          <p><strong>Score:</strong> {latestQuiz.totalScore}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Quiz</th>
              <th className="border px-4 py-2">Max Attempts</th>
              <th className="border px-4 py-2">Attempts Made</th>
              <th className="border px-4 py-2">Attempts Left</th>
              <th className="border px-4 py-2">Marks (Each Attempt)</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz._id} className="text-center">
                <td className="border px-4 py-2">{quiz.title}</td>
                <td className="border px-4 py-2">{quiz.maxAttempts}</td>
                <td className="border px-4 py-2">{quiz.attempts.length}</td>
                <td className="border px-4 py-2">{quiz.maxAttempts - quiz.attempts.length}</td>
                <td className="border px-4 py-2">
                  {quiz.attempts.map((a, i) => (
                    <span key={i} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 m-1 rounded text-sm">
                      Attempt {i + 1}: {a.totalScore}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
            {quizzes.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">No attempts yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUserMarks;
