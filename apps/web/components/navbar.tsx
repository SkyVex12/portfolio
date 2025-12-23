"use client";

import ThemeToggle from "@/components/theme-toggle";
import { PROFILE } from "@/lib/data";
import { motion } from "framer-motion";
import Link from "next/link";

export type NavLink = { label: string; href: string };

export default function Navbar({ links }: { links: NavLink[] }) {
  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="#home" className="flex items-center gap-2 font-semibold">
          <span className="h-2.5 w-2.5 rounded-full bg-white" aria-hidden="true" />
          <span>{PROFILE.name}</span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm opacity-90 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:opacity-100 opacity-80">
              {l.label}
            </Link>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-3"
        >
          <Link
            href={PROFILE.ctaPrimary.href}
            className="ringy hidden rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:opacity-90 dark:bg-white dark:text-black sm:inline"
          >
            {PROFILE.ctaPrimary.label}
          </Link>
          <ThemeToggle />
        </motion.div>
      </div>
    </div>
  );
}
