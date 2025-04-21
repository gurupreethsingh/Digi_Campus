const express = require("express");
const router = express.Router();
const QuizController = require("../controllers/QuizController");

// Create
router.post("/add-quiz", QuizController.createQuiz);

// Read
router.get("/get-all-quizzes", QuizController.getAllQuizzes);
router.get("/get-quiz-by-id/:id", QuizController.getQuizById);
router.get(
  "/get-quizzes-by-subject/:subjectId",
  QuizController.getQuizzesBySubject
);

// Update
router.put("/update-quiz/:id", QuizController.updateQuiz);
router.patch("/publish-quiz/:id", QuizController.publishQuiz);
router.patch("/unpublish-quiz/:id", QuizController.unpublishQuiz);

// Delete
router.delete("/delete-quiz/:id", QuizController.deleteQuiz);

// Count
router.get("/get-quiz-count", QuizController.getQuizCount);
router.get(
  "/get-quiz-count-by-teacher/:teacherId",
  QuizController.getQuizCountByTeacher
);

router.patch(
  "/update-quiz-question-count/:id",
  QuizController.updateQuizQuestionCount
);

router.get(
  "/quiz-stats-by-teacher/:teacherId",
  QuizController.getQuizStatsByTeacher
);

router.get("/user-attempts/:studentId", QuizController.getQuizzesByStudent);

router.post("/submit-quiz", QuizController.submitQuizAttempt);

module.exports = router;
