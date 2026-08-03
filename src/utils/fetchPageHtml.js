export async function fetchPageHtml(url) {
  const response = await fetch("/api/fetch-page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("The server returned an unexpected response.");
  }

  if (!response.ok) {
    throw new Error(data.error || "Unable to retrieve the article.");
  }

  if (!data.html) {
    throw new Error("No HTML content was returned by the website.");
  }

  return data;
}
