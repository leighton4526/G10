import { createFileRoute } from "@tanstack/react-router";

const headers = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "cache-control": "public, max-age=900",
};

const SYMBOLS: Record<string, { symbol: string; source: string }> = {
  wti: { symbol: "CL=F", source: "NYMEX WTI daily, last six months" },
  ore: { symbol: "TIO=F", source: "SGX 62% Fe daily, last six months" },
};

export const Route = createFileRoute("/api/commodity-bars")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const id = new URL(request.url).searchParams.get("id")?.toLowerCase() ?? "";
        const spec = SYMBOLS[id];
        if (!spec) return Response.json({ id, points: [] }, { headers });
        try {
          const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(spec.symbol)}?interval=1d&range=6mo`;
          const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
          if (!res.ok) return Response.json({ id, points: [], source: spec.source }, { headers });
          const body = await res.json();
          const result = body?.chart?.result?.[0];
          const times: number[] = result?.timestamp ?? [];
          const closes: Array<number | null> = result?.indicators?.quote?.[0]?.close ?? [];
          const points = times
            .map((t, i) => {
              const c = closes[i];
              if (c == null || !Number.isFinite(c)) return null;
              return { d: new Date(t * 1000).toISOString().slice(0, 10), v: Math.round(c * 100) / 100 };
            })
            .filter((p): p is { d: string; v: number } => p != null);
          return Response.json({ id, symbol: spec.symbol, source: spec.source, points }, { headers });
        } catch {
          return Response.json({ id, points: [], source: "Yahoo" }, { headers });
        }
      },
    },
  },
});
