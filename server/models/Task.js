const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },
    dueDate: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for checking if task is overdue
taskSchema.virtual("isOverdue").get(function () {
  if (!this.dueDate) return false;
  return new Date() > this.dueDate && this.status !== "completed";
});

// Include virtuals in JSON
taskSchema.set("toJSON", { virtuals: true });
taskSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Task", taskSchema);
