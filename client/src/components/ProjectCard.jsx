import { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineFolder, HiOutlineUsers, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineArrowRight } from "react-icons/hi2";

const ProjectCard = ({ project, onEdit, onDelete, isAdmin }) => {
  const [hov, setHov] = useState(false);
  const progress = project.taskCount > 0 ? Math.round((project.completedCount / project.taskCount) * 100) : 0;
  const projectColor = project.color || "#6366f1";

  return (
    <div
      className="rounded-2xl p-6 transition-all duration-400 h-full"
      style={{
        backgroundColor: "var(--bg-card)",
        border: `1.5px solid ${hov ? projectColor : "var(--border-color)"}`,
        boxShadow: hov ? `var(--shadow-xl), 0 0 30px -10px ${projectColor}40` : "var(--shadow-sm)",
        transform: hov ? "translateY(-5px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300"
        style={{
          background: `linear-gradient(135deg, ${projectColor}20, ${projectColor}08)`,
          transform: hov ? "scale(1.05)" : "scale(1)",
        }}
      >
        <HiOutlineFolder className="w-7 h-7" style={{ color: projectColor }} />
      </div>

      {/* Title & Description */}
      <h3 className="font-bold text-lg mb-2 truncate" style={{ color: "var(--text-primary)" }}>{project.title}</h3>
      <p className="text-sm mb-5 line-clamp-2 min-h-[2.75rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {project.description || "No description"}
      </p>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Progress</span>
          <span className="text-sm font-extrabold" style={{ color: projectColor }}>{progress}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-tertiary)" }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${projectColor}, ${projectColor}bb)`,
              boxShadow: progress > 0 ? `0 0 10px ${projectColor}40` : "none",
            }}
          />
        </div>
        <span className="text-xs mt-2 block font-medium" style={{ color: "var(--text-muted)" }}>
          {project.completedCount || 0} of {project.taskCount || 0} tasks completed
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--border-color)" }}>
        <div className="flex items-center gap-2">
          <HiOutlineUsers className="w-4.5 h-4.5" style={{ color: "var(--text-muted)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{project.members?.length || 0} members</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isAdmin && (<>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit?.(project); }}
              className="p-2 rounded-lg cursor-pointer transition-all duration-200"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.1)"; e.currentTarget.style.color = "#6366f1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              <HiOutlinePencilSquare className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete?.(project._id); }}
              className="p-2 rounded-lg cursor-pointer transition-all duration-200"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#ef4444"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              <HiOutlineTrash className="w-4.5 h-4.5" />
            </button>
          </>)}
          <Link
            to={`/projects/${project._id}`}
            className="p-2 rounded-lg transition-all duration-200"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.1)"; e.currentTarget.style.color = "#6366f1"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <HiOutlineArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
