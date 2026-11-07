import type { Currency } from "@/lib/data/types";
import { yieldSpreadBoard, type YieldSpreadRow } from "@/lib/data/yield-spread-score";
import { cn } from "@/lib/utils";

function bp(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return "—";
  const v = Math.round(n * 10) / 10;
  const body = Math.abs(v).toFixed(1);
  if (v > 0) return `+${body} bp`;
  if (v < 0) return `−${body} bp`;
  return "0.0 bp";
}

export function YieldSpreadPrototype({
  list,
  id,
  onSelect,
}: {
  list: Currency[];
  id: string;
  onSelect: (id: string) => void;
}) {
  const rows = yieldSpreadBoard(list);
  const row = rows.find((r) => r.id === id);
  if (!row) return null;
  const ordered = [...rows].sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || a.code.localeCompare(b.code));

  return (
    <div className="mb-4 rounded-md border border-warn/40 bg-surface p-4">
      <p className="font-mono text-[11px] uppercase tracking-wide text-warn">Prototype · not in the score</p>
      <h3 className="mt-1 text-sm font-semibold text-fg">Bond yield spread vs USD</h3>
      <p className="mt-2 text-sm text-muted">
        {row.code} 2-year {bp(row.bp2)}, 10-year {bp(row.bp10)}, average {bp(row.avgBp)} versus {row.versus}.
        Card date {row.asOf}. Would-be score {row.score ?? "—"}. The live bond bucket on this name is {row.liveBond},
        and this spread is not inside it.
      </p>
      <div className="mt-3 space-y-1">
        {ordered.map((r) => (
          <SpreadRow key={r.id} row={r} selected={r.id === id} onSelect={onSelect} />
        ))}
      </div>
      <p className="mt-3 text-[0.7rem] leading-relaxed text-muted">
        0 bp is 50. Each 4 bp of average spread moves this score by 1. Plus or minus 200 bp is 100 or 0. A positive
        spread means this yield is above the reference. USD is versus the other seven, not versus itself. This is
        not the 2-year minus 10-year curve, and not the policy-rate carry bucket. It does not feed the ranking, the
        pair book, or the regime index.
      </p>
    </div>
  );
}

function SpreadRow({
  row,
  selected,
  onSelect,
}: {
  row: YieldSpreadRow;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const score = row.score ?? 0;
  const up = (row.avgBp ?? 0) > 0;
  const down = (row.avgBp ?? 0) < 0;
  return (
    <button
      type="button"
      onClick={() => onSelect(row.id)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-1 py-1 text-left",
        selected ? "bg-card-2" : "hover:bg-card-2",
      )}
    >
      <span className="w-10 shrink-0 font-mono text-sm font-semibold tabular-nums">{row.code}</span>
      <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-track">
        <div className="h-full rounded-full bg-warn" style={{ width: `${score}%` }} />
      </div>
      <span className="w-8 text-right font-mono text-sm tabular-nums text-fg">{row.score ?? "—"}</span>
      <span
        className={cn(
          "w-16 shrink-0 text-right font-mono text-[0.7rem] tabular-nums",
          up ? "text-dove" : down ? "text-hawk" : "text-muted",
        )}
      >
        {bp(row.avgBp)}
      </span>
    </button>
  );
}
