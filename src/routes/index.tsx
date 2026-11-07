import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CurrencyGrid } from "@/components/dashboard/currency-grid";
import { DetailPanel } from "@/components/dashboard/detail-panel";
import { Ranking } from "@/components/dashboard/ranking";
import { PairExpression } from "@/components/dashboard/pair-expression";
import { MarketNow, RiskRegimeTile } from "@/components/dashboard/risk-regime";
import { CsiTile } from "@/components/dashboard/csi-tile";
import { currencies, meta } from "@/lib/data/snapshot";
import { RISK_TAPE } from "@/lib/data/risk-tape";
import {
  INITIAL_BUCKETS,
  applyRs,
  liveRisk,
  rankByRs,
  riskOffFlavor,
  selectTop3,
  selectTop6,
  type BucketKey,
  type RsBuckets,
} from "@/lib/data/rs-engine";
import { listWatchlist, toggleWatch } from "@/lib/watchlist";
import { useCurrentUserState } from "@/lib/auth/use-current-user";


export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { user, isPending } = useCurrentUserState();
  const [selected, setSelected] = useState(currencies[0].id);
  const [watched, setWatched] = useState<string[]>([]);
  const [buckets, setBuckets] = useState<Record<string, RsBuckets>>(INITIAL_BUCKETS);

  const rankedLive = useMemo(
    () => applyRs(currencies, buckets, RISK_TAPE, { withQe: true }),
    [buckets],
  );
  const book = rankedLive;
  const ranked = useMemo(() => rankByRs(rankedLive), [rankedLive]);
  const top3 = useMemo(() => selectTop3(book), [book]);
  const risk = useMemo(() => liveRisk(book), [book]);
  const pairs = useMemo(() => selectTop6(book), [book]);
  const flavor = useMemo(() => {
    const usd1w = book.find((c) => c.id === "usd")?.tape?.vsUsd1w ?? "";
    return riskOffFlavor(risk.kind, RISK_TAPE, usd1w);
  }, [book, risk.kind]);
  const liveById = useMemo(
    () => Object.fromEntries(rankedLive.map((c) => [c.id, c])),
    [rankedLive],
  );
  const active = liveById[selected] ?? rankedLive[0];

  useEffect(() => {
    if (isPending || !user) {
      setWatched([]);
      return;
    }
    listWatchlist()
      .then(setWatched)
      .catch(() => setWatched([]));
  }, [user, isPending]);

  function select(id: string) {
    setSelected(id);
    requestAnimationFrame(() => {
      const ultrawide = window.matchMedia(
        "(min-width: 100rem) and (min-aspect-ratio: 2/1)",
      ).matches;
      if (ultrawide) {
        document.querySelector(".desk-col-detail")?.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      document.getElementById("detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function onBucket(_id: string, _key: BucketKey, _value: number) {
    /* all five buckets are derived from tiles */
  }

  async function onToggleWatch(id: string) {
    if (!user) return;
    try {
      const res = await toggleWatch({ data: id });
      setWatched((prev) =>
        res.watched ? [...new Set([...prev, id])] : prev.filter((x) => x !== id),
      );
    } catch {
      /* unsigned or network */
    }
  }

  return (
    <div className="relative min-h-dvh pb-28 lg:pb-36">
      <main className="desk-measure relative z-10 px-4 pb-6 pt-3">
        <h1 className="sr-only">G10 Desk</h1>
        <div className="desk-layout">
          <div className="desk-col-tape">
            <RiskRegimeTile ranked={book} pairs={pairs} onSelect={select} />
            <MarketNow />
            <PairExpression pairs={pairs} book={book} regime={risk.kind} index={risk.index} flavor={flavor} onSelect={select} />
            <div className="desk-scan">
              <Ranking
                ranked={ranked}
                selected={selected}
                onSelect={select}
                buckets={buckets}
                onBucket={onBucket}
              />
              <CsiTile currencies={ranked} />
            </div>
            <CurrencyGrid
              currencies={rankedLive}
              selected={selected}
              onSelect={select}
              watched={watched}
              onToggleWatch={onToggleWatch}
              canWatch={Boolean(user)}
            />
          </div>
          <div className="desk-col-detail">
            <DetailPanel c={active} onClose={() => setSelected(rankedLive[0].id)} />
          </div>
        </div>
      </main>

      <footer className="desk-foot fixed inset-x-0 bottom-0 z-30 overflow-visible border-t border-border bg-glass">
        <div className="desk-measure px-4 py-2 lg:py-3">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex min-w-0 items-center gap-3">
              <div className="min-w-0">
                <p className="font-sans text-title font-semibold leading-none tracking-tight text-fg">
                  G10 <span className="text-warn">Desk</span>
                </p>
                <p className="mt-1 font-sans text-stamp tracking-wide text-muted tabular-nums">
                  Updated {meta.asOf}
                </p>
              </div>
              <Link
                to="/trades"
                className="inline-flex min-h-11 items-center rounded-md border border-border bg-card px-3 font-sans text-stamp font-medium text-muted transition-[transform,border-color,color] hover:border-primary hover:text-fg"
              >
                Trades taken
              </Link>
              <Link
                to="/indices"
                search={{ view: "tape" }}
                className="inline-flex min-h-11 items-center rounded-md border border-border bg-card px-3 font-sans text-stamp font-medium text-muted transition-[transform,border-color,color] hover:border-primary hover:text-fg"
              >
                Indices
              </Link>
            </div>
            <nav aria-label="Currencies" className="hidden lg:flex flex-wrap gap-2">
              {rankedLive.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => select(c.id)}
                  className="relative inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border bg-card px-3 font-sans text-stamp font-medium text-muted tabular-nums transition-[transform,border-color,color] hover:z-10 hover:border-primary hover:text-fg"
                >
                  <span aria-hidden>{c.flag}</span>
                  {c.code}
                </button>
              ))}
            </nav>
          </div>
          <p className="sr-only">
            Relative Strength Scores combine policy stance, carry, inflation/labour,
            bond/curve and risk-sentiment. Tape DELAYED. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
