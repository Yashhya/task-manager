import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
      <div className="relative">
        <div className="w-20 h-20 rounded-full" style={{ border: "4px solid var(--border-color)" }} />
        <div
          className="absolute top-0 left-0 w-20 h-20 rounded-full"
          style={{
            border: "4px solid transparent",
            borderTopColor: "var(--primary)",
            borderRightColor: "var(--accent)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <div
          className="absolute top-2 left-2 w-16 h-16 rounded-full"
          style={{
            border: "3px solid transparent",
            borderBottomColor: "var(--primary-light)",
            animation: "spin 1.2s linear infinite reverse",
            opacity: 0.5,
          }}
        />
      </div>
      <p className="mt-6 text-base font-semibold" style={{ color: "var(--text-muted)" }}>{text}</p>
    </div>
  );
};

export const EmptyState = ({
  icon: Icon = HiOutlineClipboardDocumentList,
  title = "Nothing here yet",
  description = "Get started by creating something new.",
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div
        className="w-24 h-24 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))", boxShadow: "var(--shadow-md)" }}
      >
        <Icon className="w-12 h-12" style={{ color: "var(--text-muted)" }} />
      </div>
      <h3
        className="text-xl font-bold mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>
      <p
        className="text-base mb-6 max-w-md text-center leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        {description}
      </p>
      {action}
    </div>
  );
};

export default Loading;
