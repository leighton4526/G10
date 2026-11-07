import { CPI_EARLY, type EarlyInput } from "@/lib/data/cpi-early";

const TONE: Record<EarlyInput["tone"], string> = {
  hot: "text-hawk",
  cool: "text-dove",
  line: "text-fg",
  mixed: "text-fg",
  wait: "text-warn",
};

export function CpiEarly({ id }: { id: string }) {
  const row = CPI_EARLY.find((g) => g.id === id);
  if (!row) return null;

  return (
    <div className="mt-4 rounded-md border border-warn/40 bg-surface p-4">
      <p className="font-mono text-[11px] uppercase tracking-wide text-warn">
        Prototype · not a print
      </p>
      <h3 className="mt-1 text-sm font-semibold text-fg">
        What the early print says about the next CPI
      </h3>
      <p className="mt-2 text-sm text-muted">
        <span className="text-fg">{row.last}.</span> {row.next}
      </p>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-fg">
          Already out for that window, or still waiting
        </p>
        <div className="grid grid-cols-2 gap-2">
          {row.inputs.map((m) => (
            <div key={m.name} className="rounded-md bg-elevated/70 p-2">
              <div className="font-mono text-[11px] text-muted">{m.name}</div>
              <div className={`font-mono text-sm tabular-nums ${TONE[m.tone]}`}>{m.value}</div>
              <div className="mt-1 text-[11px] leading-snug text-muted">{m.when}</div>
              <div className="mt-1 text-[11px] leading-snug text-muted">{m.source}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm text-muted">{row.imply}</p>
      <p className="mt-2 text-sm font-medium text-fg">{row.read}</p>
    </div>
  );
}
