"use client";

import Section from "@/components/ui/section";
import Badge from "@/components/ui/badge";
import { QUICK_QUESTIONS } from "@/lib/data";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string };

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-black/60 [animation-delay:-0.2s] dark:bg-white/70" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-black/60 [animation-delay:-0.1s] dark:bg-white/70" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-black/60 dark:bg-white/70" />
    </div>
  );
}

export default function AiChat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi — I’m Goran's AI assistant. Tell me what you want to automate (support, ops, CRM, PDFs, bots), and I’ll suggest a fast pilot plan.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const last = useMemo(() => messages[messages.length - 1], [messages]);

  // Auto-scroll to bottom on new messages / typing state.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, loading]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || loading) return;

    setLoading(true);
    setInput("");

    const next: Msg[] = [...messages, { role: "user", content: t }];
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
    } catch {
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
      desc="A lightweight chat UI wired to a real API route. Ask about your workflow and I’ll propose a fast pilot plan."
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

            <div
              ref={scrollRef}
              className="h-[380px] overflow-auto rounded-2xl border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="space-y-3">
                {messages.map((m, idx) => {
                  const isUser = m.role === "user";
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={"flex items-end gap-2 " + (isUser ? "justify-end" : "justify-start")}
                    >
                      {!isUser && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/10">
                          <Bot size={16} className="opacity-80" />
                        </div>
                      )}

                      <div
                        className={
                          "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed " +
                          (isUser
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "border border-black/10 bg-white dark:border-white/10 dark:bg-white/5")
                        }
                      >
                        {m.content}
                      </div>

                      {isUser && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/10">
                          <User size={16} className="opacity-80" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-2 justify-start"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/10">
                      <Bot size={16} className="opacity-80" />
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-white/5">
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
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
                disabled={loading || !input.trim()}
                className="ringy inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white shadow-soft hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
              >
                <Send size={16} />
                Send
              </button>
            </form>

            <div className="mt-2 text-xs opacity-70">
              {last?.role === "assistant" && !loading ? "Try a quick question →" : ""}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white/70 p-5 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="text-sm font-semibold">Quick questions</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button key={q} onClick={() => send(q)} className="ringy text-left">
                <Badge className="cursor-pointer opacity-90 hover:opacity-100">{q}</Badge>
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
        </div>
      </div>
    </Section>
  );
}
