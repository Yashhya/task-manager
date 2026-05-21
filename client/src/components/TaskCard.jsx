import { useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge, { PriorityBadge } from "./StatusBadge";
import {
  HiOutlineCalendar,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

const TaskCard = ({ task, onEdit, onDelete, isAdmin }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className="group rounded-2xl p-5 transition-all duration-300"
      style={{
        backgroundColor: "var(--bg-card)",
        border: `1.5px solid ${isHovered ? "var(--primary)" : "var(--border-color)"}`,
        boxShadow: isHovered ? "var(--shadow-lg), 0 0 20px -8px var(--primary-glow)" : "var(--shadow-sm)",
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3
            className="font-bold text-base leading-snug truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {task.title}
          </h3>
          {task.projectId && (
            <Link
              to={`/projects/${task.projectId._id || task.projectId}`}
              className="text-xs mt-1.5 inline-block hover:underline font-semibold"
              style={{ color: task.projectId.color || "var(--primary)" }}
            >
              {task.projectId.title || "Project"}
            </Link>
          )}
        </div>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Description */}
      {task.description && (
        <p
          className="text-sm mb-4 line-clamp-2 leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {task.description}
        </p>
      )}

      {/* Status */}
      <div className="mb-4">
        <StatusBadge status={task.status} />
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border-color)" }}>
        <div className="flex items-center gap-4">
          {/* Assigned user */}
          {task.assignedTo && (
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
              >
                {(task.assignedTo.name || "?")[0].toUpperCase()}
              </div>
              <span
                className="text-xs truncate max-w-[90px] font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                {task.assignedTo.name}
              </span>
            </div>
          )}

          {/* Due date */}
          {task.dueDate && (
            <div
              className="flex items-center gap-1.5 text-xs font-medium"
              style={{ color: isOverdue ? "var(--danger)" : "var(--text-muted)" }}
            >
              {isOverdue ? (
                <HiOutlineExclamationTriangle className="w-4 h-4" />
              ) : (
                <HiOutlineCalendar className="w-4 h-4" />
              )}
              <span className={isOverdue ? "font-bold" : ""}>
                {formatDate(task.dueDate)}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-1 transition-opacity duration-200"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          {(isAdmin || task.assignedTo?._id) && (
            <button
              onClick={() => onEdit?.(task)}
              className="p-2 rounded-lg transition-all duration-200 cursor-pointer"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.1)";
                e.currentTarget.style.color = "#6366f1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <HiOutlinePencilSquare className="w-4.5 h-4.5" />
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => onDelete?.(task._id)}
              className="p-2 rounded-lg transition-all duration-200 cursor-pointer"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)";
                e.currentTarget.style.color = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <HiOutlineTrash className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
