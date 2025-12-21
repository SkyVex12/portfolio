"use client";

import { motion } from "framer-motion";
import Badge from "@/components/ui/badge";
import { PROFILE, STACK } from "@/lib/data";

const roles = [
  "AI Automation Engineer",
  "LLM Bot Builder",
  "Document / PDF AI Systems",
  "Workflow Automation (n8n / Zapier)",
];

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-28">
      <div className="mesh" />
      <div className="mx-auto max-w-6xl px-4 pb-14">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Ship real business results</Badge>
              <Badge className="bg-transparent">{PROFILE.product.title}</Badge>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              {PROFILE.headline}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed opacity-85">
              {PROFILE.subhead}
            </p>
            <p className="mt-3 max-w-xl text-sm opacity-80">
              {PROFILE.product.subtitle}
            </p>
            <motion.div
              className="mt-6 flex flex-wrap gap-2"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {roles.map((r) => (
                <motion.span
                  key={r}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <Badge className="bg-transparent">{r}</Badge>
                </motion.span>
              ))}
            </motion.div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={PROFILE.ctaPrimary.href}
                className="ringy rounded-full bg-black px-5 py-3 text-sm font-medium text-white shadow-soft hover:opacity-90 dark:bg-white dark:text-black"
              >
                {PROFILE.ctaPrimary.label}
              </a>
              <a
                href={PROFILE.ctaSecondary.href}
                className="ringy rounded-full border border-black/10 bg-white/50 px-5 py-3 text-sm font-medium shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {PROFILE.ctaSecondary.label}
              </a>
            </div>

            <p className="mt-4 text-xs opacity-70">{PROFILE.availability}</p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Tech stack</div>
              <Badge>Production-first</Badge>
            </div>
            <p className="mt-2 text-sm opacity-75">
              Clean, maintainable code + founder-friendly comms. Start small → scale with confidence.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {STACK.slice(0, 14).map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-black/10 bg-gradient-to-br from-black/5 to-transparent p-4 dark:border-white/10">
              <div className="text-xs font-semibold opacity-70">Typical delivery</div>
              <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-2xl bg-black/5 p-3 dark:bg-white/10">
                  <div className="text-xs opacity-70">Week 1</div>
                  <div className="mt-1 font-medium">Pilot</div>
                </div>
                <div className="rounded-2xl bg-black/5 p-3 dark:bg-white/10">
                  <div className="text-xs opacity-70">Week 2</div>
                  <div className="mt-1 font-medium">Integrate</div>
                </div>
                <div className="rounded-2xl bg-black/5 p-3 dark:bg-white/10">
                  <div className="text-xs opacity-70">Week 3</div>
                  <div className="mt-1 font-medium">Ship</div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs opacity-70">
              Tip: Update your contact email in <code className="px-1">lib/data.ts</code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
