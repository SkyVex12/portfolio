export type SectionKey =
  | "home"
  | "aiChat"
  | "resumeBuilder"
  | "services"
  | "projects"
  | "experience"
  | "certifications"
  | "proof"
  | "contact";

export type SectionDef = {
  key: SectionKey;
  label: string;
  href: string; // anchor link
  enabled: boolean;
};

export type SiteConfig = {
  sections: SectionDef[];
};

export const SITE_CONFIG: SiteConfig = {
  // ✅ Single source of truth for what shows on the homepage
  // To publish changes from /admin:
  // 1) Open /admin
  // 2) Copy the JSON
  // 3) Replace this SITE_CONFIG with the generated one
  // 4) Commit + redeploy
  sections: [
    { key: "home", label: "Home", href: "#home", enabled: true },
    { key: "aiChat", label: "AI Chat", href: "#ai-chat", enabled: true },
    { key: "resumeBuilder", label: "Resume Builder", href: "#resume-builder", enabled: true },
    { key: "services", label: "Services", href: "#services", enabled: true },
    { key: "projects", label: "Projects", href: "#projects", enabled: true },
    { key: "experience", label: "Experience", href: "#experience", enabled: true },
    // { key: "certifications", label: "Certifications", href: "#certifications", enabled: true },
    { key: "proof", label: "Proof", href: "#proof", enabled: true },
    // { key: "contact", label: "Contact", href: "#contact", enabled: true },
  ],
};

export function navLinksFromConfig(config: SiteConfig) {
  return config.sections
    .filter((s) => s.enabled)
    .map((s) => ({ label: s.label, href: s.href }));
}

export function enabledMap(config: SiteConfig): Record<SectionKey, boolean> {
  return config.sections.reduce((acc, s) => {
    acc[s.key] = !!s.enabled;
    return acc;
  }, {} as Record<SectionKey, boolean>);
}
