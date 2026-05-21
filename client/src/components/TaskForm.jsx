import { useState, useEffect } from "react";

const TaskForm = ({ task, projects, users, onSubmit, onCancel, isAdmin }) => {
  const [form, setForm] = useState({
    title: "", description: "", status: "todo", priority: "medium",
    assignedTo: "", projectId: "", dueDate: "",
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "", description: task.description || "",
        status: task.status || "todo", priority: task.priority || "medium",
        assignedTo: task.assignedTo?._id || task.assignedTo || "",
        projectId: task.projectId?._id || task.projectId || "",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      });
    }
  }, [task]);

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

  const inputStyle = {
    backgroundColor: "var(--bg-tertiary)", color: "var(--text-primary)",
    border: "1px solid var(--border-color)", borderRadius: "var(--input-radius)",
    padding: "0.75rem 1rem", width: "100%", fontSize: "0.95rem",
    outline: "none", transition: "all 0.2s ease",
  };

  const labelStyle = { color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: "700", marginBottom: "0.5rem", display: "block" };

  // If member is editing, only show status
  if (!isAdmin && task) {
    return (
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label style={labelStyle}>Status</label>
          <select style={inputStyle} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className="px-5 py-3 rounded-xl text-sm font-bold cursor-pointer" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>Cancel</button>
          <button type="submit" className="btn-primary px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>Update Status</button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label style={labelStyle}>Title *</label>
        <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title" required />
      </div>
      <div>
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: "6rem", resize: "vertical" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Task description..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Project *</label>
          <select style={inputStyle} value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} required>
            <option value="">Select project</option>
            {projects?.map((p) => (<option key={p._id} value={p._id}>{p.title}</option>))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Assign To</label>
          <select style={inputStyle} value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
            <option value="">Unassigned</option>
            {users?.map((u) => (<option key={u._id} value={u._id}>{u.name}</option>))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label style={labelStyle}>Status</label>
          <select style={inputStyle} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Priority</label>
          <select style={inputStyle} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Due Date</label>
          <input type="date" style={inputStyle} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-3">
        <button type="button" onClick={onCancel} className="px-5 py-3 rounded-xl text-sm font-bold cursor-pointer" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>Cancel</button>
        <button type="submit" className="btn-primary px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>{task ? "Update Task" : "Create Task"}</button>
      </div>
    </form>
  );
};

export default TaskForm;
