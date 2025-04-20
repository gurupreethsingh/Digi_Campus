const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    // General Info
    title: {
      type: String,
      required: [true, "Topic title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },

    // Reference to Subject
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    // Academic Structure
    learningObjectives: [String],
    subtopics: [String],
    lectureCount: {
      type: Number,
      default: 1,
      min: [1, "Lecture count must be at least 1"],
    },
    estimatedHours: {
      type: Number,
      default: 2,
      min: 0.5,
    },
    deliveryMode: {
      type: String,
      enum: ["offline", "online", "hybrid"],
      default: "offline",
    },

    // Content Resources
    resources: [
      {
        type: {
          type: String,
          enum: ["pdf", "video", "link"],
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    // Curriculum Planning
    weekNumber: {
      type: Number,
      min: 1,
      max: 52,
    },
    sessionPlan: {
      type: String,
      default: "",
    },
    assessmentIncluded: {
      type: Boolean,
      default: false,
    },
    syllabusTag: {
      type: String,
      enum: ["core", "elective", "lab", "theory"],
      default: "core",
    },

    // Status & Ownership
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "active",
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Analytics
    feedbackCount: {
      type: Number,
      default: 0,
    },
    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Advanced Features
    linkedOutcomes: [String],
    prerequisiteTopics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],
    discussionForumLink: {
      type: String,
    },
    labRequirement: {
      type: Boolean,
      default: false,
    },
    assignedTA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Topic", topicSchema);
