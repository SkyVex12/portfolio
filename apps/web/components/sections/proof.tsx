import Section from "@/components/ui/section";
import { PROFILE } from "@/lib/data";
import { Github, Mail, MapPin, ShieldCheck } from "lucide-react";

export default function Proof() {
  return (
    <Section
      id="proof"
      eyebrow="Trust"
      title="Proof & basics"
      desc={
        <>
          Clear identity, clear contact, and transparent project scope. This is a personal portfolio site — no hidden redirects,
          no data selling, and no “guaranteed results” claims.
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck size={18} className="opacity-80" />
            Transparency
          </div>
          <ul className="mt-3 space-y-2 text-sm opacity-85">
            <li>• Example projects are labeled as demo/personal builds.</li>
            <li>• No outcome guarantees are implied.</li>
            <li>• Privacy and terms are linked in the footer.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Mail size={18} className="opacity-80" />
            Contact
          </div>
          <div className="mt-3 space-y-2 text-sm opacity-85">
            <a className="flex items-center gap-2 underline underline-offset-4 hover:opacity-90" href={`mailto:${PROFILE.email}`}>
              <Mail size={16} className="opacity-75" />
              {PROFILE.email}
            </a>
            <a className="flex items-center gap-2 underline underline-offset-4 hover:opacity-90" href={PROFILE.socials.github} target="_blank" rel="noreferrer">
              <Github size={16} className="opacity-75" />
              GitHub: {PROFILE.socials.github.replace("https://", "")}
            </a>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="opacity-75" />
              {PROFILE.location}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
