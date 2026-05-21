const { validationResult } = require("express-validator");
const Project = require("../models/Project");
const Task = require("../models/Task");

/**
 * @desc    Get all projects (admin gets all, member gets assigned)
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === "admin") {
      projects = await Project.find()
        .populate("createdBy", "name email")
        .populate("members", "name email role")
        .sort({ createdAt: -1 });
    } else {
      projects = await Project.find({ members: req.user._id })
        .populate("createdBy", "name email")
        .populate("members", "name email role")
        .sort({ createdAt: -1 });
    }

    // Add task counts for each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.countDocuments({ projectId: project._id });
        const completedCount = await Task.countDocuments({
          projectId: project._id,
          status: "completed",
        });
        return {
          ...project.toObject(),
          taskCount,
          completedCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: projectsWithCounts.length,
      data: projectsWithCounts,
    });
  } catch (error) {
    console.error("GetProjects Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Get single project
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Members can only view projects they belong to
    if (
      req.user.role !== "admin" &&
      !project.members.some((m) => m._id.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    // Get tasks for this project
    const tasks = await Task.find({ projectId: project._id })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { ...project.toObject(), tasks },
    });
  } catch (error) {
    console.error("GetProject Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Create project
 * @route   POST /api/projects
 * @access  Private (Admin only)
 */
const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { title, description, members, color } = req.body;

    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members: members || [],
      color: color || "#6366f1",
    });

    const populated = await Project.findById(project._id)
      .populate("createdBy", "name email")
      .populate("members", "name email role");

    res.status(201).json({
      success: true,
      message: "Project created successfully!",
      data: { ...populated.toObject(), taskCount: 0, completedCount: 0 },
    });
  } catch (error) {
    console.error("CreateProject Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (Admin only)
 */
const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const { title, description, members, color } = req.body;

    project.title = title || project.title;
    project.description = description !== undefined ? description : project.description;
    project.color = color || project.color;

    if (members) {
      project.members = members;
      // Ensure creator is always a member
      if (!project.members.includes(project.createdBy.toString())) {
        project.members.push(project.createdBy);
      }
    }

    await project.save();

    const populated = await Project.findById(project._id)
      .populate("createdBy", "name email")
      .populate("members", "name email role");

    const taskCount = await Task.countDocuments({ projectId: project._id });
    const completedCount = await Task.countDocuments({
      projectId: project._id,
      status: "completed",
    });

    res.status(200).json({
      success: true,
      message: "Project updated successfully!",
      data: { ...populated.toObject(), taskCount, completedCount },
    });
  } catch (error) {
    console.error("UpdateProject Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin only)
 */
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Delete all tasks associated with the project
    await Task.deleteMany({ projectId: project._id });
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project and associated tasks deleted successfully!",
    });
  } catch (error) {
    console.error("DeleteProject Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
