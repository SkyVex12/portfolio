"use client";

import { useEffect, useMemo, useState } from "react";
import { SITE_CONFIG, SiteConfig, SectionDef } from "@/lib/site-config";
import Link from "next/link";

const STORAGE_KEY = "portfolio.siteConfig.v1";

function safeParse(jsonStr: string): SiteConfig | null {
  try {
    const obj = JSON.parse(jsonStr);
    if (!obj || typeof obj !== "object" || !Array.isArray((obj as any).sections)) return null;
    const sections = (obj as any).sections as any[];
    // very light validation
    const cleaned: SectionDef[] = sections
      .filter((s) => s && typeof s === "object")
      .map((s) => ({
        key: String(s.key),
        label: String(s.label),
        href: String(s.href),
        enabled: !!s.enabled,
      })) as any;
    return { sections: cleaned };
  } catch {
    return null;
  }
}

export default function AdminPage() {
  const [config, setConfig] = useState<SiteConfig>(SITE_CONFIG);
  const [importText, setImportText] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  // load local draft if exists
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      const parsed = safeParse(saved);
      if (parsed) setConfig(parsed);
    }
  }, []);

  // save draft on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config, null, 2));
  }, [config]);

  const jsonOut = useMemo(() => JSON.stringify(config, null, 2), [config]);

  const toggle = (key: string) => {
    setConfig((prev) => ({
      sections: prev.sections.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s)),
    }));
  };

  const move = (idx: number, dir: -1 | 1) => {
    setConfig((prev) => {
      const next = [...prev.sections];
      const ni = idx + dir;
      if (ni < 0 || ni >= next.length) return prev;
      const tmp = next[idx];
      next[idx] = next[ni];
      next[ni] = tmp;
      return { sections: next };
    });
  };

  const resetToDefault = () => {
    setConfig(SITE_CONFIG);
    setStatus("Reset to default config (saved locally).");
    setTimeout(() => setStatus(""), 2000);
  };

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonOut);
      setStatus("Copied config JSON to clipboard.");
    } catch {
      setStatus("Copy failed — select the JSON and copy manually.");
    } finally {
      setTimeout(() => setStatus(""), 2500);
    }
  };

  const importJson = () => {
    const parsed = safeParse(importText);
    if (!parsed) {
      setStatus("Invalid JSON. Please paste a valid SiteConfig.");
      setTimeout(() => setStatus(""), 2500);
      return;
    }
    setConfig(parsed);
    setStatus("Imported config (saved locally). Open /preview to verify.");
    setTimeout(() => setStatus(""), 2500);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Site Admin</h1>
      <p className="mt-2 text-sm text-white/70">
        Toggle sections on/off and reorder them. Changes are saved in your browser (local draft).
        <br />
        To publish for everyone: copy the JSON below and replace <code className="px-1">SITE_CONFIG</code> in{" "}
        <code className="px-1">lib/site-config.ts</code>, then redeploy.
      </p>

      {status ? <div className="mt-4 rounded border border-white/10 bg-white/5 px-3 py-2 text-sm">{status}</div> : null}

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-medium">Sections</h2>
        <div className="mt-4 space-y-2">
          {config.sections.map((s, idx) => (
            <div key={s.key} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2">
              <div className="flex items-center gap-3">
                <input
                  aria-label={`Toggle ${s.label}`}
                  type="checkbox"
                  checked={s.enabled}
                  onChange={() => toggle(s.key)}
                  className="h-4 w-4"
                />
                <div>
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className="text-xs text-white/60">{s.href}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  className="rounded-lg border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  className="rounded-lg border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/preview" className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-black hover:opacity-90">
            Open Preview
          </Link>
          <button onClick={copyJson} className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5" type="button">
            Copy JSON
          </button>
          <button onClick={resetToDefault} className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5" type="button">
            Reset
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium">Export JSON</h2>
          <p className="mt-2 text-sm text-white/70">
            Copy this into <code className="px-1">lib/site-config.ts</code> (replace the existing <code className="px-1">SITE_CONFIG</code>).
          </p>
          <textarea
            className="mt-4 h-80 w-full rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs"
            readOnly
            value={jsonOut}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium">Import JSON</h2>
          <p className="mt-2 text-sm text-white/70">
            Paste a config JSON to preview locally. This does not change your deployed site until you publish the config.
          </p>
          <textarea
            className="mt-4 h-64 w-full rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs"
            placeholder='{
  "sections": [ ... ]
}'
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          <button
            onClick={importJson}
            className="mt-3 rounded-lg bg-white px-3 py-2 text-sm font-medium text-black hover:opacity-90"
            type="button"
          >
            Import
          </button>
        </div>
      </section>
    </main>
  );
}
