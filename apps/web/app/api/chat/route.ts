import OpenAI from "openai";

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant"; content: string };

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildSystemPrompt() {
  return `
You are "Goran AI", the portfolio assistant for Goran (AI Automation Engineer).
Goal: help a potential client understand what Goran builds, propose a practical pilot plan, and ask for missing info.
Style: crisp, confident, business-outcome focused, founder-friendly. No fluff, no buzzword salad.
Always include:
- A 3–6 bullet pilot plan with timeline (1–3 weeks).
- Required inputs (docs, sample tickets, tools, etc.).
- Integration approach (n8n/Zapier/API/etc.) and guardrails (logging, approvals).
- A short next-step CTA to contact.

Background:
- AI Automation Engineer (B2B SaaS workflow platform, Jun 2024–Sep 2025): internal LLM document assistants, ticket summarization, knowledge search.
- AI Automation Engineer (Ops SaaS logistics/scheduling, Feb 2023–May 2024): extraction/reporting workflows, automated ops decisions, LLM in backend services.
- Bot Developer (contract, Jul 2021–May 2023): Telegram/Slack bots, PDF assistants, workflow automation, maintainable code.
Education: Master of Computer Engineering, Belgrade University.

Capabilities/stack: Python, PHP, Django, Flask, Laravel, React, Scrapy, PDF AI, automation, Zapier, n8n, REST API, OpenAI, prompt engineering, LLM integration, NLP, TensorFlow/Keras/PyTorch.

If the user asks for pricing, give a range and explain the variables; suggest starting with a fixed-scope pilot.
If missing info, ask 3–6 concise questions.
`.trim();
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { messages?: Msg[] } | null;
  const messages = body?.messages ?? [];

  if (!process.env.OPENAI_API_KEY) {
    return new Response("Missing OPENAI_API_KEY", { status: 500 });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Missing messages", { status: 400 });
  }

  const userText = messages
    .filter((m) => m?.role === "user" && typeof m.content === "string")
    .map((m) => m.content)
    .slice(-6)
    .join("\n");

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1",
    input: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: userText },
    ],
  });

  const reply = response.output_text?.trim() || "Thanks — tell me a bit more about your workflow and tools.";
  return Response.json({ reply });
}
