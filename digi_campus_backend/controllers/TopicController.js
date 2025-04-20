const Topic = require("../models/TopicModel");
const mongoose = require("mongoose");

// ✅ Create a Topic
const createTopic = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      learningObjectives,
      subtopics,
      lectureCount,
      estimatedHours,
      deliveryMode,
      resources,
      weekNumber,
      sessionPlan,
      assessmentIncluded,
      syllabusTag,
      status,
      lastUpdatedBy,
      feedbackCount,
      completionRate,
      linkedOutcomes,
      prerequisiteTopics,
      discussionForumLink,
      labRequirement,
      assignedTA,
    } = req.body;

    const topic = await Topic.create({
      title,
      description,
      subject,
      learningObjectives,
      subtopics,
      lectureCount,
      estimatedHours,
      deliveryMode,
      resources,
      weekNumber,
      sessionPlan,
      assessmentIncluded,
      syllabusTag,
      status,
      lastUpdatedBy,
      feedbackCount,
      completionRate,
      linkedOutcomes,
      prerequisiteTopics,
      discussionForumLink,
      labRequirement,
      assignedTA,
    });

    res.status(201).json(topic);
  } catch (err) {
    console.error("Create Topic Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get All Topics
const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find()
      .populate("subject", "title courseCode")
      .populate("lastUpdatedBy", "name email")
      .populate("assignedTA", "name email")
      .populate("prerequisiteTopics", "title");
    res.status(200).json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Topic by ID
const getTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid topic ID" });

    const topic = await Topic.findById(id)
      .populate("subject", "title")
      .populate("lastUpdatedBy", "name email")
      .populate("assignedTA", "name email")
      .populate("prerequisiteTopics", "title");

    if (!topic) return res.status(404).json({ error: "Topic not found" });

    res.status(200).json(topic);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Topic
const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid topic ID" });

    const {
      title,
      description,
      subject,
      learningObjectives,
      subtopics,
      lectureCount,
      estimatedHours,
      deliveryMode,
      resources,
      weekNumber,
      sessionPlan,
      assessmentIncluded,
      syllabusTag,
      status,
      lastUpdatedBy,
      feedbackCount,
      completionRate,
      linkedOutcomes,
      prerequisiteTopics,
      discussionForumLink,
      labRequirement,
      assignedTA,
    } = req.body;

    const updated = await Topic.findByIdAndUpdate(
      id,
      {
        title,
        description,
        subject,
        learningObjectives,
        subtopics,
        lectureCount,
        estimatedHours,
        deliveryMode,
        resources,
        weekNumber,
        sessionPlan,
        assessmentIncluded,
        syllabusTag,
        status,
        lastUpdatedBy,
        feedbackCount,
        completionRate,
        linkedOutcomes,
        prerequisiteTopics,
        discussionForumLink,
        labRequirement,
        assignedTA,
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Topic not found" });

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete Topic
const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid topic ID" });

    const deleted = await Topic.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Topic not found" });

    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Count Topics
const countTopics = async (req, res) => {
  try {
    const count = await Topic.countDocuments();
    res.status(200).json({ totalTopics: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopic,
  deleteTopic,
  countTopics,
};
