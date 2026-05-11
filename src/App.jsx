import { useState, useMemo, useEffect } from "react";
import logo from "./assets/obi-services.png";
import logoDark from "./assets/obi-services-dark-mode.png";
import logoNormal from "./assets/obi-services-normal-mode.png";
// Import professional icons
import {
  IoSunnyOutline,
  IoMoonOutline,
  IoSearchOutline,
  IoTrashOutline,
  IoLocateOutline,
  IoGlobeOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";

function App() {
  const [htmlInput, setHtmlInput] = useState("");
  const [links, setLinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMode, setActiveMode] = useState("obi");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const analyzeHtml = () => {
    if (!htmlInput.trim()) return;
    setSearchTerm("");
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlInput, "text/html");
    const anchorTags = Array.from(doc.querySelectorAll("a"));
    const results = anchorTags.map((a, index) => {
      const rel = a.getAttribute("rel") || "";
      const href = a.getAttribute("href") || "#";
      return {
        id: index,
        text: a.innerText.trim() || "[No Text/Image Link]",
        href: href,
        isNoFollow: rel.toLowerCase().includes("nofollow"),
        isObi: href.includes("obi.services"),
      };
    });
    setLinks(results);
  };

  const filteredLinks = useMemo(() => {
    let list = links;
    if (activeMode === "obi") list = links.filter((link) => link.isObi);
    if (searchTerm) {
      list = list.filter(
        (link) =>
          link.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          link.href.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return list;
  }, [links, searchTerm, activeMode]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-900 text-slate-100" : "bg-[#f8fafc] text-slate-900"} font-sans pb-10`}
    >
      <header
        className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} border-b p-4 sticky top-0 z-20 shadow-sm transition-colors`}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Dynamic Logo Switching */}
          <img
            src={darkMode ? logoNormal : logoDark}
            alt="OBI Logo"
            className="h-10 w-auto object-contain transition-opacity duration-300"
          />

          {/* Control Group with React Icons */}
          <div
            className={`flex items-center gap-1 ${darkMode ? "bg-slate-900 border-slate-700" : "bg-slate-100 border-slate-200"} p-1 rounded-xl border`}
          >
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all flex items-center justify-center ${
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
              onClick={() => setActiveMode("obi")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeMode === "obi"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <IoLocateOutline size={16} /> OBI LINK HUNTER
            </button>

            <button
              onClick={() => setActiveMode("global")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeMode === "global"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <IoGlobeOutline size={16} /> GLOBAL ANALYZER
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <section
          className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} rounded-2xl shadow-sm border p-5 mb-6 transition-colors`}
        >
          <div className="flex justify-between mb-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Target HTML Source
            </label>
            <button
              onClick={() => {
                setHtmlInput("");
                setLinks([]);
                setSearchTerm("");
              }}
              className="text-[10px] font-bold text-red-400 hover:text-red-500 uppercase flex items-center gap-1"
            >
              <IoTrashOutline size={12} /> Clear Input
            </button>
          </div>
          <textarea
            className={`w-full h-40 p-4 rounded-xl border-2 outline-none transition font-mono text-sm ${darkMode ? "bg-slate-900 border-slate-700 text-slate-300 focus:border-blue-500" : "bg-slate-50 border-slate-100 focus:border-blue-400"}`}
            placeholder="Paste Ctrl+U content here..."
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
          />
          <button
            onClick={analyzeHtml}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
          >
            <IoSearchOutline size={20} /> ANALYZE{" "}
            {activeMode === "obi" ? "OBI SERVICES LINKS" : "ALL LINKS"}
          </button>
        </section>

        <section className="space-y-4">
          {links.length > 0 ? (
            <>
              <div className="relative group">
                <IoSearchOutline
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder={
                    activeMode === "obi"
                      ? "Filter OBI links..."
                      : "Search all links..."
                  }
                  className={`w-full p-4 pl-12 rounded-xl border shadow-sm outline-none focus:ring-2 focus:ring-blue-100 transition-colors ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div
                className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} rounded-2xl shadow-sm border overflow-hidden`}
              >
                <div
                  className={`${darkMode ? "bg-slate-900/50 border-slate-700" : "bg-slate-50 border-slate-200"} p-3 border-b flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest`}
                >
                  <span>{filteredLinks.length} Result(s)</span>
                  <span>Mode: {activeMode}</span>
                </div>
                <div
                  className={`divide-y ${darkMode ? "divide-slate-700" : "divide-slate-100"}`}
                >
                  {filteredLinks.length > 0 ? (
                    filteredLinks.map((link) => (
                      <div
                        key={link.id}
                        className={`p-4 flex justify-between items-center transition ${darkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-50"}`}
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <p
                            className={`font-bold truncate ${darkMode ? "text-slate-200" : "text-slate-800"}`}
                          >
                            {link.text}
                          </p>
                          <p className="text-xs text-blue-400 truncate mt-0.5">
                            {link.href}
                          </p>
                        </div>
                        <div
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border shrink-0 flex items-center gap-1 ${
                            link.isNoFollow
                              ? "bg-amber-900/20 text-amber-500 border-amber-900/30"
                              : "bg-emerald-900/20 text-emerald-500 border-emerald-900/30"
                          }`}
                        >
                          {link.isNoFollow ? (
                            <IoCloseCircleOutline size={14} />
                          ) : (
                            <IoCheckmarkCircleOutline size={14} />
                          )}
                          {link.isNoFollow ? "Nofollow" : "Dofollow"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center text-slate-400 italic text-sm">
                      No matches found.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div
              className={`p-20 text-center rounded-2xl border-2 border-dashed transition-colors ${darkMode ? "bg-slate-800 border-slate-700 text-slate-500" : "bg-white border-slate-200 text-slate-400"}`}
            >
              <IoLocateOutline size={40} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium">
                {activeMode === "obi"
                  ? "Paste HTML to find OBI backlinks..."
                  : "Paste HTML for a full link audit..."}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
