import LinkItem from "./LinkItem";

function LinkResults({ links, activeMode, darkMode }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border shadow-sm ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
      }`}
    >
      <div
        className={`flex justify-between border-b p-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 ${
          darkMode
            ? "border-slate-700 bg-slate-900/50"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <span>{links.length} Result(s)</span>
        <span>Mode: {activeMode}</span>
      </div>

      <div
        className={`divide-y ${
          darkMode ? "divide-slate-700" : "divide-slate-100"
        }`}
      >
        {links.length > 0 ? (
          links.map((link) => (
            <LinkItem key={link.id} link={link} darkMode={darkMode} />
          ))
        ) : (
          <div className="p-10 text-center text-sm italic text-slate-400">
            No matches found.
          </div>
        )}
      </div>
    </div>
  );
}

export default LinkResults;
