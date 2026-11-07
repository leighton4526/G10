import { createFileRoute } from "@tanstack/react-router";
import { ccyPayload } from "@/lib/data/bot-feeds";

const headers = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "cache-control": "public, max-age=60",
};

export const Route = createFileRoute("/api/ccy/$code")({
  server: {
    handlers: {
      GET: ({ params }) => {
        const code = params.code.toUpperCase();
        const body = ccyPayload(code);
        if (!body) return Response.json({ error: "unknown currency" }, { status: 404, headers });
        const text = JSON.stringify(body);
        if (text.length > 6000) {
          return Response.json({ error: "payload over 6 KB", bytes: text.length }, { status: 500, headers });
        }
        return new Response(text, { headers });
      },
    },
  },
});
