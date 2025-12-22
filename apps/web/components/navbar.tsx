"use client";

import ThemeToggle from "@/components/theme-toggle";
import { PROFILE } from "@/lib/data";
import { motion } from "framer-motion";

const links = [
  { label: "Home", href: "#home" },
  { label: "AI Chat", href: "#ai-chat" },
  { label: "Resume Builder", href: "#resume-builder" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-4 flex items-center justify-between rounded-3xl border border-black/10 bg-white/70 px-4 py-3 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5"
        >
          <a href="#home" className="font-semibold tracking-tight">
            {PROFILE.name}
            <span className="ml-2 text-xs opacity-60">AI Automation</span>
          </a>

          <nav className="hidden items-center gap-5 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm opacity-80 hover:opacity-100"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={PROFILE.ctaPrimary.href}
              className="ringy hidden rounded-full bg-black px-4 py-2 text-sm text-white hover:opacity-90 dark:bg-white dark:text-black sm:inline"
            >
              {PROFILE.ctaPrimary.label}
            </a>
            <ThemeToggle />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
