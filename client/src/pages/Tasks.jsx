import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { taskService, projectService, userService } from "../services";
import Loading, { EmptyState } from "../components/Loading";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { HiOutlinePlus, HiOutlineMagnifyingGlass, HiOutlineClipboardDocumentList, HiOutlineXMark } from "react-icons/hi2";

const Tasks = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filters, setFilters] = useState({ search: "", status: "", priority: "" });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [taskRes, projRes, userRes] = await Promise.all([
        taskService.getAll(), projectService.getAll(), userService.getAll(),
      ]);
      setTasks(taskRes.data.data);
      setProjects(projRes.data.data);
      setUsers(userRes.data.data);
    } catch (err) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editTask) {
        await taskService.update(editTask._id, data);
        toast.success("Task updated!");
      } else {
        await taskService.create(data);
        toast.success("Task created!");
      }
      setShowModal(false);
      setEditTask(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted!");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.status && t.status !== filters.status) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    return true;
  });

  const hasFilters = filters.search || filters.status || filters.priority;

  const selectStyle = {
    backgroundColor: "var(--bg-tertiary)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--input-radius)",
    padding: "0.65rem 1rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    outline: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  if (loading) return <Loading text="Loading tasks..." />;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <HiOutlineClipboardDocumentList className="w-7 h-7" style={{ color: "var(--primary)" }} />
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>Tasks</h1>
          </div>
          <p className="text-base font-medium ml-10" style={{ color: "var(--text-muted)" }}>{filteredTasks.length} of {tasks.length} tasks</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditTask(null); setShowModal(true); }}
            className="btn-primary flex items-center gap-2.5 px-6 py-3 rounded-xl text-white text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 25px -5px rgba(99,102,241,0.4)" }}
          >
            <HiOutlinePlus className="w-5 h-5" /> New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap gap-3 mb-8 p-5 rounded-2xl"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="relative flex-1 min-w-[220px]">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium"
            style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px solid var(--border-color)", outline: "none", transition: "all 0.2s" }}
          />
        </div>
        <select style={selectStyle} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select style={selectStyle} value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => setFilters({ search: "", status: "", priority: "" })}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all"
            style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#ef4444" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)"; }}
          >
            <HiOutlineXMark className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Tasks grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTasks.map((t, i) => (
            <div key={t._id} className={`animate-fade-in stagger-${Math.min(i + 1, 6)}`} style={{ opacity: 0 }}>
              <TaskCard
                task={t}
                isAdmin={isAdmin}
                onEdit={(task) => { setEditTask(task); setShowModal(true); }}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={HiOutlineClipboardDocumentList}
          title="No tasks found"
          description={hasFilters ? "Try adjusting your filters." : isAdmin ? "Create your first task to get started." : "No tasks assigned to you yet."}
        />
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditTask(null); }} title={editTask ? "Edit Task" : "New Task"} size="lg">
        <TaskForm task={editTask} projects={projects} users={users} onSubmit={handleSubmit} onCancel={() => { setShowModal(false); setEditTask(null); }} isAdmin={isAdmin} />
      </Modal>
    </div>
  );
};

export default Tasks;
