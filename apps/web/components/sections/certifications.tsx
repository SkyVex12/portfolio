import Image from "next/image";
import Section from "@/components/ui/section";
import { ExternalLink } from "lucide-react";

const CERTS = [
  {
    title: "Coursera Specialization Certificate",
    issuer: "Coursera",
    href: "https://www.coursera.org/account/accomplishments/specialization/58NLC3RYQRJL?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=pdf_header_button&utm_product=s12n",
    imageSrc: "/certs/coursera-certificate.webp",
    imageAlt: "Coursera specialization certificate preview",
  },
  {
    title: "AWS Academy Graduate – Cloud Operations",
    issuer: "Credly",
    href: "https://www.credly.com/badges/35aab831-d0ed-4a3a-b6ed-d5594146d804/linked_in_profile",
    imageSrc: "/certs/credly-cloud-ops.png",
    imageAlt: "Credly badge: Cloud Operations on AWS course",
  },
] as const;

export default function Certifications() {
  return (
    <Section
      id="certifications"
      eyebrow="Trust"
      title="Certifications & Badges"
      desc="Quick verification links to my recent learning and credentials."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {CERTS.map((c) => (
          <a
            key={c.href}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group ringy rounded-3xl border border-black/10 bg-white/70 p-5 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">{c.title}</div>
                <div className="mt-1 text-xs opacity-70">Issued by {c.issuer}</div>
              </div>
              <ExternalLink size={16} className="mt-1 opacity-70 group-hover:opacity-100" />
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-white/60 dark:border-white/10 dark:bg-white/5">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={c.imageSrc}
                  alt={c.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={false}
                />
              </div>
            </div>

            <div className="mt-3 text-xs opacity-70">
              Click to verify →
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}
