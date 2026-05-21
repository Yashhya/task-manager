import { useAuth } from "../context/AuthContext";
import { HiOutlineEnvelope, HiOutlineShieldCheck, HiOutlineCalendar, HiOutlineSparkles } from "react-icons/hi2";

const Profile = () => {
  const { user } = useAuth();

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <HiOutlineSparkles className="w-7 h-7" style={{ color: "var(--primary)" }} />
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>Profile</h1>
      </div>

      <div
        className="rounded-2xl p-10 relative overflow-hidden"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-lg)" }}
      >
        {/* Decorative gradient top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-32"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)", opacity: 0.08 }}
        />

        {/* Avatar */}
        <div className="flex flex-col items-center mb-10 relative z-10">
          <div
            className="w-28 h-28 rounded-2xl flex items-center justify-center text-white text-4xl font-extrabold mb-5 relative"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)", boxShadow: "0 8px 30px -5px rgba(99,102,241,0.4)" }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent to-white/15" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>{user?.name}</h2>
          <span
            className="mt-2 px-4 py-1.5 rounded-xl text-sm font-bold capitalize"
            style={{
              backgroundColor: user?.role === "admin" ? "rgba(99,102,241,0.12)" : "rgba(16,185,129,0.12)",
              color: user?.role === "admin" ? "#6366f1" : "#10b981",
            }}
          >
            {user?.role === "admin" ? "🛡️ " : "👤 "}{user?.role}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-4 relative z-10">
          {[
            { icon: HiOutlineEnvelope, label: "Email Address", value: user?.email, color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
            { icon: HiOutlineShieldCheck, label: "Access Role", value: user?.role, capitalize: true, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
            { icon: HiOutlineCalendar, label: "Member Since", value: formatDate(user?.createdAt), color: "#10b981", bg: "rgba(16,185,129,0.1)" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-5 p-5 rounded-xl transition-all duration-300"
              style={{ backgroundColor: "var(--bg-tertiary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: item.bg }}>
                <item.icon className="w-6 h-6" style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{item.label}</p>
                <p className={`text-base font-semibold mt-0.5 ${item.capitalize ? "capitalize" : ""}`} style={{ color: "var(--text-primary)" }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
