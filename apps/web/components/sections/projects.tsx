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
      desc={
        <>
          Personal and demo builds that showcase how I design AI + automation systems. Want a deeper write-up?{" "}
          <a className="underline underline-offset-4 hover:opacity-90" href="#contact">
            Request a quick case study
          </a>
          .
        </>
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <a
            key={p.title}
            href={p.link}
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
            aria-label={`${p.title} — ${p.tag}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold tracking-widest opacity-70">{p.tag}</div>
                <div className="mt-2 text-lg font-semibold leading-snug">{p.title}</div>
              </div>
              <ArrowUpRight className="mt-1 opacity-60 transition group-hover:opacity-100" size={18} />
            </div>

            <p className="mt-3 text-sm opacity-80">{p.desc}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <Badge key={s} className="bg-transparent">
                  {s}
                </Badge>
              ))}
            </div>

            <div className="mt-4 text-xs opacity-70">
              Demo/personal build. Details available on request.
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}
