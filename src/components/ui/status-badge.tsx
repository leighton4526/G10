import { cn } from "@/lib/utils";

const tones = {
  hawk: "border-hawk/55 bg-hawk/20 text-hawk",
  dove: "border-dove/30 bg-dove/15 text-dove",
  neutral: "border-warn/30 bg-warn/15 text-warn",
  qt: "border-qt/30 bg-qt/15 text-qt",
  none: "border-border bg-elevated text-muted",
  sky: "border-primary/30 bg-primary/12 text-primary",
  "bias-long": "border-dove/30 bg-dove/15 text-dove",
  "bias-short": "border-hawk/70 bg-hawk/25 text-hawk",
  "bias-neutral": "border-warn/30 bg-warn/15 text-warn",
} as const;

export function StatusBadge({
  tone,
  children,
  className,
}: {
  tone: keyof typeof tones;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
