const StatusBadge = ({ status }) => {
  const config = {
    todo: {
      label: "To Do",
      bg: "rgba(99, 102, 241, 0.1)",
      color: "#6366f1",
      dot: "#6366f1",
    },
    "in-progress": {
      label: "In Progress",
      bg: "rgba(245, 158, 11, 0.1)",
      color: "#f59e0b",
      dot: "#f59e0b",
    },
    completed: {
      label: "Completed",
      bg: "rgba(16, 185, 129, 0.1)",
      color: "#10b981",
      dot: "#10b981",
    },
  };

  const { label, bg, color, dot } = config[status] || config.todo;

  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
      style={{ backgroundColor: bg, color }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: dot, boxShadow: `0 0 6px ${dot}50` }}
      />
      {label}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const config = {
    low: {
      label: "Low",
      bg: "rgba(6, 182, 212, 0.1)",
      color: "#06b6d4",
    },
    medium: {
      label: "Medium",
      bg: "rgba(245, 158, 11, 0.1)",
      color: "#f59e0b",
    },
    high: {
      label: "High",
      bg: "rgba(239, 68, 68, 0.1)",
      color: "#ef4444",
    },
  };

  const { label, bg, color } = config[priority] || config.medium;

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold"
      style={{ backgroundColor: bg, color }}
    >
      {priority === "high" ? "🔴 " : priority === "medium" ? "🟡 " : "🟢 "}{label}
    </span>
  );
};

export default StatusBadge;
