import {
  IoCodeSlashOutline,
  IoLinkOutline,
  IoSearchOutline,
  IoTrashOutline,
} from "react-icons/io5";

function HtmlInput({
  urlInput,
  onUrlChange,
  htmlInput,
  onHtmlChange,
  onAnalyzeUrl,
  onAnalyzeHtml,
  onClear,
  activeMode,
  linkScope,
  onScopeChange,
  darkMode,
  isLoading,
  error,
}) {
  return (
    <section
      className={`mb-6 rounded-2xl border p-5 shadow-sm transition-colors ${
        darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <IoLinkOutline className="text-blue-500" />

        <label
          htmlFor="article-url"
          className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
        >
          Analyze Article by URL
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="article-url"
          type="url"
          value={urlInput}
          onChange={(event) => onUrlChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !isLoading) {
              onAnalyzeUrl();
            }
          }}
          placeholder="https://example.com/article/"
          className={`min-w-0 flex-1 rounded-xl border-2 p-4 text-sm outline-none transition ${
            darkMode
              ? "border-slate-700 bg-slate-900 text-slate-200 placeholder:text-slate-500 focus:border-blue-500"
              : "border-slate-100 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-blue-400"
          }`}
        />

        <button
          type="button"
          onClick={onAnalyzeUrl}
          disabled={isLoading || !urlInput.trim()}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <IoSearchOutline size={18} />

          {isLoading ? "FETCHING..." : "ANALYZE URL"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      <div className="my-6 flex items-center gap-4">
        <div
          className={`h-px flex-1 ${
            darkMode ? "bg-slate-700" : "bg-slate-200"
          }`}
        />

        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Or paste HTML manually
        </span>

        <div
          className={`h-px flex-1 ${
            darkMode ? "bg-slate-700" : "bg-slate-200"
          }`}
        />
      </div>

      <div className="mb-2 flex justify-between">
        <div className="flex items-center gap-2">
          <IoCodeSlashOutline className="text-slate-400" />

          <label
            htmlFor="html-source"
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
          >
            Target HTML Source
          </label>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 text-[10px] font-bold uppercase text-red-400 hover:text-red-500"
        >
          <IoTrashOutline size={12} />
          Clear Inputs
        </button>
      </div>

      <textarea
        id="html-source"
        value={htmlInput}
        onChange={(event) => onHtmlChange(event.target.value)}
        placeholder="Paste Ctrl+U page source here..."
        className={`h-40 w-full rounded-xl border-2 p-4 font-mono text-sm outline-none transition ${
          darkMode
            ? "border-slate-700 bg-slate-900 text-slate-300 placeholder:text-slate-500 focus:border-blue-500"
            : "border-slate-100 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-blue-400"
        }`}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onScopeChange("content")}
          className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
            linkScope === "content"
              ? "border-blue-600 bg-blue-600 text-white"
              : darkMode
                ? "border-slate-700 bg-slate-900 text-slate-300"
                : "border-slate-200 bg-white text-slate-600"
          }`}
        >
          Content Links Only
        </button>

        <button
          type="button"
          onClick={() => onScopeChange("all")}
          className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
            linkScope === "all"
              ? "border-blue-600 bg-blue-600 text-white"
              : darkMode
                ? "border-slate-700 bg-slate-900 text-slate-300"
                : "border-slate-200 bg-white text-slate-600"
          }`}
        >
          Full Page Links
        </button>
      </div>

      <button
        type="button"
        onClick={onAnalyzeHtml}
        disabled={isLoading || !htmlInput.trim()}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-700 py-4 font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <IoSearchOutline size={20} />
        ANALYZE {activeMode === "obi" ? "OBI SERVICES LINKS" : "ALL LINKS"} FROM
        HTML
      </button>
    </section>
  );
}

export default HtmlInput;
