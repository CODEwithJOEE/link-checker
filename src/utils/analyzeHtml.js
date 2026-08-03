import { CONTENT_SELECTORS, EXCLUDED_SELECTORS } from "../constants/selectors";

function findContentContainer(doc) {
  for (const selector of CONTENT_SELECTORS) {
    const element = doc.querySelector(selector);

    if (element) {
      return element;
    }
  }

  return doc.body;
}

function isExcludedLink(anchor) {
  return EXCLUDED_SELECTORS.some((selector) => anchor.closest(selector));
}

function normalizeHref(href) {
  return href.trim();
}

function isObiLink(href) {
  try {
    const url = new URL(href, "https://obi.services");

    return (
      url.hostname === "obi.services" || url.hostname.endsWith(".obi.services")
    );
  } catch {
    return false;
  }
}

export function analyzeHtml(htmlInput, options = {}) {
  const { scope = "content" } = options;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlInput, "text/html");

  const container = scope === "content" ? findContentContainer(doc) : doc.body;

  if (!container) return [];

  return Array.from(container.querySelectorAll("a"))
    .filter((anchor) => {
      if (scope === "all") return true;

      return !isExcludedLink(anchor);
    })
    .map((anchor, index) => {
      const rel = anchor.getAttribute("rel") || "";
      const href = normalizeHref(anchor.getAttribute("href") || "");

      return {
        id: `${index}-${href}`,
        text:
          anchor.textContent?.trim() ||
          anchor.getAttribute("aria-label") ||
          anchor.querySelector("img")?.getAttribute("alt") ||
          "[No Text/Image Link]",
        href: href || "#",
        isNoFollow: rel.toLowerCase().split(/\s+/).includes("nofollow"),
        isObi: isObiLink(href),
      };
    });
}
