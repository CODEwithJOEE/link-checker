import {
  IoCheckmarkCircleOutline,
  IoWarningOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";

function HeadingItem({ heading, index, darkMode }) {
  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return "bg-red-500"; // H1 Red
      case 2:
        return "bg-orange-500"; // H2 Orange
      case 3:
        return "bg-amber-500";
      case 4:
        return "bg-emerald-500";
      case 5:
        return "bg-blue-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <tr
      className={`transition-colors ${darkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-50"}`}
    >
      {/* Order Column */}
      <td
        className={`py-3 px-4 text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}
      >
        {index + 1}
      </td>

      {/* Level Column */}
      <td className="py-3 px-4">
        <span
          className={`inline-block px-2 py-1 text-[10px] font-bold text-white rounded ${getLevelColor(heading.level)}`}
        >
          H{heading.level}
        </span>
      </td>

      {/* Heading Text Column */}
      <td
        className={`py-3 px-4 text-sm ${darkMode ? "text-slate-200" : "text-slate-800"}`}
      >
        <div className="line-clamp-1" title={heading.text}>
          {heading.text || (
            <span className="italic text-slate-400">[Empty Heading]</span>
          )}
        </div>
        {heading.issues.length > 0 && (
          <div className="text-[10px] text-red-500 font-bold mt-1">
            {heading.issues.join(", ")}
          </div>
        )}
      </td>

      {/* Status Column */}
      <td className="py-3 px-4">
        <div
          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase ${
            heading.status === "success"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : heading.status === "warning"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {heading.status === "success" && (
            <IoCheckmarkCircleOutline size={14} />
          )}
          {heading.status === "warning" && <IoWarningOutline size={14} />}
          {heading.status === "error" && <IoCloseCircleOutline size={14} />}
          {heading.status === "success"
            ? "Good"
            : heading.status === "warning"
              ? "Warning"
              : "Error"}
        </div>
      </td>
    </tr>
  );
}

export default HeadingItem;
