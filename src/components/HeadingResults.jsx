import HeadingItem from "./HeadingItem";

// Helper component para sa maliliit na stats cards
function StatCard({ label, value, darkMode }) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-xl border shadow-sm ${
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      }`}
    >
      <span className="text-3xl font-black text-blue-500 mb-1">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">
        {label}
      </span>
    </div>
  );
}

function HeadingResults({ data, darkMode, analyzedUrl }) {
  if (!data || !data.headings) return null;

  const { meta, headings } = data;

  return (
    <div className="space-y-6">
      {/* 1. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Headings"
          value={meta.totalHeadings}
          darkMode={darkMode}
        />
        <StatCard label="H1 Tags" value={meta.h1Count} darkMode={darkMode} />
        <StatCard
          label="Accessibility Issues"
          value={meta.accessibilityIssues}
          darkMode={darkMode}
        />
        <StatCard
          label="SEO Issues"
          value={meta.seoIssues}
          darkMode={darkMode}
        />
      </div>

      {/* 2. URL INFO SECTION */}
      {analyzedUrl && (
        <div
          className={`rounded-xl overflow-hidden shadow-sm border ${
            darkMode ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <div
            className={`p-3 text-sm font-bold ${
              darkMode
                ? "bg-slate-800 text-slate-200"
                : "bg-slate-50 text-slate-800"
            }`}
          >
            URL Information
          </div>
          <div
            className={`p-5 text-sm space-y-3 ${
              darkMode
                ? "bg-slate-900 text-slate-300"
                : "bg-white text-slate-700"
            }`}
          >
            <p>
              <span className="font-bold">Analyzed URL:</span>{" "}
              <span className="break-all">{analyzedUrl}</span>
            </p>
            <p>
              <span className="font-bold">Response Code:</span>{" "}
              <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                200
              </span>
            </p>
          </div>
        </div>
      )}

      {/* 3. HEADING STATISTICS BREAKDOWN */}
      <div
        className={`rounded-xl overflow-hidden shadow-sm border ${
          darkMode ? "border-slate-700" : "border-slate-200"
        }`}
      >
        <div
          className={`p-3 text-sm font-bold ${
            darkMode
              ? "bg-slate-800 text-slate-200"
              : "bg-slate-50 text-slate-800"
          }`}
        >
          Heading Statistics
        </div>
        <div
          className={`p-5 grid grid-cols-3 sm:grid-cols-6 gap-3 ${
            darkMode ? "bg-slate-900" : "bg-white"
          }`}
        >
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <div
              key={level}
              className={`flex flex-col items-center p-3 rounded-lg border ${
                darkMode
                  ? "border-slate-700 bg-slate-800"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <span className="text-[10px] font-bold text-blue-500 mb-1">
                H{level}:
              </span>
              <span
                className={`text-xl font-bold ${
                  meta.levelCounts[level] > 0
                    ? darkMode
                      ? "text-slate-100"
                      : "text-slate-800"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {meta.levelCounts[level]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. DETAILED LIST (Table Format) */}
      <div
        className={`overflow-hidden rounded-xl border shadow-sm ${
          darkMode ? "border-slate-700" : "border-slate-200"
        }`}
      >
        {/* 👇 Binago natin ang background ng header para maging consistent sa ibang section 👇 */}
        <div
          className={`p-3 text-sm font-bold ${
            darkMode
              ? "bg-slate-800 text-slate-200"
              : "bg-slate-50 text-slate-800"
          }`}
        >
          Heading Structure
        </div>

        <div
          className={`overflow-x-auto ${darkMode ? "bg-slate-900" : "bg-white"}`}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-[10px] uppercase tracking-wider ${
                  darkMode
                    ? "border-slate-700 bg-slate-800 text-slate-400"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                <th className="py-3 px-4 font-bold w-16">Order</th>
                <th className="py-3 px-4 font-bold w-20">Level</th>
                <th className="py-3 px-4 font-bold">Heading Text</th>
                <th className="py-3 px-4 font-bold w-28">Status</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                darkMode ? "divide-slate-700/50" : "divide-slate-100"
              }`}
            >
              {headings.map((heading, index) => (
                <HeadingItem
                  key={heading.id}
                  heading={heading}
                  index={index}
                  darkMode={darkMode}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HeadingResults;
