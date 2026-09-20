"use client";

import React, { useState } from "react";
import { ArrowUp, Sparkles, RefreshCw } from "lucide-react";
import { FathomSwoosh } from "@/components/brand/Logo";

interface AskFathomViewProps {
  meetingTitle: string;
  onSeek: (ms: number) => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  citations?: Array<{ label: string; ms: number }>;
}

const PRECACHED_CHIPS: Record<
  string,
  { answer: string; citations: Array<{ label: string; ms: number }> }
> = {
  "Propose insightful follow-up questions": {
    answer:
      "Based on the discussion, here are 3 high-impact follow-up questions:\n\n1. For Carlos Ramirez: If the Pro tier launch on Nov 18 experiences lower self-serve conversion than modeled, what is the contingency discount threshold for enterprise pipeline?\n2. For Daniel Okafor: What specific synthetic load thresholds are required during the 2-week staging soak test to declare database migrations safe?\n3. For Hannah Weiss: How will Customer Success proactively track beta teams transitioning to paid after their 90-day grace period?",
    citations: [
      { label: "24:30", ms: 1470000 },
      { label: "36:00", ms: 2160000 },
    ],
  },
  "What challenges do you foresee?": {
    answer:
      "Two primary risks were identified in this meeting:\n\n1. Database Migration & Audio Queue Latency: Daniel strongly pushed back against the Nov 4 launch because staging tests need two full weeks to prevent audio queue bottlenecks under 10x traffic.\n2. Acme Corp SOC 2 Compliance Dependency: Acme's 500-seat expansion requires the SOC 2 Type II audit report by October 15th, making any audit slip an immediate revenue risk.",
    citations: [
      { label: "25:20", ms: 1522000 },
      { label: "46:30", ms: 2790000 },
    ],
  },
  "What would help make progress?": {
    answer:
      "Key accelerators agreed upon by leadership:\n\n1. Finalizing the self-serve onboarding prototypes by Wednesday (owned by Mei Lin).\n2. Deploying Postgres FTS GIN indexes by tomorrow to keep search queries sub-50ms without warehouse sync lag (owned by Tom Becker).\n3. Locking in the pricing sheet and discount approval matrix by Friday 5 PM (owned by Carlos Ramirez).",
    citations: [
      { label: "37:00", ms: 2225000 },
      { label: "47:40", ms: 2860000 },
      { label: "54:40", ms: 3280000 },
    ],
  },
  "What was surprising in this meeting?": {
    answer:
      "The most surprising revelation was that transcription turnaround was reduced by nearly 80% (from 4 minutes down to 45 seconds) in Q3 after the engineering pipeline refactoring, but Snowflake query costs spiked by 40% due to unindexed meeting segment lookups.",
    citations: [
      { label: "06:19", ms: 379000 },
      { label: "06:36", ms: 396000 },
    ],
  },
};

export function AskFathomView({ onSeek }: AskFathomViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleChipClick = (chipTitle: string) => {
    const cached = PRECACHED_CHIPS[chipTitle];
    if (!cached) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: chipTitle },
      {
        role: "assistant",
        text: cached.answer,
        citations: cached.citations,
      },
    ]);
  };

  const handleSend = async () => {
    if (!inputQuery.trim() || isTyping) return;

    const userText = inputQuery.trim();
    setInputQuery("");
    setIsTyping(true);

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText, meetingId: "829997322" }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.text,
          citations: data.citations,
        },
      ]);
    } catch {
      // Fallback to local planted facts
      let reply = "";
      let citations: Array<{ label: string; ms: number }> = [];

      const lower = userText.toLowerCase();
      if (lower.includes("pricing") || lower.includes("who owns")) {
        reply =
          "Carlos Ramirez owns the pricing decision and the discount approval matrix. He committed to finalizing the complete pricing sheet by Friday at 5 PM.";
        citations = [{ label: "37:05", ms: 2225000 }];
      } else if (lower.includes("launch") || lower.includes("date")) {
        reply =
          "The official launch date is November 18th. Marketing originally proposed November 4th for the SaaS Summit, but Daniel Okafor pushed back to ensure adequate staging soak tests.";
        citations = [
          { label: "24:30", ms: 1470000 },
          { label: "27:00", ms: 1620000 },
        ];
      } else if (lower.includes("offsite")) {
        reply =
          "The team offsite is confirmed for Lake Tahoe from October 24th to 26th. Priya confirmed that cabins and team dinners are booked.";
        citations = [{ label: "54:14", ms: 3254000 }];
      } else if (lower.includes("acme") || lower.includes("soc 2")) {
        reply =
          "Acme Corp requires our final SOC 2 Type II audit report before signing their 500-seat expansion. Daniel confirmed the report will be delivered by October 15th.";
        citations = [{ label: "46:50", ms: 2810000 }];
      } else {
        reply =
          "Based on the transcript, this meeting focused on Q4 Roadmap Planning, including self-serve onboarding as Priority 1, the November 18th launch date, and Pro tier packaging at $19/user/month.";
        citations = [{ label: "01:11", ms: 71400 }];
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply, citations },
      ]);
    } finally {
      setIsTyping(false);
    }
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
              {Object.keys(PRECACHED_CHIPS).map((chip, idx) => (
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
            onClick={handleSend}
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
