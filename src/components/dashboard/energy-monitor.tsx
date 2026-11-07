import { Flame, Briefcase, Landmark } from "lucide-react";
import { meta } from "@/lib/data/snapshot";

const tiles = [
  { icon: Flame, title: "Fuel & Energy Conflict", body: meta.energy },
  { icon: Briefcase, title: "Labour pulse", body: meta.labourPulse },
  { icon: Landmark, title: "Rates pulse", body: meta.ratesPulse },
];

export function EnergyMonitor() {
  return (
    <section className="mb-8 grid gap-3 md:grid-cols-3">
      {tiles.map(({ icon: Icon, title, body }) => (
        <article
          key={title}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Icon className="size-4" strokeWidth={2} />
            <h2 className="text-xs font-semibold tracking-wider uppercase text-muted">
              {title}
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-fg">{body}</p>
        </article>
      ))}
    </section>
  );
}
