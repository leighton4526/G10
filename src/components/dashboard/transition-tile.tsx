import { useState } from "react";
import { HANDS, transitionRead } from "@/lib/data/transition";
import type { RiskTape } from "@/lib/data/risk-tape";
import type { RiskRegimeKind } from "@/lib/data/rs-engine";

export function TransitionTile({
  kind,
  tape,
  usd1w,
}: {
  kind: RiskRegimeKind;
  tape: RiskTape;
  usd1w: string;
}) {
  const read = transitionRead(kind, tape, usd1w);
  const [open, setOpen] = useState(false);
  const [all, setAll] = useState(false);

  return (
    <div className="mt-3 rounded-md border border-hawk/30 bg-card-2" data-section="Transition">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
      >
        <span className="min-w-0">
          <span className="text-[0.65rem] font-semibold tracking-wider text-warn uppercase">Transition</span>
          <span className="mt-0.5 block text-xs text-muted">{read.headline}</span>
        </span>
        <span className="shrink-0 text-[0.65rem] font-medium text-muted">{open ? "Minimize" : "Open"}</span>
      </button>
      {open ? (
        <div className="space-y-2 px-3 pb-3 text-sm leading-relaxed text-muted">
          <p>
            <span className="font-semibold text-fg">Watch.</span> {read.watch}
          </p>
          <p>
            <span className="font-semibold text-fg">Cover.</span> {read.cover}
          </p>
          <p>
            <span className="font-semibold text-fg">Receiver.</span> {read.receiver}{" "}
            <span className="font-semibold text-fg">False hand.</span> {read.falseHand}
          </p>
          <div className="border-t border-hawk/30 pt-2">
            <button
              type="button"
              onClick={() => setAll((v) => !v)}
              aria-expanded={all}
              className="text-[0.65rem] font-semibold tracking-wider text-warn uppercase"
            >
              Every hand {all ? "· minimize" : "· open"}
            </button>
            {all ? (
              <ul className="mt-2 space-y-1">
                {HANDS.map((h) => (
                  <li key={h.id} className="text-xs leading-relaxed text-muted">
                    <span className="font-semibold text-fg">{h.name}.</span> {h.cover} Hands to {h.receiver}{" "}
                    False: {h.falseHand}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
