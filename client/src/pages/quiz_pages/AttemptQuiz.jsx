import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AttemptQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instructions, setInstructions] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizDetails, setQuizDetails] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [reviewing, setReviewing] = useState(false);
  const timerRef = useRef(null);
  const [userId, setUserId] = useState(null);

  // Decode user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded?.id);
    }
  }, []);

  // Prevent going back using browser
  useEffect(() => {
    const blockBackNavigation = () => {
      if (quizStarted) {
        alert("You can't go back during the quiz.");
        window.history.pushState(null, "", window.location.href);
      }
    };

    if (quizStarted) {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", blockBackNavigation);
    }

    return () => {
      window.removeEventListener("popstate", blockBackNavigation);
    };
  }, [quizStarted]);

  // Load quiz state
  useEffect(() => {
    const started = localStorage.getItem(`quizStarted_${id}`);
    const time = localStorage.getItem(`timeLeft_${id}`);
    const answers = localStorage.getItem(`userAnswers_${id}`);
    const index = localStorage.getItem(`currentQuestionIndex_${id}`);
    if (started === "true") {
      setQuizStarted(true);
      if (time) setTimeLeft(parseInt(time));
      if (answers) setUserAnswers(JSON.parse(answers));
      if (index) setCurrentQuestionIndex(parseInt(index));
    }
  }, [id]);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${globalBackendRoute}/api/get-quiz-by-id/${id}`);
        setInstructions(res.data.data.instructions || "No instructions provided.");
        setQuizDetails(res.data.data);
        if (!localStorage.getItem(`timeLeft_${id}`)) {
          setTimeLeft(res.data.data.durationMinutes * 60);
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setInstructions("Failed to load instructions.");
      }
    };
    fetchQuiz();
  }, [id]);

  // Timer
  useEffect(() => {
    if (!quizStarted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        localStorage.setItem(`timeLeft_${id}`, newTime);
        if (newTime <= 0) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [quizStarted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStartQuiz = () => {
    const userAttempts = quizDetails.attempts?.filter(
      (a) => a.student._id === userId || a.student === userId
    );
    if (userAttempts.length >= quizDetails.maxAttempts) {
      alert("All attempts for this quiz are over. Contact admin.");
      return;
    }

    setQuizStarted(true);
    localStorage.setItem(`quizStarted_${id}`, "true");
    localStorage.setItem(`timeLeft_${id}`, quizDetails.durationMinutes * 60);
    localStorage.setItem(`currentQuestionIndex_${id}`, "0");
  };

  const handleAnswerChange = (value) => {
    const updatedAnswers = {
      ...userAnswers,
      [currentQuestionIndex]: value,
    };
    setUserAnswers(updatedAnswers);
    localStorage.setItem(`userAnswers_${id}`, JSON.stringify(updatedAnswers));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizDetails.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      localStorage.setItem(`currentQuestionIndex_${id}`, nextIndex);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      localStorage.setItem(`currentQuestionIndex_${id}`, prevIndex);
    }
  };

  const handleReview = () => setReviewing(true);
  const handleBackToQuestions = () => setReviewing(false);

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    localStorage.removeItem(`quizStarted_${id}`);
    localStorage.removeItem(`userAnswers_${id}`);
    localStorage.removeItem(`timeLeft_${id}`);
    localStorage.removeItem(`currentQuestionIndex_${id}`);
    localStorage.setItem(`quizSubmitted_${id}_${userId}`, "true");

    alert("Quiz submitted!");


    const totalScore = quizDetails.questions.reduce((sum, q, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = q.questionType === "mcq" && userAnswer === q.correctAnswer;
        const score = isCorrect ? q.marks : 0;
        return sum + score;
      }, 0);
      
      await axios.post(`${globalBackendRoute}/api/submit-quiz`, {
        quizId: id,
        studentId: userId,
        answers: userAnswers,
        totalScore,
        durationTaken: Math.floor((quizDetails.durationMinutes * 60 - timeLeft) / 60),
      });
      
    console.log("Submitted Answers:", userAnswers);
    navigate(`/all-user-marks/${id}`);
  };

  if (!quizDetails) return <div className="p-5">Loading...</div>;

  const userAttempts = quizDetails?.attempts?.filter(
    (a) => a.student._id === userId || a.student === userId
  );
  
  const attemptsMade = userAttempts?.length || 0;
  const attemptsLeft = quizDetails?.maxAttempts - attemptsMade;
  
  if (attemptsLeft <= 0) {
    return (
      <div className="p-5 text-center">
        <h2 className="text-xl font-bold text-red-600">You have exhausted all attempts for this quiz.</h2>
        <p className="text-gray-600 mt-2">Please check your results on the results page.</p>
      </div>
    );
  }
  

  if (reviewing) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">📋 Review Your Answers</h2>
        {quizDetails.questions.map((q, idx) => (
          <div key={idx} className="mb-4 border p-4 rounded shadow bg-white">
            <p className="font-semibold text-gray-800 mb-2">
              Q{idx + 1}: {q.questionText}
            </p>
            <p className="text-sm text-blue-700">
              Your Answer: {userAnswers[idx] || <span className="text-red-500">Not Answered</span>}
            </p>
          </div>
        ))}
        <div className="text-center mt-6 space-x-4">
          <button
            onClick={handleBackToQuestions}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            🔙 Back to Questions
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ✅ Submit Final Answers
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizDetails.questions[currentQuestionIndex];

  return (
    <div className="p-4 md:p-6">
      {!quizStarted ? (
        <div className="max-w-3xl mx-auto text-center shadow-lg p-6 bg-white rounded">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Please Read the Following Instructions Before Starting the Quiz
          </h2>
          <p className="text-gray-800 mb-6 whitespace-pre-line text-sm">{instructions}</p>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleStartQuiz}
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{quizDetails.title}</h1>
              <p className="text-gray-600 text-sm">
                Question {currentQuestionIndex + 1} of {quizDetails.questionCount}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Time Left</div>
              <div className="text-lg font-bold text-red-600">{formatTime(timeLeft)}</div>
            </div>
          </div>

          <div className="border p-4 md:p-6 rounded shadow bg-white mb-6">
            <h3 className="text-lg font-semibold mb-4">Question:</h3>
            <p className="text-gray-800 mb-4 text-sm md:text-base">{currentQuestion.questionText}</p>
            {currentQuestion.questionType === "mcq" && (
              <ul className="space-y-2">
                {currentQuestion.options.map((opt, idx) => (
                  <li key={idx}>
                    <label className="inline-flex items-center text-sm">
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        value={opt}
                        checked={userAnswers[currentQuestionIndex] === opt}
                        onChange={() => handleAnswerChange(opt)}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>
            )}
            {currentQuestion.questionType === "written" && (
              <textarea
                className="w-full p-2 mt-2 border rounded text-sm"
                rows={4}
                placeholder="Type your answer..."
                value={userAnswers[currentQuestionIndex] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
              />
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50"
            >
              ⬅ Prev
            </button>
            <div className="space-x-2">
              <button
                onClick={handleReview}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Review Answers
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === quizDetails.questions.length - 1}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next ➡
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttemptQuiz;