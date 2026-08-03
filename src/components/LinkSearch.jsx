import { IoSearchOutline } from "react-icons/io5";

function LinkSearch({ value, onChange, activeMode, darkMode }) {
  return (
    <div className="group relative">
      <IoSearchOutline
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500"
        size={18}
      />

      <input
        type="search"
        placeholder={
          activeMode === "obi" ? "Filter OBI links..." : "Search all links..."
        }
        className={`w-full rounded-xl border p-4 pl-12 shadow-sm outline-none transition-colors focus:ring-2 focus:ring-blue-100 ${
          darkMode
            ? "border-slate-700 bg-slate-800 text-white"
            : "border-slate-200 bg-white text-slate-900"
        }`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export default LinkSearch;
