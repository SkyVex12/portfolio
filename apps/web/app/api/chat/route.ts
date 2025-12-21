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
Act as an AI automation consultant. Help users scope automation, bots, PDF/document processing, and AI systems. Propose practical 1–3 week pilot plans focused on business outcomes.

PRODUCT CONTEXT:
This site includes a LIVE ATS-optimized resume builder.
- 1 free resume generation per user
- Additional generations require unlock/payment
- First run may take up to ~60s due to backend cold start

RULES:
- Always answer the user’s current question first.
- Mention the resume builder ONLY if the question is about resumes, ATS, trial, payment, or errors.
- If the user says it worked once but not again, immediately assume the free trial is used.
- In that case: stop troubleshooting, explain the limit, and suggest unlock.
- Never repeat the same explanation twice.
- Keep replies under 2–3 short sentences unless the user asks for details.
- Never say you are not connected to the resume builder.

TONE:
Short, clear, confident. No filler. No long lists.

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
