export function analyzeHeadings(htmlInput, options = {}) {
  const { scope = "content" } = options;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlInput, "text/html");

  // Kung gusto mong limitahan sa content area lang, pwede mong i-import ang findContentContainer
  // Pero sa ngayon, kunin natin lahat ng headings sa page para makita ang buong picture.
  const headings = Array.from(
    doc.querySelectorAll("h1, h2, h3, h4, h5, h6"),
  ).map((el, index) => {
    const level = parseInt(el.tagName.replace("H", ""), 10);
    const text = el.textContent?.trim() || "";
    const charCount = text.length;

    let status = "success"; // success, warning, error
    let issues = [];

    if (!text) {
      status = "error";
      issues.push("Empty heading");
    } else {
      // Length checks (SEO Best Practices)
      if (level === 1 && (charCount < 20 || charCount > 70)) {
        status = "warning";
        issues.push(charCount > 70 ? "Too long" : "Too short");
      } else if (level > 1 && (charCount < 10 || charCount > 70)) {
        status = "warning";
        issues.push(charCount > 70 ? "Too long" : "Too short");
      }
    }

    return {
      id: `heading-${index}-${level}`,
      level,
      text,
      charCount,
      status,
      issues,
    };
  });

  // Check for Multiple H1s
  const h1Count = headings.filter((h) => h.level === 1).length;
  if (h1Count === 0) {
    // Pwede mong i-flag ang buong result array, pero dito natin i-append bilang meta data
  } else if (h1Count > 1) {
    headings.forEach((h) => {
      if (h.level === 1) {
        h.status = "error";
        h.issues.push("Multiple H1 tags found");
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
    }
    previousLevel = heading.level;
  }

  return {
    headings,
    meta: {
      h1Count,
      totalHeadings: headings.length,
    },
  };
}
