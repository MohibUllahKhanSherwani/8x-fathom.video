"use client";

import React, { useState } from "react";
import { Sparkles, PanelRightClose, PanelRight, Send, RefreshCw, ChevronDown } from "lucide-react";
import { FathomSwoosh } from "@/components/brand/Logo";

interface AskFathomPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AskFathomPanel({ isOpen, onToggle }: AskFathomPanelProps) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"my" | "team" | "all">("my");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      role: "user" | "assistant";
      text: string;
      citations?: Array<{ label: string; ms: number; meetingId: string; meetingTitle: string }>;
    }>
  >([
    {
      role: "assistant",
      text: "Hi! Ask me anything across your meetings, like 'What are my deadlines?', 'Who owns pricing?', or 'Summarize my meetings from today'.",
    },
  ]);

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-4 bottom-4 h-11 px-4 bg-[#1e2024] hover:bg-[#26292f] border border-[#2f3238] rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold text-white transition-all z-20 cursor-pointer"
        title="Open Ask Fathom"
      >
        <Sparkles className="w-4 h-4 text-[#00b2ea]" />
        <span>Ask Fathom</span>
        <PanelRight className="w-4 h-4 text-[#9a9ba1]" />
      </button>
    );
  }

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || query;
    if (!text.trim() || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, scope }),
      });

      if (!res.ok) throw new Error("Failed to fetch answer");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.text,
          citations: data.citations,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I had trouble answering that question. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="w-80 md:w-96 border-l border-[#26282d] bg-[#161719] flex flex-col h-[calc(100vh-3.5rem)] select-none shrink-0">
      {/* Panel Header */}
      <div className="h-12 px-4 border-b border-[#26282d] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-bold text-white">
          <Sparkles className="w-4 h-4 text-[#00b2ea]" />
          <span>ASK FATHOM</span>
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded hover:bg-[#25282e] text-[#9a9ba1] hover:text-white transition-colors cursor-pointer"
          title="Collapse panel"
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
      </div>

      {/* Gold Announcement Banner */}
      <div className="p-3 bg-[#242116] border-b border-[#e8b923]/30 text-[11px] text-[#e8b923] flex items-start gap-2 leading-relaxed">
        <span className="text-sm">🎁</span>
        <div>
          <span className="font-semibold">Account-level Ask Fathom is here!</span> We&apos;re gifting you unlimited use until Oct 1. Limits may apply after.{" "}
          <span className="underline cursor-pointer">Learn More</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            {msg.role === "user" ? (
              <div className="max-w-[85%] bg-[#25282e] border border-[#32353c] text-white p-3 rounded-2xl rounded-tr-xs leading-relaxed">
                {msg.text}
              </div>
            ) : (
              <div className="flex items-start gap-2.5 max-w-[90%]">
                <div className="w-6 h-6 rounded-full bg-[#111214] border border-[#2f3238] flex items-center justify-center shrink-0 mt-0.5">
                  <FathomSwoosh className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-2 py-1">
                  <div className="text-[#d1d5db] whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Citation chips */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.citations.map((c, cIdx) => (
                        <a
                          key={cIdx}
                          href={`/calls/${c.meetingId}?t=${c.ms}`}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00b2ea]/15 hover:bg-[#00b2ea]/25 border border-[#00b2ea]/40 text-[#00b2ea] font-mono text-[10px] font-semibold transition-colors"
                        >
                          <span>{c.meetingTitle || "Call"}</span>
                          <span>[{c.label}]</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#9a9ba1]">
            <Sparkles className="w-3.5 h-3.5 text-[#00b2ea] animate-spin" />
            <span>Searching all meetings...</span>
          </div>
        )}

        {/* Start New Session Pill */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() =>
              setMessages([
                {
                  role: "assistant",
                  text: "Session reset. Ask me anything across your meetings!",
                },
              ])
            }
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238] text-[11px] text-[#9a9ba1] hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Start a new session</span>
          </button>
        </div>


        {/* Suggested Prompts */}
        <div className="space-y-1.5 pt-4">
          <p className="text-[10px] uppercase font-semibold text-[#9a9ba1] tracking-wider mb-2">
            Suggested Prompts
          </p>
          {[
            "Summarize my meetings from today",
            "List my action items from last week",
            "Any looming deadlines?",
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="w-full text-left p-2.5 rounded-lg bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238] text-xs text-white transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="p-3 border-t border-[#26282d] bg-[#111214]">
        <div className="relative bg-[#1e2024] border border-[#2f3238] focus-within:border-[#00b2ea] rounded-xl transition-all">
          <textarea
            rows={2}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything..."
            className="w-full p-2.5 text-xs text-white placeholder-[#9a9ba1] bg-transparent outline-none resize-none"
          />

          <div className="flex items-center justify-between px-2.5 pb-2">
            {/* Scope Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#161719] border border-[#2f3238] text-[11px] text-[#9a9ba1] hover:text-white transition-colors cursor-pointer"
              >
                <span>{scope === "my" ? "My Calls" : scope === "team" ? "Team Calls" : "All Calls"}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={!query.trim()}
              className="w-7 h-7 rounded-full bg-[#00b2ea] hover:bg-[#00c5ff] disabled:opacity-40 disabled:hover:bg-[#00b2ea] text-black flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5 fill-black" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
