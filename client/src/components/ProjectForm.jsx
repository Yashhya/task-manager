import { useState, useEffect } from "react";

const ProjectForm = ({ project, users, onSubmit, onCancel }) => {
  const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];
  const [form, setForm] = useState({ title: "", description: "", members: [], color: "#6366f1" });

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || "", description: project.description || "",
        members: project.members?.map((m) => m._id || m) || [], color: project.color || "#6366f1",
      });
    }
  }, [project]);

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

  const toggleMember = (id) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.includes(id) ? prev.members.filter((m) => m !== id) : [...prev.members, id],
    }));
  };

  const inputStyle = {
    backgroundColor: "var(--bg-tertiary)", color: "var(--text-primary)",
    border: "1px solid var(--border-color)", borderRadius: "var(--input-radius)",
    padding: "0.75rem 1rem", width: "100%", fontSize: "0.95rem", outline: "none",
    transition: "all 0.2s ease",
  };

  const labelStyle = { color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: "700", marginBottom: "0.5rem", display: "block" };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label style={labelStyle}>Title *</label>
        <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project title" required />
      </div>
      <div>
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: "6rem", resize: "vertical" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What is this project about?" />
      </div>
      <div>
        <label style={labelStyle}>Color Theme</label>
        <div className="flex gap-3 flex-wrap">
          {colors.map((c) => (
            <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
              className="w-10 h-10 rounded-xl cursor-pointer transition-all duration-200"
              style={{ backgroundColor: c, border: form.color === c ? "3px solid var(--text-primary)" : "3px solid transparent", transform: form.color === c ? "scale(1.2)" : "scale(1)", boxShadow: form.color === c ? `0 0 15px ${c}50` : "none" }} />
          ))}
        </div>
      </div>
      <div>
        <label style={labelStyle}>Team Members</label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 rounded-xl" style={{ backgroundColor: "var(--bg-tertiary)" }}>
          {users?.map((u) => (
            <label key={u._id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-sm font-medium transition-all"
              style={{ backgroundColor: form.members.includes(u._id) ? `${form.color}12` : "transparent", color: "var(--text-primary)" }}>
              <input type="checkbox" checked={form.members.includes(u._id)} onChange={() => toggleMember(u._id)} className="accent-[var(--primary)] w-4 h-4" />
              <span className="truncate">{u.name}</span>
              <span className="text-xs ml-auto font-semibold capitalize" style={{ color: "var(--text-muted)" }}>{u.role}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-3">
        <button type="button" onClick={onCancel} className="px-5 py-3 rounded-xl text-sm font-bold cursor-pointer" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>Cancel</button>
        <button type="submit" className="btn-primary px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>{project ? "Update Project" : "Create Project"}</button>
      </div>
    </form>
  );
};

export default ProjectForm;
