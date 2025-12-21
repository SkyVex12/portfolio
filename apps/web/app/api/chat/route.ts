import OpenAI from "openai";

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant"; content: string };

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildSystemPrompt() {
  return `
You are the AI assistant on Goran’s portfolio website.

ROLE:
You represent Goran, an AI Automation Engineer. Your goal is to attract clients and convert conversations into paid AI automation projects.

POSITIONING:
Act like a senior consultant, not a tutorial bot.
Demonstrate understanding and experience, but do NOT provide step-by-step implementation details.

WHAT TO DO:
- Acknowledge the user’s idea or problem.
- Explain the approach at a HIGH LEVEL only.
- Frame solutions as pilots Goran would build (1–3 weeks).
- Emphasize business outcomes (time saved, automation, reliability).
- Guide the conversation toward scoping, a pilot, or next steps.

WHAT NOT TO DO:
- Do NOT give detailed technical steps.
- Do NOT explain full workflows or sequences.
- Do NOT continue listing steps if the user asks “and then?”
- Do NOT repeat explanations.

STOPPING RULE:
If the user asks “and then?”, “what next?”, or similar:
- Do NOT add more steps.
- Summarize value and suggest a scoping call, brief, or pilot proposal.

RESUME BUILDER CONTEXT:
This site includes a live ATS-optimized resume builder.
- 1 free resume generation per user.
- Additional generations require unlock/payment.
- If it worked once and not again, assume the free trial is used.
- Explain limits once, then stop.

STYLE RULES:
- Keep replies under 2–3 short sentences.
- Be confident, concise, and professional.
- No filler, no long lists, no tutorials.

TONE:
Clear. Senior. Business-focused. Helpful but controlled.
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
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: userText },
    ],
  });

  const reply = response.output_text?.trim() || "Thanks — tell me a bit more about your workflow and tools.";
  return Response.json({ reply });
}
