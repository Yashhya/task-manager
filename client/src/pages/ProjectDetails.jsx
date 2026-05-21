import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { projectService, taskService, userService } from "../services";
import Loading from "../components/Loading";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { HiOutlinePlus, HiOutlineArrowLeft, HiOutlineUsers, HiOutlineCalendar, HiOutlineChartBar } from "react-icons/hi2";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [projRes, usersRes, projsRes] = await Promise.all([
        projectService.getById(id), userService.getAll(), projectService.getAll()
      ]);
      setProject(projRes.data.data);
      setUsers(usersRes.data.data);
      setProjects(projsRes.data.data);
    } catch (err) {
      toast.error("Failed to load project");
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (data) => {
    try {
      if (editTask) {
        await taskService.update(editTask._id, data);
        toast.success("Task updated!");
      } else {
        data.projectId = id;
        await taskService.create(data);
        toast.success("Task created!");
      }
      setShowTaskModal(false);
      setEditTask(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    try {
      await taskService.delete(taskId);
      toast.success("Task deleted!");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  if (loading) return <Loading text="Loading project..." />;
  if (!project) return null;

  const tasks = project.tasks || [];
  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const completedTasks = tasks.filter((t) => t.status === "completed");
  const progress = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const columns = [
    { title: "To Do", tasks: todoTasks, color: "#6366f1", bg: "rgba(99,102,241,0.08)" },
    { title: "In Progress", tasks: inProgressTasks, color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
    { title: "Completed", tasks: completedTasks, color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <button
          onClick={() => navigate("/projects")}
          className="p-3 rounded-xl cursor-pointer transition-all shrink-0 mt-0.5"
          style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--primary)"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight truncate" style={{ color: "var(--text-primary)" }}>{project.title}</h1>
          <p className="text-base mt-1 font-medium" style={{ color: "var(--text-muted)" }}>{project.description}</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditTask(null); setShowTaskModal(true); }}
            className="btn-primary flex items-center gap-2.5 px-6 py-3 rounded-xl text-white text-sm font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 25px -5px rgba(99,102,241,0.4)" }}
          >
            <HiOutlinePlus className="w-5 h-5" /> Add Task
          </button>
        )}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div
          className="flex items-center gap-4 px-5 py-4 rounded-2xl card-hover"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(139,92,246,0.1)" }}>
            <HiOutlineUsers className="w-5 h-5" style={{ color: "#8b5cf6" }} />
          </div>
          <div>
            <p className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>{project.members?.length || 0}</p>
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Team Members</p>
          </div>
        </div>
        <div
          className="flex items-center gap-4 px-5 py-4 rounded-2xl card-hover"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(99,102,241,0.1)" }}>
            <HiOutlineCalendar className="w-5 h-5" style={{ color: "#6366f1" }} />
          </div>
          <div>
            <p className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>{tasks.length}</p>
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Total Tasks</p>
          </div>
        </div>
        <div
          className="flex items-center gap-4 px-5 py-4 rounded-2xl card-hover"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(16,185,129,0.1)" }}>
            <HiOutlineChartBar className="w-5 h-5" style={{ color: "#10b981" }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>{progress}%</p>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-tertiary)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${project.color || "#10b981"}, ${project.color || "#10b981"}cc)` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div
        className="rounded-2xl p-6 mb-8"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}
      >
        <h3 className="text-base font-bold mb-4" style={{ color: "var(--text-primary)" }}>Team Members</h3>
        <div className="flex flex-wrap gap-3">
          {project.members?.map((m) => (
            <div
              key={m._id}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all"
              style={{ backgroundColor: "var(--bg-tertiary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: project.color || "var(--primary)" }}
              >
                {m.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{m.name}</span>
              <span
                className="text-xs px-2 py-0.5 rounded-lg capitalize font-medium"
                style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-muted)" }}
              >
                {m.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div key={col.title}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: col.color, boxShadow: `0 0 8px ${col.color}50` }} />
              <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{col.title}</h3>
              <span
                className="text-xs px-2.5 py-1 rounded-lg font-bold"
                style={{ backgroundColor: col.bg, color: col.color }}
              >
                {col.tasks.length}
              </span>
            </div>
            <div
              className="space-y-3 min-h-[250px] p-4 rounded-2xl"
              style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}
            >
              {col.tasks.length > 0 ? col.tasks.map((t) => (
                <TaskCard
                  key={t._id}
                  task={t}
                  isAdmin={isAdmin}
                  onEdit={(task) => { setEditTask(task); setShowTaskModal(true); }}
                  onDelete={handleDeleteTask}
                />
              )) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: col.bg }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: col.color, opacity: 0.5 }} />
                  </div>
                  <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>No tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showTaskModal} onClose={() => { setShowTaskModal(false); setEditTask(null); }} title={editTask ? "Edit Task" : "New Task"} size="lg">
        <TaskForm task={editTask} projects={projects} users={users} onSubmit={handleTaskSubmit} onCancel={() => { setShowTaskModal(false); setEditTask(null); }} isAdmin={isAdmin} />
      </Modal>
    </div>
  );
};

export default ProjectDetails;
