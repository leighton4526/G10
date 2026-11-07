import { createServerFn } from "@tanstack/react-start";

export type LiveQuote = {
  id: string;
  last: number;
  weekPct: number | null;
};

const YAHOO: { id: string; symbol: string }[] = [
  { id: "wti", symbol: "CL=F" },
  { id: "brent", symbol: "BZ=F" },
  { id: "gold", symbol: "GC=F" },
  { id: "dxy", symbol: "DX-Y.NYB" },
  { id: "usdchf", symbol: "USDCHF=X" },
  { id: "usdjpy", symbol: "USDJPY=X" },
];

async function yahooWeek(symbol: string): Promise<LiveQuote | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=8d&interval=1d`;
  const res = await fetch(url, {
    headers: { "User-Agent": "G10Desk/1.0" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    chart?: {
      result?: Array<{
        meta?: { regularMarketPrice?: number };
        indicators?: { quote?: Array<{ close?: Array<number | null> }> };
      }>;
    };
  };
  const row = json.chart?.result?.[0];
  const closes = (row?.indicators?.quote?.[0]?.close ?? []).filter(
    (n): n is number => typeof n === "number" && Number.isFinite(n),
  );
  const last = row?.meta?.regularMarketPrice ?? closes.at(-1);
  if (!Number.isFinite(last)) return null;
  const first = closes.length >= 2 ? closes[0] : null;
  const weekPct =
    first && first !== 0 ? ((Number(last) - first) / first) * 100 : null;
  return { id: symbol, last: Number(last), weekPct };
}

export const fetchLiveTickers = createServerFn({ method: "GET" }).handler(
  async (): Promise<Record<string, LiveQuote>> => {
    const out: Record<string, LiveQuote> = {};
    await Promise.all(
      YAHOO.map(async ({ id, symbol }) => {
        try {
          const q = await yahooWeek(symbol);
          if (q) out[id] = { id, last: q.last, weekPct: q.weekPct };
        } catch {
          /* keep scrape fallback */
        }
      }),
    );
    return out;
  },
);
