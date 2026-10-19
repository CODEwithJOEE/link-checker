import { useEffect, useMemo, useState } from "react";

import Header from "./components/Header";
import HtmlInput from "./components/HtmlInput";
import LinkSearch from "./components/LinkSearch";
import LinkResults from "./components/LinkResults";
import EmptyState from "./components/EmptyState";

import useDarkMode from "./hooks/useDarkMode";
import { analyzeHtml } from "./utils/analyzeHtml";
import { fetchPageHtml } from "./utils/fetchPageHtml";
import { filterLinks } from "./utils/linkFilters";
import { analyzeHeadings } from "./utils/analyzeHeadings";
import HeadingResults from "./components/HeadingResults";

function App() {
  const [urlInput, setUrlInput] = useState("");
  const [htmlInput, setHtmlInput] = useState("");
  const [links, setLinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMode, setActiveMode] = useState("obi");
  const [linkScope, setLinkScope] = useState("content");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [analyzedPage, setAnalyzedPage] = useState("");
  const [headingResults, setHeadingResults] = useState(null);

  const { darkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    // Kung may laman ang htmlInput, i-re-run ang analysis kapag nagpalit ng tab
    if (htmlInput.trim()) {
      runAnalysis(htmlInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMode]);

  // ONE shared function for analysis
  function runAnalysis(html) {
    if (activeMode === "headings") {
      const headingData = analyzeHeadings(html, { scope: linkScope });
      setHeadingResults(headingData);
      setLinks([]);
      setSearchTerm("");
    } else {
      const results = analyzeHtml(html, { scope: linkScope });
      setLinks(results);
      setHeadingResults(null);
      setSearchTerm("");
    }
  }

  function handleAnalyzeHtml() {
    if (!htmlInput.trim()) {
      setError("Please paste the page HTML first.");
      return;
    }

    setError("");
    setAnalyzedPage("Manually pasted HTML");
    runAnalysis(htmlInput);
  }

  async function handleAnalyzeUrl() {
    const url = urlInput.trim();

    if (!url) {
      setError("Please enter an article URL.");
      return;
    }

    setIsLoading(true);
    setError("");
    setLinks([]);
    setSearchTerm("");
    setHeadingResults(null);

    try {
      const { html, finalUrl } = await fetchPageHtml(url);

      setHtmlInput(html);
      setAnalyzedPage(finalUrl || url);
      runAnalysis(html);
    } catch (fetchError) {
      setError(fetchError.message || "The article could not be analyzed.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClear() {
    setUrlInput("");
    setHtmlInput("");
    setLinks([]);
    setSearchTerm("");
    setError("");
    setAnalyzedPage("");
    setHeadingResults(null);
  }

  const filteredLinks = useMemo(
    () =>
      filterLinks(links, {
        activeMode,
        searchTerm,
      }),
    [links, activeMode, searchTerm],
  );

  return (
    <div
      className={`min-h-screen pb-10 font-sans transition-colors duration-300 ${
        darkMode ? "bg-slate-900 text-slate-100" : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      <Header
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        activeMode={activeMode}
        onModeChange={setActiveMode}
      />

      <main className="mx-auto max-w-4xl p-6">
        <HtmlInput
          urlInput={urlInput}
          onUrlChange={setUrlInput}
          htmlInput={htmlInput}
          onHtmlChange={setHtmlInput}
          onAnalyzeUrl={handleAnalyzeUrl}
          onAnalyzeHtml={handleAnalyzeHtml}
          onClear={handleClear}
          activeMode={activeMode}
          linkScope={linkScope}
          onScopeChange={setLinkScope}
          darkMode={darkMode}
          isLoading={isLoading}
          error={error}
        />

        {analyzedPage && (links.length > 0 || headingResults) && (
          <div
            className={`mb-4 rounded-xl border p-3 text-xs ${
              darkMode
                ? "border-slate-700 bg-slate-800 text-slate-300"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            <span className="font-bold">Analyzed source:</span>{" "}
            <span className="break-all">{analyzedPage}</span>
          </div>
        )}

        <section className="space-y-4">
          {activeMode === "headings" ? (
            headingResults ? (
              <HeadingResults
                data={headingResults}
                darkMode={darkMode}
                analyzedUrl={analyzedPage} // 👈 Ipasok ito
              />
            ) : (
              <EmptyState activeMode={activeMode} darkMode={darkMode} />
            )
          ) : links.length > 0 ? (
            <>
              <LinkSearch
                value={searchTerm}
                onChange={setSearchTerm}
                activeMode={activeMode}
                darkMode={darkMode}
              />

              <LinkResults
                links={filteredLinks}
                activeMode={activeMode}
                darkMode={darkMode}
              />
            </>
          ) : (
            <EmptyState activeMode={activeMode} darkMode={darkMode} />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
