import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { taskService, projectService } from "../services";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import StatusBadge, { PriorityBadge } from "../components/StatusBadge";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  HiOutlineClipboardDocumentList, HiOutlineCheckCircle,
  HiOutlineClock, HiOutlineExclamationTriangle, HiOutlineFolder, HiOutlineArrowTrendingUp,
  HiOutlineArrowRight, HiOutlineSparkles,
} from "react-icons/hi2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await taskService.getStats();
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loading text="Loading dashboard..." />;

  const statCards = [
    { label: "Total Tasks", value: stats?.totalTasks || 0, icon: HiOutlineClipboardDocumentList, color: "#6366f1", bg: "rgba(99,102,241,0.1)", gradient: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))" },
    { label: "Completed", value: stats?.completedTasks || 0, icon: HiOutlineCheckCircle, color: "#10b981", bg: "rgba(16,185,129,0.1)", gradient: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))" },
    { label: "In Progress", value: stats?.inProgressTasks || 0, icon: HiOutlineClock, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", gradient: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))" },
    { label: "Overdue", value: stats?.overdueTasks || 0, icon: HiOutlineExclamationTriangle, color: "#ef4444", bg: "rgba(239,68,68,0.1)", gradient: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))" },
    { label: "Projects", value: stats?.totalProjects || 0, icon: HiOutlineFolder, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", gradient: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))" },
    { label: "To Do", value: stats?.todoTasks || 0, icon: HiOutlineArrowTrendingUp, color: "#06b6d4", bg: "rgba(6,182,212,0.1)", gradient: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.05))" },
  ];

  const doughnutData = {
    labels: ["To Do", "In Progress", "Completed"],
    datasets: [{
      data: [stats?.todoTasks || 0, stats?.inProgressTasks || 0, stats?.completedTasks || 0],
      backgroundColor: ["#6366f1", "#f59e0b", "#10b981"],
      borderWidth: 0,
      borderRadius: 6,
      hoverOffset: 8,
    }],
  };

  const barData = {
    labels: ["High", "Medium", "Low"],
    datasets: [{
      label: "Tasks by Priority",
      data: [stats?.byPriority?.high || 0, stats?.byPriority?.medium || 0, stats?.byPriority?.low || 0],
      backgroundColor: ["#ef4444", "#f59e0b", "#06b6d4"],
      borderRadius: 10,
      borderSkipped: false,
      barThickness: 40,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, padding: 20, font: { size: 13, weight: "600", family: "Inter" } },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1, color: "var(--text-muted)", font: { size: 12 } }, grid: { color: "var(--border-color)", drawBorder: false } },
      x: { ticks: { color: "var(--text-muted)", font: { size: 13, weight: "600" } }, grid: { display: false } },
    },
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const greeting = new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening";

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <HiOutlineSparkles className="w-6 h-6" style={{ color: "var(--primary)" }} />
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Good {greeting}, {user?.name?.split(" ")[0]} 👋
            </h1>
          </div>
          <p className="text-base" style={{ color: "var(--text-muted)" }}>Here's what's happening with your tasks today.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {statCards.map((s, i) => (
          <div
            key={i}
            className={`rounded-2xl p-5 card-hover animate-fade-in stagger-${i + 1}`}
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-sm)",
              opacity: 0,
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: s.gradient }}
            >
              <s.icon className="w-6 h-6" style={{ color: s.color }} />
            </div>
            <p className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>{s.value}</p>
            <p className="text-sm mt-1 font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-2xl p-7 card-hover"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}
        >
          <h2 className="font-bold text-lg mb-5" style={{ color: "var(--text-primary)" }}>Tasks by Status</h2>
          <div className="h-72"><Doughnut data={doughnutData} options={chartOptions} /></div>
        </div>
        <div
          className="rounded-2xl p-7 card-hover"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}
        >
          <h2 className="font-bold text-lg mb-5" style={{ color: "var(--text-primary)" }}>Tasks by Priority</h2>
          <div className="h-72"><Bar data={barData} options={barOptions} /></div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div
        className="rounded-2xl p-7"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Recent Tasks</h2>
          <Link
            to="/tasks"
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            style={{ color: "var(--primary)", backgroundColor: "rgba(99,102,241,0.08)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.08)"; }}
          >
            View all <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {stats?.recentTasks?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentTasks.map((t, i) => (
              <div
                key={t._id}
                className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 animate-fade-in stagger-${i + 1}`}
                style={{ backgroundColor: "var(--bg-tertiary)", opacity: 0 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{t.title}</p>
                  <p className="text-xs mt-1 font-medium" style={{ color: "var(--text-muted)" }}>
                    {t.projectId?.title} {t.dueDate ? `• Due ${formatDate(t.dueDate)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <PriorityBadge priority={t.priority} />
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <HiOutlineClipboardDocumentList className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
            <p className="text-base font-medium" style={{ color: "var(--text-muted)" }}>No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
