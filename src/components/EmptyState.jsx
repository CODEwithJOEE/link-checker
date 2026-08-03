import { IoLocateOutline } from "react-icons/io5";

function EmptyState({ activeMode, darkMode }) {
  return (
    <div
      className={`rounded-2xl border-2 border-dashed p-20 text-center transition-colors ${
        darkMode
          ? "border-slate-700 bg-slate-800 text-slate-500"
          : "border-slate-200 bg-white text-slate-400"
      }`}
    >
      <IoLocateOutline size={40} className="mx-auto mb-4 opacity-20" />

      <p className="text-sm font-medium">
        {activeMode === "obi"
          ? "Paste HTML to find OBI backlinks..."
          : "Paste HTML for a full link audit..."}
      </p>
    </div>
  );
}

export default EmptyState;
