import Badge from "@/components/ui/badge";
import Link from "next/link";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-24 pb-16">
      <div className="rounded-3xl border border-black/10 bg-white/70 p-8 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
        <Badge>Payment received</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">You’re unlocked 🎉</h1>
        <p className="mt-3 text-sm opacity-80">
          Next step: connect a webhook + a database to grant resume credits automatically.
        </p>

        <div className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm dark:border-white/10 dark:bg-white/[0.03]">
          <div className="font-semibold">Session</div>
          <div className="mt-1 opacity-80">{searchParams.session_id || "(missing)"}</div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/#resume-builder"
            className="ringy rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white shadow-soft hover:opacity-90 dark:bg-white dark:text-black"
          >
            Back to resume builder
          </Link>
          <Link
            href="/"
            className="ringy rounded-2xl border border-black/10 bg-white/50 px-5 py-3 text-sm font-medium shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            Home
          </Link>
        </div>

        <p className="mt-4 text-xs opacity-70">
          For a real paywall: add a Stripe webhook to verify the session and grant credits.
        </p>
      </div>
    </main>
  );
}
