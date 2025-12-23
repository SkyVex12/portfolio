"use client";

import Navbar from "@/components/navbar";
import Hero from "@/components/sections/hero";
import AiChat from "@/components/sections/ai-chat";
import ResumeBuilderLazy from "@/components/sections/resume-builder.lazy";
import Services from "@/components/sections/services";
import Projects from "@/components/sections/projects";
import Experience from "@/components/sections/experience";
import Certifications from "@/components/sections/certifications";
import Proof from "@/components/sections/proof";
import Contact from "@/components/sections/contact";
import { SITE_CONFIG, enabledMap, navLinksFromConfig, SiteConfig } from "@/lib/site-config";
import { useEffect, useMemo, useState } from "react";
import Link from "next/dist/client/link";

const STORAGE_KEY = "portfolio.siteConfig.v1";

export default function PreviewPage() {
  const [config, setConfig] = useState<SiteConfig>(SITE_CONFIG);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.sections) setConfig(parsed);
      } catch {}
    }
  }, []);

  const enabled = useMemo(() => enabledMap(config), [config]);
  const links = useMemo(() => navLinksFromConfig(config), [config]);

  return (
    <main className="min-h-screen">
      <Navbar links={links} />

      {enabled.home && <Hero />}
      {enabled.aiChat && <AiChat />}
      {enabled.resumeBuilder && <ResumeBuilderLazy />}
      {enabled.services && <Services />}
      {enabled.projects && <Projects />}
      {enabled.experience && <Experience />}
      {enabled.certifications && <Certifications />}
      {enabled.proof && <Proof />}
      {enabled.contact && <Contact />}

      <footer className="mx-auto max-w-6xl px-4 pb-12 text-center text-xs text-white/60">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link className="underline underline-offset-4 hover:opacity-90" href="/admin">
            Back to Admin
          </Link>
          <Link className="underline underline-offset-4 hover:opacity-90" href="/">
            Back to Home
          </Link>
        </div>
      </footer>
    </main>
  );
}
