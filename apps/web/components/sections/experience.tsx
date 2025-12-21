import Section from "@/components/ui/section";
import Badge from "@/components/ui/badge";
import { EDUCATION, EXPERIENCE } from "@/lib/data";

export default function Experience() {
  return (
    <Section id="experience" eyebrow="Background" title="Experience & education">
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          {EXPERIENCE.map((e) => (
            <div
              key={e.role + e.company}
              className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold tracking-tight">{e.role}</div>
                  <div className="mt-1 text-sm opacity-75">{e.company}</div>
                </div>
                <Badge>{e.dates}</Badge>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm opacity-80">
                {e.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="text-sm font-semibold">Education</div>
          <div className="mt-3 text-lg font-semibold tracking-tight">{EDUCATION.school}</div>
          <div className="mt-1 text-sm opacity-80">{EDUCATION.degree}</div>
          <div className="mt-1 text-sm opacity-70">{EDUCATION.location}</div>

          <div className="mt-8 text-sm font-semibold">How I work</div>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm opacity-80">
            <li>Clear scope, fast execution</li>
            <li>Business outcome metrics (time saved, cost reduced)</li>
            <li>Founder-friendly communication</li>
            <li>Clean interfaces + maintainable code</li>
          </ul>
        </div>
      </div>
    </Section>
  );
}
