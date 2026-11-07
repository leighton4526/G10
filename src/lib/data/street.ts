export type StreetTag = "Tactical downside" | "Tactical upside" | "Mix";

export type StreetNote = {
  house: string;
  date: string;
  tag: StreetTag;
  line: string;
};

/** Only houses that printed something mapping to that name. Skip the rest. */
export const STREET: Partial<Record<string, StreetNote>> = {
  usd: {
    house: "Citadel Securities",
    date: "H1 2026",
    tag: "Mix",
    line: "Dollar softening, not collapsing; Treasury buybacks framed as financial repression that risks a weaker dollar.",
  },
  gbp: {
    house: "Goldman Sachs",
    date: "29 Jul 2026",
    tag: "Tactical downside",
    line: "Still running short GBP/USD from 1.3452, target 1.3250, stop 1.3400.",
  },
  jpy: {
    house: "Goldman Sachs",
    date: "12 Aug 2026",
    tag: "Mix",
    line: "Prefer JPY as a hedge (short USDJPY) after the US–Japan intervention — not as a carry funder.",
  },
  eur: {
    house: "J.P. Morgan",
    date: "2026 outlook",
    tag: "Tactical upside",
    line: "Moderately bullish euro; dollar view net bearish, smaller than 2025.",
  },
};
