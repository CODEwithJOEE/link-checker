import HeadingItem from "./HeadingItem";

function HeadingResults({ data, darkMode }) {
  if (!data || !data.headings || data.headings.length === 0) {
    return (
      <div
        className={`p-10 text-center text-sm italic rounded-2xl border ${darkMode ? "border-slate-700 bg-slate-800 text-slate-400" : "border-slate-200 bg-white text-slate-500"}`}
      >
        No headings found on this page.
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border shadow-sm ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}
    >
      <div
        className={`flex flex-col sm:flex-row justify-between p-3 text-[10px] font-bold uppercase tracking-widest border-b ${darkMode ? "border-slate-700 bg-slate-900/50 text-slate-400" : "border-slate-200 bg-slate-50 text-slate-500"}`}
      >
        <span>{data.meta.totalHeadings} Heading(s) Found</span>
        <span>
          H1 Tags: {data.meta.h1Count}{" "}
          {data.meta.h1Count !== 1 && (
            <span className="text-red-400">(Should be exactly 1)</span>
          )}
        </span>
      </div>

      <div
        className={`divide-y ${darkMode ? "divide-slate-700" : "divide-slate-100"}`}
      >
        {data.headings.map((heading) => (
          <HeadingItem key={heading.id} heading={heading} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
}

export default HeadingResults;
