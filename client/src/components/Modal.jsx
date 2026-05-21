import { useEffect, useRef } from "react";
import { HiXMark } from "react-icons/hi2";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
        }}
      />

      {/* Modal */}
      <div
        className={`relative w-full ${sizeClasses[size]} rounded-2xl p-8 animate-scale-in`}
        style={{
          backgroundColor: "var(--bg-card)",
          boxShadow: "var(--shadow-xl), 0 0 40px -10px var(--primary-glow)",
          border: "1px solid var(--border-color)",
        }}
      >
        {/* Decorative top gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)" }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl font-extrabold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl transition-all duration-200 hover:scale-110 cursor-pointer"
            style={{ color: "var(--text-muted)", backgroundColor: "var(--bg-tertiary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)";
              e.currentTarget.style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
