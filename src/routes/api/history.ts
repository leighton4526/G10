import { createFileRoute } from "@tanstack/react-router";
import { archiveText, archiveTree } from "@/lib/desk-log/archive";
import { DESK_CATALOG, DESK_LOG_NOTE, deskBuild } from "@/lib/desk-log";

const headers = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "cache-control": "public, max-age=60",
};

function known(id: string): boolean {
  return DESK_CATALOG.some((row) => row.id === id);
}

export const Route = createFileRoute("/api/history")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("build");
        const file = url.searchParams.get("file");
        if (id && !known(id)) {
          return Response.json({ persisted: true, error: "no such build", id }, { status: 404, headers });
        }
        if (id && file) {
          const body = archiveText(id, file);
          if (!body) {
            return Response.json({ persisted: true, error: "no such file", id, file }, { status: 404, headers });
          }
          return Response.json({ persisted: true, id, file, ...body }, { headers });
        }
        if (id && url.searchParams.get("tree") === "1") {
          const files = archiveTree(id);
          if (!files) {
            return Response.json({ persisted: true, error: "copy missing", id }, { status: 404, headers });
          }
          const counts = { logic: 0, data: 0, settles: 0, skill: 0, template: 0, reading: 0, other: 0 };
          for (const row of files) counts[row.kind] += 1;
          return Response.json(
            {
              persisted: true,
              id,
              copy: `archive/builds/${id}`,
              sealed: id === "2026-11-07",
              note:
                id === "2026-11-07"
                  ? "Data and settles only. The skill and the template were not filed inside this copy. Do not rewrite it."
                  : "Stored copy. Skill, template, data, and the scoring files. Not written back onto the live desk.",
              counts,
              files,
            },
            { headers },
          );
        }
        if (id) {
          const build = deskBuild(id);
          if (!build) {
            return Response.json({ persisted: true, error: "no such build", id }, { status: 404, headers });
          }
          return Response.json({ persisted: true, build }, { headers });
        }
        const newest = DESK_CATALOG[DESK_CATALOG.length - 1];
        return Response.json(
          {
            asOfUtc: newest?.storedAt ?? null,
            persisted: true,
            store: "archive/builds",
            note: DESK_LOG_NOTE,
            builds: DESK_CATALOG,
            days: [
              {
                date: "2026-11-06",
                index: 21,
                flavour: "oil-war",
                copied: false,
                note: "Note only. No file copy. Days before 6 Nov were not opened.",
              },
              ...DESK_CATALOG.map((b) => ({
                date: b.id,
                index: b.index,
                flavour: b.flavour,
                copied: true,
                cut: b.cut,
              })),
            ],
          },
          { headers },
        );
      },
    },
  },
});
