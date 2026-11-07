/** Structured risk-regime tape. The RS risk bucket and the top tile share this. */
import { assertTape } from "./desk-hard-copy";
import { SETTLES } from "./read-settles";

export type RiskTape = {
  asOf: string;
  /** Hormuz constrained / shooting war. */
  war: boolean;
  warNote: string;
  wti: number;
  wtiWeekAgo: number;
  wtiWeekAgoNote: string;
  brent: number;
  /** Same-contract settle one week earlier. Plain 1w, not a rolled 5-day. */
  brentWeekAgo: number;
  gold: number;
  /** December contract, same weekday one week earlier. */
  goldWeekAgo: number;
  goldNote: string;
  dxy: number;
  usdchf: number;
  usdchfNote: string;
  usdjpy: number;
  usdjpyNote: string;
  vix: number;
  /** 62% Fe CFR China / TSI. AUD income print. */
  ironOre: number;
  ironOreWeekAgo: number;
  ironOreNote: string;
  /** Last GDT Price Index % change (fortnightly auction, not a 1w tape). NZD income. */
  gdtPct: number;
  gdtNote: string;
  /** Settlement weekday label. The 1w caption is built from this. Do not type the sentence. */
  settleOn: string;
  /** Same weekday one week earlier. */
  weekAgoOn: string;
};

/**
 * Friday 6 Nov 2026, 04:53 GMT.
 * Chips are the Thu 5 Nov settlement (FX = 5pm New York cut).
 */
export const RISK_TAPE: RiskTape = {
  asOf: "Friday 6 Nov 2026 · 04:53 GMT. FX chips are the completed Thu 5 Nov settles (5pm New York cut). Live mid, 04:35 GMT 6 Nov, is not a settle.",
  war: true,
  warNote:
    "Checked Friday 6 Nov 2026. Strait stays effectively closed, day 250 since 28 Feb 2026. Fresh tanker strikes and UKMTO warnings reversed the midweek plunge. War is still on. Brent front is BZF7, Thursday settle 98.29. Label Brent Jan27 (BZF7).",
  wti: 90.52,
  wtiWeekAgo: 101.994,
  wtiWeekAgoNote:
    "WTI CLZ6 Thursday 5 Nov settle 90.52. Sheet 1d +2.72%. Sheet 1w −11.25% versus Thursday 29 Oct. More than 3% down and below 100. The Thursday rebound does not lift the week. The oil-vote cap does not bind. The flavour stays oil/war because war is on.",
  brent: 98.29,
  brentWeekAgo: 110.799,
  gold: 4113.5,
  goldWeekAgo: 4031.26,
  goldNote: "Gold front Thursday 5 Nov settle 4,113.5. Sheet 1d +0.99%. Sheet 1w +2.04%.",
  dxy: Number(SETTLES.fx.DXY.text),
  usdchf: Number(SETTLES.fx.USDCHF.text),
  usdchfNote:
    "Settles 2026-11-06 · Oanda v3 USD_CHF, Thursday 5 Nov 5pm New York. 0.81663. Sheet pair 1w −0.93%. 0.7900 is not hit.",
  usdjpy: Number(SETTLES.fx.USDJPY.text),
  usdjpyNote:
    "Settles 2026-11-06 · Oanda v3 USD_JPY, Thursday 5 Nov 5pm New York. 157.702. Sheet pair 1w −0.01%. Still above 157.00. Short JPY stays. Live mid 157.909 at 04:35 GMT is not a close. BoJ 30 Oct held 1.25%, 8–1, labelled with that date.",
  vix: 28.18,
  ironOre: 93.12,
  ironOreWeekAgo: 93.12,
  ironOreNote: "62% Fe. Yahoo TIO=F Thursday 5 Nov close 93.12. No week-ago row was opened, so this is not a 1w vote.",
  gdtPct: 1.2,
  gdtNote: "GDT Event 413, 6 Oct, stays: Price Index +1.2%, average price $3,928/t. Not a 1w tape.",
  settleOn: "Thu 5 Nov",
  weekAgoOn: "Thu 29 Oct",
};

/** 1w caption. Built from the two weekday labels. Do not type this sentence on a tile. */
export function weekCaption(tape: Pick<RiskTape, "settleOn" | "weekAgoOn"> = RISK_TAPE): string {
  return `${tape.settleOn} settlement versus ${tape.weekAgoOn} close`;
}

assertTape(RISK_TAPE);
