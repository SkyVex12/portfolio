import Link from "next/link";
import { PROFILE } from "@/lib/data";

export const metadata = {
  title: "About | Goran",
  description: "About Goran — AI automation developer portfolio.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/"
          className="text-sm underline underline-offset-4 opacity-80 hover:opacity-100"
        >
          ← Back to home
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">About</h1>
        <p className="mt-4 text-sm leading-relaxed opacity-85">
          Hi, I’m <span className="font-medium">{PROFILE.name}</span>. I build practical AI assistants,
          workflow automations, and integrations that reduce manual work and make operations easier to run.
        </p>
        <p className="mt-4 text-sm leading-relaxed opacity-85">
          This website is a personal portfolio showcasing example projects and technical experiments. It is not
          a corporate site and does not make guarantees about business results.
        </p>

        <div className="mt-8 rounded-2xl border border-black/10 bg-white/50 p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
          <div className="text-sm font-semibold">Contact</div>
          <p className="mt-2 text-sm opacity-85">
            Email: <a className="underline underline-offset-4" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          </p>
          <p className="mt-2 text-sm opacity-85">
            GitHub: <a className="underline underline-offset-4" href={PROFILE.socials.github} target="_blank" rel="noreferrer">{PROFILE.socials.github}</a>
          </p>
        </div>
      </div>
    </main>
  );
}
