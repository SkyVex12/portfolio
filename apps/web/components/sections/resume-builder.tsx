  "use client";

  import Section from "@/components/ui/section";
  import Badge from "@/components/ui/badge";
  import { useMemo, useState } from "react";
  import { ArrowRight, FileText, Lock, Sparkles } from "lucide-react";

  type TrialResult = {
    ok: boolean;
    message: string;
    resume_text?: string;
    resume_json?: any;
    used_trial?: boolean;
  };

  export default function ResumeBuilder() {
    const [jd, setJd] = useState("");
    const [tone, setTone] = useState("Senior, confident, concise");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TrialResult | null>(null);

    const canSubmit = useMemo(() => jd.trim().length > 80, [jd]);

    async function runTrial() {
      if (!canSubmit || loading) return;
      setLoading(true);
      setResult(null);

      try {
        const res = await fetch("/api/resume/trial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_description: jd, tone }),
        });

        const data = (await res.json()) as TrialResult;
        setResult(data);
      } catch {
        setResult({
          ok: false,
          message: "Something went wrong. Check server logs and your OPENAI_API_KEY.",
        });
      } finally {
        setLoading(false);
      }
    }

    async function buyCredits() {
      try {
        const res = await fetch("/api/checkout", { method: "POST" });
        const data = (await res.json()) as { url?: string };
        if (data?.url) window.location.href = data.url;
        else alert("Checkout not configured. Add STRIPE_SECRET_KEY + STRIPE_PRICE_ID.");
      } catch {
        alert("Checkout error.");
      }
    }

    function copyText() {
      if (!result?.resume_text) return;
      navigator.clipboard.writeText(result.resume_text);
    }

    return (
      <Section
        id="resume-builder"
        eyebrow="Product"
        title="ATS Resume Builder (Trial)"
        desc={
          <>
            <p>
              Paste a Job Description and generate 1 ATS-optimized senior resume for free.
            </p>

            <p className="mt-2">
              The output typically scores{" "}
              <a
                href="https://www.jobscan.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
              >
                90%+ on Jobscan-style ATS checks
              </a>.
            </p>

            <p className="mt-2">
              If the result looks valuable, I can also provide a{" "}
              <a
                href="#contact"
                className="underline underline-offset-2 hover:opacity-80"
              >
                local desktop version
              </a>{" "}
              for power users (hotkeys, fast iterations, private usage).
            </p>
          </>
        }
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-black/10 bg-white/70 p-6 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="opacity-80" />
                <span className="text-sm font-semibold">Job Description → Resume</span>
              </div>
              <div className="flex gap-2">
                <Badge>1 free</Badge>
                <Badge className="bg-transparent">
                  <Lock size={12} className="mr-1 inline-block" /> paid for more
                </Badge>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                className="ringy h-56 resize-none rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/5"
                placeholder="Paste the full Job Description here (recommended: 200+ words)…"
              />
              <input
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="ringy rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/5"
                placeholder="Tone / style (optional)"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={runTrial}
                disabled={!canSubmit || loading}
                className="ringy inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white shadow-soft hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
              >
                <FileText size={16} />
                {loading ? "Generating…" : "Generate free resume"}
                <ArrowRight size={16} />
              </button>

              <button
                onClick={buyCredits}
                className="ringy inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white/50 px-5 py-3 text-sm font-medium shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <Lock size={16} />
                Unlock more resumes
              </button>

              {result?.resume_text && (
                <button
                  onClick={copyText}
                  className="ringy inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white/50 px-5 py-3 text-sm font-medium shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  Copy result
                </button>
              )}
            </div>

            {result && (
              <div className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm dark:border-white/10 dark:bg-white/[0.03]">
                <div className="font-semibold">{result.ok ? "Done" : "Notice"}</div>
                <div className="mt-1 opacity-80">{result.message}</div>

                {result.resume_text && (
                  <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-black/10 bg-white/70 p-4 text-xs leading-relaxed dark:border-white/10 dark:bg-white/5">
{""}{result.resume_text}
                  </pre>
                )}

                {result.resume_json && (
                  <details className="mt-3 rounded-2xl border border-black/10 bg-white/70 p-4 text-xs dark:border-white/10 dark:bg-white/5">
                    <summary className="cursor-pointer font-semibold">Show structured JSON (engine output)</summary>
                    <pre className="mt-3 whitespace-pre-wrap">{JSON.stringify(result.resume_json, null, 2)}</pre>
                  </details>
                )}
              </div>
            )}

            <div className="mt-3 text-xs opacity-70">
              Trial enforcement uses a simple cookie flag. For stronger paywall/credits, enable Stripe webhook + database.
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-semibold">What it does</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm opacity-80">
              <li>Generates ATS-friendly senior resume content from the JD</li>
              <li>Maintains person-specific differentiation across variants</li>
              <li>Outputs clean text + structured JSON</li>
              <li>Designed to reach high ATS scores (Jobscan-style)</li>
            </ul>

            <div className="mt-6 text-sm font-semibold">Paid unlock (suggested)</div>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm opacity-80">
              <li>3–10 resume variants per JD</li>
              <li>DOCX/PDF export</li>
              <li>Strict JSON + schema validation</li>
              <li>Keyword targeting + checks</li>
            </ul>
          </div>
        </div>
      </Section>
    );
  }
