import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.data.data.user);
          setToken(storedToken);
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const signup = async (data) => {
    const res = await authService.signup(data);
    const { user: newUser, token: newToken } = res.data.data;
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setToken(newToken);
    toast.success("Account created successfully!");
    return res;
  };

  const login = async (data) => {
    const res = await authService.login(data);
    const { user: loggedUser, token: newToken } = res.data.data;
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    setUser(loggedUser);
    setToken(newToken);
    toast.success(`Welcome back, ${loggedUser.name}!`);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    toast.success("Logged out successfully");
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signup, login, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
