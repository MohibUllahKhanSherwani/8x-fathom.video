"use client";

import React, { useState } from "react";
import { ArrowUp, Sparkles, RefreshCw } from "lucide-react";
import { FathomSwoosh } from "@/components/brand/Logo";

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
  "Propose insightful follow-up questions",
  "What challenges do you foresee?",
  "What would help make progress?",
  "What was surprising in this meeting?",
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

  const handleChipClick = (chipTitle: string) => {
    handleSend(chipTitle);
  };


  return (
    <div className="flex flex-col h-full bg-black text-white relative select-none">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center max-w-lg mx-auto">
            {/* Centered Fathom Circle */}
            <div className="w-14 h-14 rounded-full bg-[#1e2024] border border-[#2f3238] flex items-center justify-center mb-4 shadow-xl">
              <FathomSwoosh className="w-7 h-7" />
            </div>

            <h3 className="text-base font-bold text-white mb-6">
              Hi, what can I tell you about this meeting?
            </h3>

            {/* 2x2 Suggestion Chips Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {PROMPT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(chip)}
                  className="p-3.5 rounded-xl bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238] text-left text-xs text-white transition-all duration-150 cursor-pointer shadow-sm hover:border-[#00b2ea]/40"
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
                  <div className="max-w-[85%] bg-[#25282e] border border-[#32353c] text-white p-3.5 rounded-2xl rounded-tr-xs leading-relaxed">
                    {msg.text}
                  </div>
                ) : (
                  <div className="flex items-start gap-3 max-w-[90%]">
                    <div className="w-7 h-7 rounded-full bg-[#1e2024] border border-[#2f3238] flex items-center justify-center shrink-0 mt-0.5">
                      <FathomSwoosh className="w-4 h-4" />
                    </div>

                    <div className="bg-[#161719] border border-[#26282d] p-4 rounded-2xl rounded-tl-xs leading-relaxed text-[#d1d5db] space-y-3">
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {/* Citation Chips */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-2 border-t border-[#26282d] flex items-center gap-2">
                          <span className="text-[10px] uppercase font-semibold text-[#9a9ba1]">
                            Citations:
                          </span>
                          {msg.citations.map((c, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => onSeek(c.ms)}
                              className="px-2 py-0.5 rounded-full bg-[#00b2ea]/15 hover:bg-[#00b2ea]/25 border border-[#00b2ea]/40 text-[#00b2ea] font-mono text-[10px] font-semibold transition-colors cursor-pointer"
                            >
                              [{c.label}]
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
              <div className="flex items-center gap-2 text-xs text-[#9a9ba1]">
                <Sparkles className="w-3.5 h-3.5 text-[#00b2ea] animate-spin" />
                <span>Thinking...</span>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <button
                onClick={() => setMessages([])}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238] text-[11px] text-[#9a9ba1] hover:text-white transition-all cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Start a new session</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bottom Input Field */}
      <div className="p-4 border-t border-[#26282d] bg-black">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask Fathom AI..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            className="w-full h-11 pl-4 pr-11 bg-[#1e2024] hover:bg-[#25282e] focus:bg-[#25282e] border border-[#2f3238] focus:border-[#00b2ea] rounded-xl text-xs text-white placeholder-[#9a9ba1] outline-none transition-all shadow-inner"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim()}
            className="absolute right-2 w-7 h-7 rounded-lg bg-[#00b2ea] hover:bg-[#00c5ff] disabled:opacity-40 disabled:hover:bg-[#00b2ea] text-black flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <ArrowUp className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
}
