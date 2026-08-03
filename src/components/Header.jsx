import {
  IoSunnyOutline,
  IoMoonOutline,
  IoLocateOutline,
  IoGlobeOutline,
} from "react-icons/io5";

import logoDark from "../assets/obi-services-dark-mode.png";
import logoNormal from "../assets/obi-services-normal-mode.png";

function Header({ darkMode, onToggleDarkMode, activeMode, onModeChange }) {
  return (
    <header
      className={`sticky top-0 z-20 border-b p-4 shadow-sm transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 md:flex-row">
        <img
          src={darkMode ? logoNormal : logoDark}
          alt="OBI Services"
          className="h-10 w-auto object-contain"
        />

        <div
          className={`flex items-center gap-1 rounded-xl border p-1 ${
            darkMode
              ? "border-slate-700 bg-slate-900"
              : "border-slate-200 bg-slate-100"
          }`}
        >
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            className={`flex items-center justify-center rounded-lg p-2 transition-all ${
              darkMode
                ? "bg-slate-800 text-yellow-400"
                : "bg-white text-slate-600 shadow-sm"
            }`}
          >
            {darkMode ? (
              <IoSunnyOutline size={18} />
            ) : (
              <IoMoonOutline size={18} />
            )}
          </button>

          <button
            type="button"
            onClick={() => onModeChange("obi")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeMode === "obi"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <IoLocateOutline size={16} />
            OBI LINK HUNTER
          </button>

          <button
            type="button"
            onClick={() => onModeChange("global")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeMode === "global"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <IoGlobeOutline size={16} />
            GLOBAL ANALYZER
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
