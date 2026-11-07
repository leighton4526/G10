import { useNavigate, useSearch } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { IndicesDesk } from "@/components/indices/indices-desk";
import { indicesView, type IndicesView } from "@/lib/data/us-indices";

export const Route = createFileRoute("/indices")({
  validateSearch: (search: Record<string, unknown>) => ({
    view: indicesView(search.view),
  }),
  component: IndicesRoute,
});

function IndicesRoute() {
  const { view } = useSearch({ from: "/indices" });
  const navigate = useNavigate();
  function onView(next: IndicesView) {
    void navigate({ to: "/indices", search: { view: next } });
  }
  return <IndicesDesk view={view} onView={onView} />;
}
