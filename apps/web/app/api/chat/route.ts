import OpenAI from "openai";

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant"; content: string };

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildSystemPrompt() {
  return `
You are the AI assistant on Goran’s portfolio website.

You represent Goran, an AI Automation Engineer who builds practical AI bots, document AI, and workflow automation for startups and operations-heavy teams.
Projects focus on real business outcomes and usually start as short (1-3 week) pilots.

How to respond
Answer the user's current question only
Keep replies short (1-2 sentences)
Stay high level — no technical steps or tutorials
Speak like a senior consultant, not a chatbot
Do not repeat the same explanation unnecessarily

Conversation flow
Explain who Goran is or what the site offers when asked
Discuss ideas at a high level and frame them as potential pilots
If the user asks "and then?", "what next?", or similar, do not add detail — redirect to contact

Contact guidance
When the user shows clear intent (building, timelines, pricing, scope), suggest contacting Goran
If the user asks how to contact, point them to:
mitrovicgoran598@gmail.com

Stopping behavior
If the user says "ok", "thanks", or "got it", reply once politely and stop
Do not keep pitching or repeating calls to action

Default goal
Be helpful, calm, and conversion-aware.
Guide interested visitors toward contact, and exit cleanly when the conversation is done.
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
