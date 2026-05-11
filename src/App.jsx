import { useState, useMemo } from "react";
import logo from "./assets/obi-services.png";

function App() {
  const [htmlInput, setHtmlInput] = useState("");
  const [links, setLinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMode, setActiveMode] = useState("obi");

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
    if (activeMode === "obi") {
      list = links.filter((link) => link.isObi);
    }
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-10">
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Replaced H1 text with Image logo */}
          <img
            src={logo}
            alt="OBI Link Checker Logo"
            className="h-10 w-auto object-contain"
          />

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveMode("obi")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeMode === "obi"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              🎯 OBI SERVICES LINK HUNTER
            </button>
            <button
              onClick={() => setActiveMode("global")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeMode === "global"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              🌍 GLOBAL ANALYZER
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
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
              className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase transition-colors"
            >
              Clear Input
            </button>
          </div>
          <textarea
            className="w-full h-40 p-4 rounded-xl border-2 border-slate-100 focus:border-blue-400 outline-none transition font-mono text-sm bg-slate-50"
            placeholder="Paste Ctrl+U content here..."
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
          />
          <button
            onClick={analyzeHtml}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg active:scale-[0.98]"
          >
            ANALYZE FOR{" "}
            {activeMode === "obi" ? "OBI SERVICES LINKS" : "ALL LINKS"}
          </button>
        </section>

        {/* Results or Empty State */}
        <section className="space-y-4">
          {links.length > 0 ? (
            <>
              <input
                type="text"
                placeholder={
                  activeMode === "obi"
                    ? "Filter OBI SERVICES links further..."
                    : "Search any link..."
                }
                className="w-full p-4 rounded-xl border border-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>Displaying {filteredLinks.length} Result(s)</span>
                  <span>Mode: {activeMode}</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {filteredLinks.length > 0 ? (
                    filteredLinks.map((link) => (
                      <div
                        key={link.id}
                        className="p-4 flex justify-between items-center hover:bg-slate-50 transition"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="font-bold text-slate-800 truncate">
                            {link.text}
                          </p>
                          <p className="text-xs text-blue-500 truncate mt-0.5">
                            {link.href}
                          </p>
                        </div>
                        <div
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border shrink-0 ${
                            link.isNoFollow
                              ? "bg-amber-50 text-amber-600 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {link.isNoFollow ? "Nofollow" : "Dofollow"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center text-slate-400 italic text-sm">
                      No matching links found.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* The Empty State Placeholder */
            <div className="p-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 text-sm font-medium">
                {activeMode === "obi"
                  ? "🎯 Paste HTML to find OBI backlinks..."
                  : "🌍 Paste HTML for a full link audit..."}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
