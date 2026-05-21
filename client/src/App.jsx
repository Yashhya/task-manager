import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import Loading from "./components/Loading";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}><Loading /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Public route wrapper (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}><Loading /></div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-right" toastOptions={{
            duration: 3000,
            style: { borderRadius: "12px", padding: "12px 16px", fontSize: "14px", fontWeight: "500" },
            success: { style: { background: "#10b981", color: "#fff" } },
            error: { style: { background: "#ef4444", color: "#fff" } },
          }} />

          <Routes>
            {/* Public */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

            {/* Protected */}
            <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:id" element={<ProjectDetails />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
