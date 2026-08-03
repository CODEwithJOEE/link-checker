import dns from "node:dns/promises";
import net from "node:net";

const MAX_REDIRECTS = 5;
const MAX_HTML_SIZE = 5 * 1024 * 1024; // 5 MB

function json(data, status = 200) {
  return Response.json(data, { status });
}

function isPrivateIpv4(ip) {
  const parts = ip.split(".").map(Number);

  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    return true;
  }

  const [a, b] = parts;

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

function isPrivateIpv6(ip) {
  const normalized = ip.toLowerCase();

  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb")
  );
}

function isPrivateIp(ip) {
  const version = net.isIP(ip);

  if (version === 4) return isPrivateIpv4(ip);
  if (version === 6) return isPrivateIpv6(ip);

  return true;
}

async function validatePublicUrl(value) {
  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error("Please enter a valid article URL.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are allowed.");
  }

  if (url.username || url.password) {
    throw new Error("URLs containing usernames or passwords are not allowed.");
  }

  const hostname = url.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    throw new Error("Local network URLs are not allowed.");
  }

  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      throw new Error("Private network addresses are not allowed.");
    }

    return url;
  }

  let addresses;

  try {
    addresses = await dns.lookup(hostname, {
      all: true,
      verbatim: true,
    });
  } catch {
    throw new Error("The website hostname could not be resolved.");
  }

  if (
    addresses.length === 0 ||
    addresses.some(({ address }) => isPrivateIp(address))
  ) {
    throw new Error("The URL does not point to a public website.");
  }

  return url;
}

async function fetchWithSafeRedirects(initialUrl) {
  let currentUrl = await validatePublicUrl(initialUrl);

  for (
    let redirectCount = 0;
    redirectCount <= MAX_REDIRECTS;
    redirectCount += 1
  ) {
    const response = await fetch(currentUrl, {
      method: "GET",
      redirect: "manual",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent":
          "Mozilla/5.0 (compatible; OBI-Link-Hunter/1.0; +https://obi.services)",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");

      if (!location) {
        throw new Error("The website returned an invalid redirect.");
      }

      currentUrl = await validatePublicUrl(
        new URL(location, currentUrl).toString(),
      );

      continue;
    }

    return {
      response,
      finalUrl: currentUrl.toString(),
    };
  }

  throw new Error("The page redirected too many times.");
}

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return json({ error: "Only POST requests are allowed." }, 405);
    }

    try {
      const body = await request.json();
      const articleUrl = body?.url?.trim();

      if (!articleUrl) {
        return json({ error: "Please enter an article URL." }, 400);
      }

      const { response, finalUrl } = await fetchWithSafeRedirects(articleUrl);

      if (!response.ok) {
        return json(
          {
            error: `The page returned HTTP status ${response.status}.`,
          },
          400,
        );
      }

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.toLowerCase().includes("text/html")) {
        return json(
          {
            error: "The URL does not appear to be an HTML webpage.",
          },
          400,
        );
      }

      const contentLength = Number(response.headers.get("content-length") || 0);

      if (contentLength > MAX_HTML_SIZE) {
        return json({ error: "The webpage is too large to analyze." }, 413);
      }

      const html = await response.text();

      if (html.length > MAX_HTML_SIZE) {
        return json({ error: "The webpage is too large to analyze." }, 413);
      }

      return json({
        html,
        finalUrl,
      });
    } catch (error) {
      console.error("URL analysis failed:", error);

      const message =
        error?.name === "TimeoutError"
          ? "The website took too long to respond."
          : error?.message || "The website could not be retrieved.";

      return json({ error: message }, 500);
    }
  },
};
