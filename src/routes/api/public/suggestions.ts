import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/suggestions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const prefix = url.searchParams.get("prefix") ?? "";
        if (!prefix.trim()) {
          return new Response(JSON.stringify({ completions: [] }), {
            headers: { "content-type": "application/json" },
          });
        }
        const upstream = new URL(
          "https://www.marktplaats.nl/header/searches/suggestions",
        );
        upstream.searchParams.set("prefix", prefix);
        upstream.searchParams.set("category", "0");
        try {
          const res = await fetch(upstream.toString(), {
            headers: {
              accept: "application/json",
              "user-agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
            },
          });
          const body = await res.text();
          return new Response(body, {
            status: res.status,
            headers: {
              "content-type": "application/json",
              "cache-control": "public, max-age=60",
            },
          });
        } catch (err) {
          return new Response(
            JSON.stringify({ completions: [], error: String(err) }),
            { status: 502, headers: { "content-type": "application/json" } },
          );
        }
      },
    },
  },
});
