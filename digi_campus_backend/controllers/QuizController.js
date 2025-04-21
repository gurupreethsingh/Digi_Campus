const Quiz = require("../models/QuizModel");

// === Create Quiz ===
exports.createQuiz = async (req, res) => {
  try {
    const {
      title,
      subject,
      createdBy,
      description,
      questions,
      questionCount,
      durationMinutes,
      scheduleDate,
      startTime,
      endTime,
      maxAttempts,
      gradingMethod,
      isPublished,
      feedbackEnabled,
      instructions,
    } = req.body;

    const newQuiz = new Quiz({
      title,
      subject,
      createdBy,
      description,
      questions,
      questionCount,
      durationMinutes,
      scheduleDate,
      startTime,
      endTime,
      maxAttempts,
      gradingMethod,
      isPublished,
      feedbackEnabled,
      instructions,
    });

    await newQuiz.save();
    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: newQuiz,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// === Get All Quizzes ===
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("subject createdBy");
    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// === Get Quiz by ID ===
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate(
      "subject createdBy"
    );
    if (!quiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// === Update Quiz ===
exports.updateQuiz = async (req, res) => {
  try {
    const {
      title,
      subject,
      createdBy,
      description,
      questions,
      questionCount,
      durationMinutes,
      scheduleDate,
      startTime,
      endTime,
      maxAttempts,
      gradingMethod,
      isPublished,
      feedbackEnabled,
      instructions,
    } = req.body;

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      {
        title,
        subject,
        createdBy,
        description,
        questions,
        questionCount,
        durationMinutes,
        scheduleDate,
        startTime,
        endTime,
        maxAttempts,
        gradingMethod,
        isPublished,
        feedbackEnabled,
        instructions,
      },
      { new: true, runValidators: true }
    );

    if (!updatedQuiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    res
      .status(200)
      .json({ success: true, message: "Quiz updated", data: updatedQuiz });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// === Delete Quiz ===
exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    res
      .status(200)
      .json({ success: true, message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// === Get Quizzes by Subject ===
exports.getQuizzesBySubject = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ subject: req.params.subjectId }).populate(
      "createdBy"
    );
    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// === Count All Quizzes ===
exports.getQuizCount = async (req, res) => {
  try {
    const count = await Quiz.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// === Count Quizzes by Teacher ===
exports.getQuizCountByTeacher = async (req, res) => {
  try {
    const count = await Quiz.countDocuments({
      createdBy: req.params.teacherId,
    });
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// === Publish Quiz ===
exports.publishQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { isPublished: true },
      { new: true }
    );
    if (!quiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    res.status(200).json({
      success: true,
      message: "Quiz published successfully",
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// === Unpublish Quiz ===
exports.unpublishQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { isPublished: false },
      { new: true }
    );
    if (!quiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    res
      .status(200)
      .json({ success: true, message: "Quiz unpublished", data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// === Update Only Question Count ===
exports.updateQuizQuestionCount = async (req, res) => {
  try {
    const { questionCount } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { questionCount },
      { new: true, runValidators: true }
    );

    if (!quiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });

    res
      .status(200)
      .json({ success: true, message: "Question count updated", data: quiz });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// === Get Quiz Stats (Quizzes + Questions) by Teacher ID ===
exports.getQuizStatsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const quizzes = await Quiz.find({ createdBy: teacherId });

    const totalQuizzes = quizzes.length;
    const totalQuestions = quizzes.reduce(
      (sum, quiz) => sum + (quiz.questions?.length || 0),
      0
    );

    res.status(200).json({
      success: true,
      totalQuizzes,
      totalQuestions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// === Get All Quizzes with Attempts for a Specific Student ===
exports.getQuizzesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const quizzes = await Quiz.find({ "attempts.student": studentId })
      .populate("subject createdBy")
      .lean();

    // Filter attempts per quiz
    const data = quizzes.map((quiz) => {
      const studentAttempts = quiz.attempts.filter(
        (a) => a.student.toString() === studentId
      );
      return {
        _id: quiz._id,
        title: quiz.title,
        subject: quiz.subject?.title || "N/A",
        maxAttempts: quiz.maxAttempts,
        gradingMethod: quiz.gradingMethod,
        attempts: studentAttempts,
      };
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.submitQuizAttempt = async (req, res) => {
  try {
    const { quizId, studentId, answers, totalScore, durationTaken } = req.body;

    const attempt = {
      student: studentId,
      totalScore,
      durationTaken,
      responses: Object.entries(answers).map(([questionIndex, answer]) => ({
        questionIndex: Number(questionIndex),
        answer,
        obtainedMarks: 0, // optionally calculate per-question marks here
        teacherComment: ""
      })),
    };

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    quiz.attempts.push(attempt);
    await quiz.save();

    res.status(200).json({ success: true, message: "Attempt recorded successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
