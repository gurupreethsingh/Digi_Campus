const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, "Question text is required"],
    },
    questionType: {
      type: String,
      enum: ["mcq", "written"],
      required: true,
    },
    options: [
      {
        type: String,
      },
    ],
    correctAnswer: {
      type: String, // For MCQ (answer text or index); for written, can be "manual"
      required: [true, "Correct answer is required"],
    },
    marks: {
      type: Number,
      default: 1,
      min: 0,
    },
    teacherFeedback: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    responses: [
      {
        questionIndex: Number,
        answer: String,
        obtainedMarks: Number,
        teacherComment: String,
      },
    ],
    totalScore: {
      type: Number,
      default: 0,
    },
    durationTaken: {
      type: Number, // In minutes
    },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // must be a teacher
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    questions: {
      type: [questionSchema],
      validate: [(arr) => arr.length > 0, "At least one question is required"],
    },
    questionCount: {
      type: Number,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    scheduleDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      match: [
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Start time must be in HH:MM format",
      ],
      required: true,
    },
    endTime: {
      type: String,
      match: [
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "End time must be in HH:MM format",
      ],
      required: true,
    },
    maxAttempts: {
      type: Number,
      default: 1,
      min: 1,
    },
    gradingMethod: {
      type: String,
      enum: ["highest", "latest", "average"],
      default: "highest",
    },
    attempts: {
      type: [attemptSchema],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    feedbackEnabled: {
      type: Boolean,
      default: true,
    },
    instructions: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
