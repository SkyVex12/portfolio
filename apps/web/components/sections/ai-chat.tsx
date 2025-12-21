"use client";

import Section from "@/components/ui/section";
import Badge from "@/components/ui/badge";
import { QUICK_QUESTIONS } from "@/lib/data";
import { useMemo, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string };

export default function AiChat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi — I’m Goran. Tell me what you want to automate (support, ops, CRM, PDFs, bots), and I’ll suggest a fast pilot plan.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const last = useMemo(() => messages[messages.length - 1], [messages]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || loading) return;
    setLoading(true);
    setInput("");

    const next = [...messages, { role: "user", content: t } as Msg];
    setMessages(next);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Request failed");
      }

      const data = (await res.json()) as { reply: string };
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "I hit an error calling the AI API. Make sure you set OPENAI_API_KEY in .env.local and restart the dev server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section
      id="ai-chat"
      eyebrow="Interactive"
      title="Ask my AI assistant"
      desc="This chat is wired to a real OpenAI API route. Use it to explore how I’d approach your automation in a pilot."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-black/10 bg-white/70 p-4 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between px-2 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="opacity-80" />
                <span className="text-sm font-semibold">Goran AI</span>
              </div>
              <Badge>{loading ? "Thinking…" : "Live"}</Badge>
            </div>

            <div className="h-[360px] overflow-auto rounded-2xl border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="space-y-3">
                {messages.map((m, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : "border border-black/10 bg-white dark:border-white/10 dark:bg-white/5"
                      }`}
                    >
                      {m.content}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your workflow… (e.g., Trello → Gmail follow-ups, PDF extraction, Slack bot)"
                className="ringy w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/5"
              />
              <button
                type="submit"
                disabled={loading}
                className="ringy inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white shadow-soft hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
              >
                <Send size={16} />
                Send
              </button>
            </form>

            <div className="mt-2 text-xs opacity-70">
              {last?.role === "assistant" ? "Try a quick question →" : "Waiting for response…"}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white/70 p-5 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="text-sm font-semibold">Quick questions</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="ringy text-left"
              >
                <Badge className="cursor-pointer hover:opacity-100 opacity-90">{q}</Badge>
              </button>
            ))}
          </div>

          <div className="mt-6 text-sm">
            <div className="font-semibold">What you’ll get</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm opacity-80">
              <li>pilot plan + scope</li>
              <li>what data you need</li>
              <li>integration approach</li>
              <li>risks + guardrails</li>
            </ul>
          </div>

          <div className="mt-6 text-xs opacity-70">
            If you see an error: add <code className="px-1">OPENAI_API_KEY</code> in <code className="px-1">.env.local</code>.
          </div>
        </div>
      </div>
    </Section>
  );
}
