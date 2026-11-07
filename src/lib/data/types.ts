export type StanceClass = "hawk" | "dove" | "neutral";
export type BiasClass = "bias-long" | "bias-short" | "bias-neutral";
export type BsClass = "qt" | "none";
export type TrendPill = "Uptrend" | "Downtrend" | "Ranging";
export type RegimePill = "Bullish" | "Bearish" | "Neutral";

export type Crowding =
  | "Extreme short"
  | "Crowded short"
  | "Neutral"
  | "Crowded long"
  | "Extreme long";

export type Driver = {
  title: string;
  impact: string;
  text: string;
  /** Live print on the mini-tile. Snapshot wins over driver-meta on a light scrape. */
  latest?: string;
  /** Locked tag. Snapshot wins over driver-meta so a new print rewrites the tile. */
  tag?: string;
};

export type WeekEvent = {
  day: string;
  time: string;
  event: string;
  note: string;
};

export type CotWeek = {
  date: string;
  long: number;
  dLong: number | null;
  short: number;
  dShort: number | null;
  net: number;
  dNet: number | null;
};

export type CotBucket = {
  long: number;
  short: number;
  net: number;
  dLong: number;
  dShort: number;
  dNet: number;
  pctLong: number;
  pctShort: number;
};

export type Currency = {
  id: string;
  code: string;
  pair: string;
  flag: string;
  bank: string;
  rate: string;
  rateLabel: string;
  stance: string;
  stanceClass: StanceClass;
  bs: string;
  bsClass: BsClass;
  score: number;
  bias: string;
  biasClass: BiasClass;
  cpi: string;
  core: string;
  labour: string;
  labourTone: string;
  weekAhead: WeekEvent[];
  headlines: {
    major: { title: string; summary: string };
    major2?: { title: string; summary: string };
    conspiracy: { title: string; summary: string };
  };
  policy: { notes: string; recent: string };
  inflation: { headline: string; summary: string; drivers: Driver[] };
  labourDetail: {
    headline: string;
    summary: string;
    score: string;
    drivers: Driver[];
  };
  policyVote: {
    vote: string;
    voteClass: StanceClass;
    summary: string;
    reasoning: string;
    risks: { direction: string; text: string }[];
  };
  bonds: {
    y2: string;
    y10: string;
    spread2s10s: string;
    real: string;
    breakeven: string;
    change1w: string;
    bias: string;
    biasClass: StanceClass;
    catalyst: string;
    risks: { direction: string; text: string }[];
  };
  cot: {
    contract: string;
    asOf: string;
    vs: string;
    note: string;
    long: number;
    short: number;
    net: number;
    oi: number;
    dLong: number;
    dShort: number;
    dNet: number;
    dOi: number;
    history: CotWeek[];
    clock: CotWeek[];
    interpretation: string;
  };
  tape: {
    spot: string;
    chg1w: string;
    chg1m: string;
    vsUsd1w: string;
    vsUsd1m: string;
    trend: TrendPill;
    keyLevel: string;
    /** Settles file label. Absent only before the file is applied. */
    spotLabel?: string;
  };
  market: {
    meeting: string;
    hike: number | null;
    hold: number | null;
    cut: number | null;
    implied: string;
    gap: string;
    gapClass: StanceClass;
  };
  invalidation: string;
  riskBeta: string;
  fiscal: string;
  needle: string;
  cotCrowding: Crowding;
  cotThree: {
    commercial: CotBucket;
    nonReportable: CotBucket;
    smallSpecCrowding: Crowding;
    setup: string;
  };
};
