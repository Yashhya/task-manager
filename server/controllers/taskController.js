const { validationResult } = require("express-validator");
const Task = require("../models/Task");
const Project = require("../models/Project");

/**
 * @desc    Get tasks (admin=all, member=assigned)
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res) => {
  try {
    const { status, priority, projectId, search, assignedTo } = req.query;

    let filter = {};

    // Role-based filtering
    if (req.user.role !== "admin") {
      filter.assignedTo = req.user._id;
    }

    // Query filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (projectId) filter.projectId = projectId;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("projectId", "title color")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("GetTasks Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Create task
 * @route   POST /api/tasks
 * @access  Private (Admin only)
 */
const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { title, description, status, priority, assignedTo, projectId, dueDate } = req.body;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      assignedTo: assignedTo || null,
      projectId,
      dueDate: dueDate || null,
      createdBy: req.user._id,
    });

    const populated = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("projectId", "title color")
      .populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Task created successfully!",
      data: populated,
    });
  } catch (error) {
    console.error("CreateTask Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    // Members can only update status of their own tasks
    if (req.user.role === "member") {
      if (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only update tasks assigned to you.",
        });
      }

      // Members can only change status
      const allowedFields = ["status"];
      const updateKeys = Object.keys(req.body);
      const isAllowed = updateKeys.every((key) => allowedFields.includes(key));
      if (!isAllowed) {
        return res.status(403).json({
          success: false,
          message: "Members can only update task status.",
        });
      }
    }

    const { title, description, status, priority, assignedTo, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    const populated = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("projectId", "title color")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Task updated successfully!",
      data: populated,
    });
  } catch (error) {
    console.error("UpdateTask Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private (Admin only)
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully!",
    });
  } catch (error) {
    console.error("DeleteTask Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Get dashboard stats
 * @route   GET /api/tasks/stats
 * @access  Private
 */
const getTaskStats = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== "admin") {
      filter.assignedTo = req.user._id;
    }

    const totalTasks = await Task.countDocuments(filter);
    const completedTasks = await Task.countDocuments({ ...filter, status: "completed" });
    const inProgressTasks = await Task.countDocuments({ ...filter, status: "in-progress" });
    const todoTasks = await Task.countDocuments({ ...filter, status: "todo" });

    const overdueTasks = await Task.countDocuments({
      ...filter,
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" },
    });

    // Tasks by priority
    const highPriority = await Task.countDocuments({ ...filter, priority: "high" });
    const mediumPriority = await Task.countDocuments({ ...filter, priority: "medium" });
    const lowPriority = await Task.countDocuments({ ...filter, priority: "low" });

    // Recent tasks
    const recentTasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("projectId", "title color")
      .sort({ createdAt: -1 })
      .limit(5);

    // Project count
    let projectFilter = {};
    if (req.user.role !== "admin") {
      projectFilter.members = req.user._id;
    }
    const totalProjects = await require("../models/Project").countDocuments(projectFilter);

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        overdueTasks,
        totalProjects,
        byPriority: { high: highPriority, medium: mediumPriority, low: lowPriority },
        recentTasks,
      },
    });
  } catch (error) {
    console.error("GetTaskStats Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
