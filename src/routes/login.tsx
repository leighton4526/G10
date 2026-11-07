import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg p-6">
      <div className="w-full max-w-sm rounded-shell border border-border bg-card p-6">
        <p className="mb-1 text-xs tracking-widest text-muted uppercase">
          G10 <span className="text-warn">Desk</span>
        </p>
        <h1 className="mb-2 text-xl font-semibold">Sign in</h1>
        <p className="mb-5 text-sm text-muted">
          Sign in to pin currencies to a personal watchlist. The dashboard itself is public.
        </p>
        {authEnabled ? (
          <div className="space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="w-full rounded-md border border-border bg-card-2 px-4 py-2.5 text-sm font-medium hover:border-primary"
              >
                Continue with {p.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Sign-in is disabled.</p>
        )}
        <Link to="/" className="mt-5 inline-block text-sm text-primary hover:underline">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
