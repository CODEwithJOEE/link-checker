export function filterLinks(
  links,
  { activeMode = "obi", searchTerm = "" } = {},
) {
  let results = [...links];

  if (activeMode === "obi") {
    results = results.filter((link) => link.isObi);
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (normalizedSearch) {
    results = results.filter((link) => {
      const text = link.text.toLowerCase();
      const href = link.href.toLowerCase();

      return text.includes(normalizedSearch) || href.includes(normalizedSearch);
    });
  }

  return results;
}
