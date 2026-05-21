import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { projectService, userService } from "../services";
import Loading, { EmptyState } from "../components/Loading";
import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { HiOutlinePlus, HiOutlineFolder, HiOutlineSparkles } from "react-icons/hi2";

const Projects = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projRes, userRes] = await Promise.all([projectService.getAll(), userService.getAll()]);
      setProjects(projRes.data.data);
      setUsers(userRes.data.data);
    } catch (err) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editProject) {
        const res = await projectService.update(editProject._id, data);
        setProjects((prev) => prev.map((p) => (p._id === editProject._id ? res.data.data : p)));
        toast.success("Project updated!");
      } else {
        const res = await projectService.create(data);
        setProjects((prev) => [res.data.data, ...prev]);
        toast.success("Project created!");
      }
      setShowModal(false);
      setEditProject(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project and all its tasks?")) return;
    try {
      await projectService.delete(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success("Project deleted!");
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setShowModal(true);
  };

  if (loading) return <Loading text="Loading projects..." />;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <HiOutlineFolder className="w-7 h-7" style={{ color: "var(--primary)" }} />
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>Projects</h1>
          </div>
          <p className="text-base font-medium ml-10" style={{ color: "var(--text-muted)" }}>{projects.length} project{projects.length !== 1 ? "s" : ""} in your workspace</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditProject(null); setShowModal(true); }}
            className="btn-primary flex items-center gap-2.5 px-6 py-3 rounded-xl text-white text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 25px -5px rgba(99,102,241,0.4)" }}
          >
            <HiOutlinePlus className="w-5 h-5" /> New Project
          </button>
        )}
      </div>

      {/* Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <div key={p._id} className={`animate-fade-in stagger-${Math.min(i + 1, 6)}`} style={{ opacity: 0 }}>
              <ProjectCard project={p} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={HiOutlineFolder}
          title="No projects yet"
          description={isAdmin ? "Create your first project to get started." : "You haven't been assigned to any projects yet."}
          action={isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary px-6 py-3 rounded-xl text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              Create Project
            </button>
          )}
        />
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditProject(null); }} title={editProject ? "Edit Project" : "New Project"}>
        <ProjectForm project={editProject} users={users} onSubmit={handleSubmit} onCancel={() => { setShowModal(false); setEditProject(null); }} />
      </Modal>
    </div>
  );
};

export default Projects;
