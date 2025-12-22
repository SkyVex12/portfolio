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

export default function Page() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <AiChat />
      <ResumeBuilderLazy />
      <Services />
      <Projects />
      <Experience />
      <Certifications />
      <Proof />
      <Contact />

      <footer className="mx-auto max-w-6xl px-4 pb-12 text-center text-xs opacity-70">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <span suppressHydrationWarning>© {new Date().getFullYear()} Goran.</span>
          <a className="underline underline-offset-4 hover:opacity-90" href="/about">
            About
          </a>
          <a className="underline underline-offset-4 hover:opacity-90" href="/privacy">
            Privacy
          </a>
          <a className="underline underline-offset-4 hover:opacity-90" href="/terms">
            Terms
          </a>
        </div>
        <div className="mt-2">
          Personal portfolio showcasing example projects. No guarantees or business outcomes implied.
        </div>
      </footer>
    </main>
  );
}
