import { createFileRoute } from "@tanstack/react-router";
import { healthPayload } from "@/lib/data/bot-feeds";

const headers = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "cache-control": "public, max-age=60",
};

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: () => Response.json(healthPayload(), { headers }),
    },
  },
});
