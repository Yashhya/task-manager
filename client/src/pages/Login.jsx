import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineSparkles } from "react-icons/hi2";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.06)",
    color: "#f1f5f9",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "var(--input-radius)",
    padding: "0.9rem 1rem 0.9rem 3rem",
    width: "100%",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.3s ease",
    backdropFilter: "blur(8px)",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 auth-bg" style={{ background: "linear-gradient(135deg, #080c18 0%, #1a103a 35%, #0f172a 70%, #0c0f1f 100%)" }}>
      {/* Extra decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full animate-float" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", filter: "blur(40px)", animationDelay: "-3s" }} />
      <div className="absolute bottom-1/3 right-1/4 w-60 h-60 rounded-full animate-float" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)", filter: "blur(40px)", animationDelay: "-5s" }} />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-5 relative"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)", boxShadow: "0 0 40px rgba(99,102,241,0.35)" }}
          >
            <HiOutlineSparkles className="w-7 h-7" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent to-white/15" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome back</h1>
          <p className="text-slate-400 text-base">Sign in to your workspace</p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-8 lg:p-10"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 25px 60px -12px rgba(0,0,0,0.5), 0 0 40px -10px rgba(99,102,241,0.15)",
            backdropFilter: "blur(20px)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="email" style={inputStyle} placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="password" style={inputStyle} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl text-white font-bold text-base transition-all disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 30px -5px rgba(99,102,241,0.5)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>
          <p className="text-center mt-7 text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Create account</Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div
          className="mt-6 p-5 rounded-xl"
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
          }}
        >
          <p className="text-xs text-slate-400 mb-3 font-bold uppercase tracking-wider">Demo Credentials</p>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
            <div className="text-slate-500"><span className="text-slate-300 font-medium">Admin:</span> admin@taskmanager.com</div>
            <div className="text-slate-500"><span className="text-slate-300 font-medium">Pass:</span> admin123</div>
            <div className="text-slate-500"><span className="text-slate-300 font-medium">Member:</span> sarah@taskmanager.com</div>
            <div className="text-slate-500"><span className="text-slate-300 font-medium">Pass:</span> member123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
