import type { Currency } from "@/lib/data/types";
import { bondScoresFromCards, clampScore, parseTenYear } from "@/lib/data/rs-engine";

/**
 * Prototype only. Market yield minus the US Treasury, both tenors, in basis points.
 * USD is the dollar versus the other seven, because a spread versus itself is zero.
 * 0 bp scores 50. Each 4 bp moves the score by 1. Plus or minus 200 bp is 100 or 0.
 * Not an input to bondScoresFromCards, the ranking, the pair book, or the regime index.
 */
export const YIELD_SPREAD_BP = 4;

export type YieldSpreadVersus = "USD" | "G10 ex-USD";

export type YieldSpreadRow = {
  id: string;
  code: string;
  bp2: number | null;
  bp10: number | null;
  avgBp: number | null;
  score: number | null;
  versus: YieldSpreadVersus;
  asOf: string;
  liveBond: number;
};

function dated(raw: string): string {
  const m = String(raw ?? "").match(/\(([^)]+)\)/);
  return m?.[1]?.trim() ?? "";
}

function mean(xs: number[]): number {
  if (!xs.length) return NaN;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function gap(level: number, ref: number): number | null {
  if (!Number.isFinite(level) || !Number.isFinite(ref)) return null;
  return (level - ref) * 100;
}

export function yieldSpreadBoard(list: Currency[]): YieldSpreadRow[] {
  const usd = list.find((c) => c.id === "usd");
  const usd2 = usd ? parseTenYear(usd.bonds?.y2 ?? "") : NaN;
  const usd10 = usd ? parseTenYear(usd.bonds?.y10 ?? "") : NaN;
  const others = list.filter((c) => c.id !== "usd");
  const mean2 = mean(others.map((c) => parseTenYear(c.bonds?.y2 ?? "")).filter((n) => Number.isFinite(n)));
  const mean10 = mean(others.map((c) => parseTenYear(c.bonds?.y10 ?? "")).filter((n) => Number.isFinite(n)));
  const live = bondScoresFromCards(list);

  return list.map((c) => {
    const y2 = parseTenYear(c.bonds?.y2 ?? "");
    const y10 = parseTenYear(c.bonds?.y10 ?? "");
    const isUsd = c.id === "usd";
    const bp2 = gap(y2, isUsd ? mean2 : usd2);
    const bp10 = gap(y10, isUsd ? mean10 : usd10);
    const parts = [bp2, bp10].filter((n): n is number => n != null);
    const avgBp = parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : null;
    const d2 = dated(c.bonds?.y2 ?? "");
    const d10 = dated(c.bonds?.y10 ?? "");
    const asOf = d2 && d10 && d2 !== d10 ? `${d2} / ${d10}` : d2 || d10 || "—";
    return {
      id: c.id,
      code: c.code,
      bp2,
      bp10,
      avgBp,
      score: avgBp == null ? null : clampScore(50 + avgBp / YIELD_SPREAD_BP),
      versus: isUsd ? "G10 ex-USD" : "USD",
      asOf,
      liveBond: live[c.id] ?? 50,
    };
  });
}
