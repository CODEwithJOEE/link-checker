export function analyzeHeadings(htmlInput, options = {}) {
  const { scope = "content" } = options;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlInput, "text/html");

  const headings = Array.from(
    doc.querySelectorAll("h1, h2, h3, h4, h5, h6"),
  ).map((el, index) => {
    const level = parseInt(el.tagName.replace("H", ""), 10);
    const text = el.textContent?.trim() || "";
    const charCount = text.length;

    let status = "success";
    let issues = [];
    let issueTypes = []; // 👈 Bagong array para i-track kung SEO o Accessibility

    if (!text) {
      status = "error";
      issues.push("Empty heading");
      issueTypes.push("seo"); // Walang text = SEO issue
    } else {
      if (level === 1 && (charCount < 20 || charCount > 70)) {
        status = "warning";
        issues.push(charCount > 70 ? "Too long" : "Too short");
        issueTypes.push("seo"); // Masyadong mahaba/maikli ang H1 = SEO issue
      } else if (level > 1 && (charCount < 10 || charCount > 70)) {
        status = "warning";
        issues.push(charCount > 70 ? "Too long" : "Too short");
        issueTypes.push("seo");
      }
    }

    return {
      id: `heading-${index}-${level}`,
      level,
      text,
      charCount,
      status,
      issues,
      issueTypes, // 👈 Isama sa return object
    };
  });

  // Check for Multiple H1s
  const h1Count = headings.filter((h) => h.level === 1).length;
  if (h1Count > 1) {
    headings.forEach((h) => {
      if (h.level === 1) {
        h.status = "error";
        h.issues.push("Multiple H1 tags found");
        h.issueTypes.push("seo");
      }
    });
  }

  // Check for Hierarchy Skips (e.g., H1 -> H3)
  let previousLevel = 0;
  for (const heading of headings) {
    if (previousLevel !== 0 && heading.level > previousLevel + 1) {
      heading.status = "warning";
      heading.issues.push(
        `Skipped from H${previousLevel} to H${heading.level}`,
      );
      heading.issueTypes.push("accessibility"); // Skip sa hierarchy = Accessibility issue
    }
    previousLevel = heading.level;
  }

  const levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  let seoIssues = 0;
  let accessibilityIssues = 0;

  headings.forEach((h) => {
    levelCounts[h.level]++;
    // Bilangin base sa issueTypes
    if (h.issueTypes.includes("seo")) seoIssues++;
    if (h.issueTypes.includes("accessibility")) accessibilityIssues++;
  });

  return {
    headings,
    meta: {
      h1Count,
      totalHeadings: headings.length,
      levelCounts,
      seoIssues,
      accessibilityIssues,
    },
  };
}
