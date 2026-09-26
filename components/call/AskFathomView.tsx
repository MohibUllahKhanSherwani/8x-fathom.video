"use client";

import React, { useState } from "react";
import { ArrowUp, Sparkles, RefreshCw, Clock } from "lucide-react";

interface AskFathomViewProps {
  meetingTitle: string;
  meetingId?: string;
  onSeek: (ms: number) => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  citations?: Array<{ label: string; ms: number }>;
}

const PROMPT_CHIPS = [
  "What is the final decision on the launch date?",
  "What pricing tier did Carlos recommend?",
  "What are the compliance deadlines for SOC 2?",
  "Summarize key engineering risks discussed",
];

export function AskFathomView({ meetingId, onSeek }: AskFathomViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (queryOverride?: string) => {
    const userText = (queryOverride || inputQuery).trim();
    if (!userText || isTyping) return;

    if (!queryOverride) setInputQuery("");
    setIsTyping(true);

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText, meetingId: meetingId || "829997321" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to query Gemini AI");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.text,
          citations: data.citations,
        },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error querying Gemini AI";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `⚠️ ${msg}`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0d14] text-white relative select-text">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center max-w-lg mx-auto">
            {/* Centered Icon */}
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-4 shadow-xl text-indigo-400">
              <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              Ask Fathom AI Copilot
            </h3>
            <p className="text-xs text-slate-400 mb-6 max-w-sm">
              Ask questions about planted facts, strategic priorities, action owners, or key quotes.
            </p>

            {/* Suggestion Chips Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
              {PROMPT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="p-3.5 rounded-xl bg-[#111522] hover:bg-[#161c2c] border border-white/6 hover:border-indigo-500/40 text-left text-xs text-slate-300 hover:text-white transition-all duration-150 cursor-pointer shadow-sm"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {msg.role === "user" ? (
                  <div className="max-w-[85%] bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-xs leading-relaxed shadow-sm">
                    {msg.text}
                  </div>
                ) : (
                  <div className="flex items-start gap-3 max-w-[90%]">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5 text-indigo-400">
                      <Sparkles className="w-4 h-4" />
                    </div>

                    <div className="bg-[#111522] border border-white/6 p-4 rounded-2xl rounded-tl-xs leading-relaxed text-slate-200 space-y-3 shadow-sm">
                      <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                      {/* Citation Chips */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-2">
                          <span className="text-[10px] uppercase font-semibold text-slate-400">
                            Citations:
                          </span>
                          {msg.citations.map((c, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => onSeek(c.ms)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-semibold transition-colors cursor-pointer"
                            >
                              <Clock className="w-2.5 h-2.5" />
                              <span>[{c.label}]</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Gemini is generating response from transcript...</span>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <button
                onClick={() => setMessages([])}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 text-[11px] text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Start fresh conversation</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bottom Input Field */}
      <div className="p-4 border-t border-white/6 bg-[#0c0f17]">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask about decisions, dates, speakers..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            className="w-full h-11 pl-4 pr-11 bg-[#131724] border border-white/8 focus:border-indigo-500/60 rounded-xl text-xs text-white placeholder-slate-400 outline-none transition-all"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isTyping}
            className="absolute right-2 w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ArrowUp className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
}
