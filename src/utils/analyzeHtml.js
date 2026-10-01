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
  // Skip hash-only at empty links
  if (!href || href === "#" || href.startsWith("#")) {
    return false;
  }

  // Dismiss relative URLs at links na walang http(s) scheme
  if (
    href.startsWith("/") ||
    href.startsWith("./") ||
    href.startsWith("../") ||
    !/^https?:\/\//i.test(href)
  ) {
    return false;
  }

  try {
    const url = new URL(href); // Walang fallback base

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

  const links = Array.from(container.querySelectorAll("a"))
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

  // Exact href dedup — same destination = 1 count
  const seen = new Set();

  return links.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}
