import Section from "@/components/ui/section";
import Badge from "@/components/ui/badge";
import { SERVICES } from "@/lib/data";

export default function Services() {
  return (
    <Section
      id="services"
      eyebrow="Offer"
      title="What I do"
      desc="Practical automation that saves time, reduces mistakes, and makes teams faster — without brittle glue code."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {SERVICES.map((s) => (
          <div
            key={s.title}
            className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold tracking-tight">{s.title}</div>
                <p className="mt-2 text-sm opacity-80">{s.desc}</p>
              </div>
              <Badge>1–3 weeks</Badge>
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm opacity-80">
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
