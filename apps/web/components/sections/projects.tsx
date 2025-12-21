import Section from "@/components/ui/section";
import Badge from "@/components/ui/badge";
import { PROJECTS } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Work"
      title="Project snapshots"
      desc="These are representative builds. If you have a similar workflow, we can ship a pilot quickly."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <a
            key={p.title}
            href={p.link}
            className="group rounded-3xl border border-black/10 bg-white/70 p-6 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:shadow-soft dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold tracking-tight">{p.title}</div>
                <div className="mt-2">
                  <Badge>{p.tag}</Badge>
                </div>
              </div>
              <ArrowUpRight className="opacity-60 transition group-hover:opacity-100" size={18} />
            </div>
            <p className="mt-3 text-sm opacity-80">{p.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <Badge key={s} className="bg-transparent">{s}</Badge>
              ))}
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}
