import { createFileRoute } from "@tanstack/react-router";

const headers = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "cache-control": "public, max-age=300",
};

type Bar = { t: number; o: number; h: number; l: number; c: number; v: number };

export const Route = createFileRoute("/api/pair-bars")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const pair = new URL(request.url).searchParams.get("pair")?.toUpperCase().replace(/[^A-Z]/g, "") ?? "";
        if (pair.length < 6) {
          return Response.json({ error: "pair required" }, { status: 400, headers });
        }
        const pulled = await pull(pair, "3mo") ?? await pull(pair, "1mo");
        if (!pulled) {
          return Response.json({ error: "bars unavailable", pair }, { status: 502, headers });
        }
        return Response.json(
          { pair, interval: "4h", source: "Yahoo 1h, bucketed to 4h", bars: pulled },
          { headers },
        );
      },
    },
  },
});

async function pull(pair: string, range: string): Promise<Bar[] | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${pair}=X?interval=1h&range=${range}`;
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!res.ok) return null;
  const body = await res.json();
  const result = body?.chart?.result?.[0];
  const times: number[] = result?.timestamp ?? [];
  const quote = result?.indicators?.quote?.[0] ?? {};
  const bars = toFourHour(times, quote);
  return bars.length ? bars : null;
}

function toFourHour(
  times: number[],
  quote: { open?: Array<number | null>; high?: Array<number | null>; low?: Array<number | null>; close?: Array<number | null>; volume?: Array<number | null> },
): Bar[] {
  const buckets = new Map<number, Bar>();
  for (let i = 0; i < times.length; i++) {
    const o = quote.open?.[i];
    const h = quote.high?.[i];
    const l = quote.low?.[i];
    const c = quote.close?.[i];
    if (o == null || h == null || l == null || c == null) continue;
    const v = quote.volume?.[i] ?? 0;
    const bucket = Math.floor(times[i] / (4 * 3600)) * 4 * 3600;
    const prev = buckets.get(bucket);
    if (!prev) {
      buckets.set(bucket, { t: bucket, o, h, l, c, v: v > 0 ? v : 0 });
      continue;
    }
    prev.h = Math.max(prev.h, h);
    prev.l = Math.min(prev.l, l);
    prev.c = c;
    if (v > 0) prev.v += v;
  }
  return [...buckets.values()].sort((a, b) => a.t - b.t).slice(-500);
}
