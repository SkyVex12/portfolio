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
import { SITE_CONFIG, enabledMap, navLinksFromConfig } from "@/lib/site-config";
import FluidBackground from "@/components/visuals/fluid-background";
import Link from "next/link";

export default function Page() {
  const enabled = enabledMap(SITE_CONFIG);
  const links = navLinksFromConfig(SITE_CONFIG);

  return (
    <main className="relative min-h-screen">
      {/* background layer */}
      <FluidBackground />

      {/* content layer */}
      <div className="relative z-10">
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
            <Link className="underline underline-offset-4 hover:opacity-90" href="/about">
              About
            </Link>
            <Link className="underline underline-offset-4 hover:opacity-90" href="/privacy">
              Privacy
            </Link>
            <Link className="underline underline-offset-4 hover:opacity-90" href="/terms">
              Terms
            </Link>
            <Link className="underline underline-offset-4 hover:opacity-90" href="/admin">
              Admin
            </Link>
            <Link className="underline underline-offset-4 hover:opacity-90" href="/preview">
              Preview
            </Link>
          </div>
          <div className="mt-2">
            Personal portfolio showcasing example projects. No guarantees or business outcomes implied.
          </div>
        </footer>
      </div>
    </main>
  );
}
