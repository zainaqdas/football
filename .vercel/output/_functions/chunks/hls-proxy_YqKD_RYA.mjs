const GET = async ({ url }) => {
  const targetUrl = url.searchParams.get("url");
  if (!targetUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }
  try {
    const response = await fetch(targetUrl, {
      headers: {
        "Referer": "https://tvtvhd.com/",
        "Origin": "https://tvtvhd.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*"
      }
    });
    if (!response.ok) {
      return new Response(`Upstream error: ${response.status}`, {
        status: response.status
      });
    }
    const contentType = response.headers.get("content-type") || "";
    const body = await response.arrayBuffer();
    if (contentType.includes("m3u8") || targetUrl.includes(".m3u8")) {
      const text = new TextDecoder().decode(body);
      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf("/") + 1);
      const proxyBase = "/api/hls-proxy?url=";
      const rewritten = text.split("\n").map((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("#") || trimmed === "") return line;
        if (!trimmed.startsWith("http")) {
          const resolved = new URL(trimmed, baseUrl).href;
          return proxyBase + encodeURIComponent(resolved);
        }
        return proxyBase + encodeURIComponent(trimmed);
      }).join("\n");
      return new Response(rewritten, {
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      });
    }
    return new Response(body, {
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "Content-Length, Content-Range",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (e) {
    return new Response(`Proxy error: ${e.message}`, { status: 502 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
