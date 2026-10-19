import {
  IoWarningOutline,
  IoCloseCircleOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

function HeadingItem({ heading, darkMode }) {
  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return "bg-purple-500";
      case 2:
        return "bg-blue-500";
      case 3:
        return "bg-emerald-500";
      case 4:
        return "bg-amber-500";
      case 5:
        return "bg-orange-500";
      default:
        return "bg-slate-500";
    }
  };

  const getStatusIcon = () => {
    if (heading.status === "error")
      return <IoCloseCircleOutline className="text-red-500" />;
    if (heading.status === "warning")
      return <IoWarningOutline className="text-amber-500" />;
    return <IoCheckmarkCircleOutline className="text-emerald-500" />;
  };

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 transition border-b last:border-b-0 ${
        darkMode
          ? "border-slate-700 hover:bg-slate-700/50"
          : "border-slate-100 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <span
          className={`shrink-0 mt-0.5 px-2 py-1 text-[10px] font-bold text-white rounded ${getLevelColor(heading.level)}`}
        >
          H{heading.level}
        </span>
        <div className="min-w-0">
          <p
            className={`font-bold truncate ${darkMode ? "text-slate-200" : "text-slate-800"} ${heading.status === "error" && !heading.text ? "italic text-slate-400" : ""}`}
          >
            {heading.text || "[Empty Heading]"}
          </p>
          <p
            className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            {heading.charCount} characters
            {heading.issues.length > 0 && (
              <span className="ml-2 text-red-400 font-semibold">
                • {heading.issues.join(", ")}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="shrink-0 mt-2 sm:mt-0 ml-10 sm:ml-0 flex items-center">
        {getStatusIcon()}
      </div>
    </div>
  );
}

export default HeadingItem;
