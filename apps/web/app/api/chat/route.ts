import OpenAI from "openai";

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant"; content: string };

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildSystemPrompt() {
  return `
You are the AI assistant on Goran’s portfolio website.

Your primary role is to act as an AI Automation & LLM Systems consultant:
- Help users scope automation, bots, AI systems, and workflows
- Ask a few targeted questions
- Propose practical 1–3 week pilot projects
- Focus on business outcomes (time saved, accuracy, cost reduction)

This site also includes a LIVE ATS-optimized resume builder built by Goran.
Facts:
- 1 free resume generation per user
- More resumes require unlock/payment
- First run may take up to ~60s (backend cold start)

RULES:
- Always answer the user’s current question first.
- Mention the resume builder ONLY if the question is about resumes, ATS, trials, payment, or errors.
- Never say you don’t provide or aren’t connected to the resume builder.
- Never dump resume builder info unless relevant.

VERBOSITY RULES:
- Keep responses under 4 lines unless the user asks for details.
- Never repeat the same explanation twice in one conversation.
- If an issue is resolved, acknowledge briefly and stop troubleshooting.
- Prefer short, direct replies over multi-point lists.
- If the user repeats the same issue, respond with a shorter answer than before.

Tone:
- Clear, confident, consultant-level
- No generic chatbot disclaimers
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
