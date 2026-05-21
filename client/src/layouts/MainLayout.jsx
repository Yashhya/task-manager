import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  HiOutlineHome, HiOutlineFolder, HiOutlineClipboardDocumentList,
  HiOutlineUser, HiOutlineArrowRightOnRectangle, HiOutlineSun,
  HiOutlineMoon, HiOutlineBars3, HiOutlineXMark, HiOutlineSparkles
} from "react-icons/hi2";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: HiOutlineHome },
  { to: "/projects", label: "Projects", icon: HiOutlineFolder },
  { to: "/tasks", label: "Tasks", icon: HiOutlineClipboardDocumentList },
  { to: "/profile", label: "Profile", icon: HiOutlineUser },
];

const MainLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ backgroundColor: "var(--bg-sidebar)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-7 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3.5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-base relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)", boxShadow: "0 0 25px rgba(99,102,241,0.4)" }}
            >
              <HiOutlineSparkles className="w-5 h-5" />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
            </div>
            <div>
              <h1 className="text-white font-bold text-base tracking-tight">TaskFlow</h1>
              <p className="text-slate-500 text-xs font-medium">Team Workspace</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white cursor-pointer transition-colors p-1">
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          <p className="px-4 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">Navigation</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className="block"
            >
              {({ isActive }) => (
                <div
                  className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    background: isActive ? "linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9))" : "transparent",
                    color: isActive ? "white" : "#94a3b8",
                    boxShadow: isActive ? "0 4px 15px -3px rgba(99,102,241,0.4)" : "none",
                    transform: isActive ? "scale(1)" : "scale(1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.color = "white";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#94a3b8";
                    }
                  }}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" style={{ boxShadow: "0 0 6px rgba(255,255,255,0.5)" }} />
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="px-5 py-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3.5 mb-4 p-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-slate-500 text-xs capitalize font-medium">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl text-sm text-red-400 transition-all cursor-pointer font-medium"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header
          className="flex items-center justify-between px-8 py-4"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl cursor-pointer transition-colors"
              style={{ color: "var(--text-primary)", backgroundColor: "var(--bg-tertiary)" }}
            >
              <HiOutlineBars3 className="w-5 h-5" />
            </button>
            <div className="hidden lg:block">
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 15px var(--primary-glow)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            >
              {theme === "dark" ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
            </button>

            {/* User chip */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ backgroundColor: "var(--bg-tertiary)" }}>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              >
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {user?.name}
              </span>
              <span
                className="text-xs px-2.5 py-1 rounded-lg font-semibold capitalize"
                style={{
                  backgroundColor: user?.role === "admin" ? "rgba(99,102,241,0.12)" : "rgba(16,185,129,0.12)",
                  color: user?.role === "admin" ? "#6366f1" : "#10b981",
                }}
              >
                {user?.role}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
