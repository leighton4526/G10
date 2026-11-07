import { createFileRoute } from "@tanstack/react-router";
import { regimeFeed } from "@/lib/data/regime-feed";

/**
 * GET /api/regime — risk-on / risk-off feed for other desks and bots.
 * Currency strength IS in this payload as `rs`. It is the desk’s one
 * shared score (five pillars × 0.9 plus the QE/QT modifier, capped at 10).
 * Ranking, the pair cards and this feed all use that score. There is no
 * second strength formula. Bots should read `rs` and not rebuild it.
 */
const headers = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "cache-control": "public, max-age=60",
};

export const Route = createFileRoute("/api/regime")({
  server: {
    handlers: {
      GET: () => Response.json(regimeFeed(), { headers }),
      OPTIONS: () => new Response(null, { status: 204, headers }),
    },
  },
});
