"use client";

import Section from "@/components/ui/section";
import Badge from "@/components/ui/badge";
import { PROFILE } from "@/lib/data";
import { Mail, Github, Linkedin, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const mailto = () => {
    const subject = encodeURIComponent("AI automation project inquiry");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${msg}\n\n— Sent from portfolio site`
    );
    return `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  };

  return (
    <Section
      id="contact"
      eyebrow="Let’s build"
      title="Contact"
      desc="Tell me the workflow you want to automate. I’ll reply with a pilot plan + timeline."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-black/10 bg-white/70 p-6 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">Send a message</div>
            <Badge>Founder-friendly</Badge>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="ringy rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/5"
              placeholder="Your name"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ringy rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/5"
              placeholder="Email"
            />
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="ringy md:col-span-2 h-36 resize-none rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/5"
              placeholder="What are you trying to automate? What tools do you use today? Any sample docs/emails?"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={mailto()}
              className="ringy inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white shadow-soft hover:opacity-90 dark:bg-white dark:text-black"
            >
              <Send size={16} />
              Email Goran
            </a>
            <a
              href={`mailto:${PROFILE.email}`}
              className="ringy inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white/50 px-5 py-3 text-sm font-medium shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <Mail size={16} />
              {PROFILE.email}
            </a>
          </div>

          <div className="mt-3 text-xs opacity-70">
            This form uses <code className="px-1">mailto:</code> (simple + reliable). For a server form, add Resend/SendGrid later.
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="text-sm font-semibold">Connect</div>
          <div className="mt-3 space-y-3 text-sm">
            <a className="ringy flex items-center justify-between rounded-2xl border border-black/10 bg-white/50 px-4 py-3 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
               href={PROFILE.socials.github} target="_blank" rel="noreferrer">
              <span className="inline-flex items-center gap-2"><Github size={16}/> GitHub</span>
              <span className="opacity-60">↗</span>
            </a>
            <a className="ringy flex items-center justify-between rounded-2xl border border-black/10 bg-white/50 px-4 py-3 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
               href={PROFILE.socials.linkedin} target="_blank" rel="noreferrer">
              <span className="inline-flex items-center gap-2"><Linkedin size={16}/> LinkedIn</span>
              <span className="opacity-60">↗</span>
            </a>
            <a className="ringy flex items-center justify-between rounded-2xl border border-black/10 bg-white/50 px-4 py-3 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
               href={PROFILE.socials.telegram} target="_blank" rel="noreferrer">
              <span className="inline-flex items-center gap-2"><Send size={16}/> Telegram</span>
              <span className="opacity-60">↗</span>
            </a>
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold">Availability</div>
            <p className="mt-2 text-sm opacity-80">{PROFILE.availability}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{PROFILE.location}</Badge>
              <Badge>Short-term pilots</Badge>
              <Badge>Q1 scale-ups</Badge>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
