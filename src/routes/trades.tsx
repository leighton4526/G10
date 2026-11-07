import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TradesTakenPage } from "@/components/dashboard/trades-taken";
import { currencies } from "@/lib/data/snapshot";
import { INITIAL_BUCKETS, applyRs } from "@/lib/data/rs-engine";
import { TRADES_TAKEN } from "@/lib/data/trades-taken";
import { evaluateTaken } from "@/lib/data/trades-status";

export const Route = createFileRoute("/trades")({
  component: TradesRoute,
});

function TradesRoute() {
  const live = useMemo(() => applyRs(currencies, INITIAL_BUCKETS), []);
  const views = useMemo(() => TRADES_TAKEN.map((t) => evaluateTaken(t, live)), [live]);
  return <TradesTakenPage views={views} />;
}
