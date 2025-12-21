import Navbar from "@/components/navbar";
import Hero from "@/components/sections/hero";
import AiChat from "@/components/sections/ai-chat";
import Services from "@/components/sections/services";
import ResumeBuilder from "@/components/sections/resume-builder";
import Projects from "@/components/sections/projects";
import Experience from "@/components/sections/experience";
import Contact from "@/components/sections/contact";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <AiChat />
        <ResumeBuilder />
      <Services />
      <Projects />
      <Experience />
      <Contact />
      <footer className="mx-auto max-w-6xl px-4 pb-12 text-center text-xs opacity-70">
        © {new Date().getFullYear()} Goran. Built with Next.js.
      </footer>
    </main>
  );
}
