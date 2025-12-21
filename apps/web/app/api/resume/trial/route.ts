import OpenAI from "openai";
import { cookies } from "next/headers";

export const runtime = "nodejs";

type TrialReq = { job_description?: string; tone?: string };

// Optional: If you run your Python resume-builder service, set this env and the route will proxy to it.
const PY_BACKEND = process.env.RESUME_BUILDER_BACKEND_URL; // e.g. http://localhost:8000

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function systemPrompt() {
  return `
You are an ATS resume writer. Create ONE senior-level resume variant optimized for ATS parsing.
Output MUST be plain text (not JSON, not markdown). Keep it professional, modern, concise, and metric-driven.

Candidate: Goran
Summary: AI Automation Engineer. Builds practical AI bots and workflow automation that reduce manual work; ships pilots in 1–3 weeks.
Experience:
- AI Automation Engineer (B2B SaaS workflow platform, Jun 2024–Sep 2025): internal LLM doc assistants, ticket summarization, knowledge search.
- AI Automation Engineer (Ops SaaS logistics/scheduling, Feb 2023–May 2024): extraction/reporting, automated ops decisions, LLM integrated into backend.
- Bot Developer (Contract, Jul 2021–May 2023): Telegram/Slack bots, PDF assistants, workflow automation, maintainable code.
Education: Master of Computer Engineering, Belgrade University.
Tech: Python, PHP, Django, Flask, Laravel, React, Scrapy, PDF, REST APIs, OpenAI, prompt engineering, LLM integration, Zapier, n8n, NLP, TensorFlow/Keras/PyTorch.

Requirements:
- Match the Job Description keywords naturally (no keyword stuffing).
- Use strong action verbs; quantify impact where plausible without lying.
- Include: Headline, Summary, Core Skills, Experience (3 roles), Education, Selected Projects (2–3 bullets).
- If JD needs a skill not present, add it as "Exposure to" or "Familiar with" (never claim deep expertise).
`.trim();
}

export async function POST(req: Request) {
  const jar = cookies();

  const used = jar.get("trial_resume_used")?.value === "1";
  if (used) {
    return Response.json({
      ok: false,
      used_trial: true,
      message: "Free trial already used on this browser. Click “Unlock more resumes” to generate additional variants.",
    });
  }

  const body = (await req.json().catch(() => null)) as TrialReq | null;
  const jd = (body?.job_description || "").trim();
  const tone = (body?.tone || "").trim();

  if (jd.length < 80) {
    return Response.json(
      { ok: false, message: "Please paste a fuller Job Description (at least ~80 characters)." },
      { status: 400 }
    );
  }

  // If python backend exists, proxy there first
  if (PY_BACKEND) {
    const url = `${PY_BACKEND.replace(/\/$/, "")}/trial`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_description: jd, tone }),
    });

    if (!r.ok) {
      const t = await r.text();
      return Response.json({ ok: false, message: `Python backend error: ${t}` }, { status: 502 });
    }

    const data = await r.json();

    jar.set("trial_resume_used", "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return Response.json({
      ok: true,
      used_trial: true,
      message: "Generated 1 free resume (Python engine). For more variants + exports, use the paid unlock.",
      resume_text: data?.resume_text || "",
      resume_json: data?.resume_json || null,
    });
  }

  // Fallback: generate directly via OpenAI in Next.js
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ ok: false, message: "Missing OPENAI_API_KEY on server." }, { status: 500 });
  }

  const input = `
Job Description:
${jd}

Tone:
${tone || "Senior, confident, concise"}
`.trim();

  const resp = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: [
      { role: "system", content: systemPrompt() },
      { role: "user", content: input },
    ],
  });

  const resumeText = resp.output_text?.trim() || "";

  jar.set("trial_resume_used", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  return Response.json({
    ok: true,
    used_trial: true,
    message: "Generated 1 free resume. For more variants + exports, use the paid unlock.",
    resume_text: resumeText,
  });
}
