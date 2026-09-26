"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, PanelRightClose, PanelRight, Send, Loader2, Clock } from "lucide-react";

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
      text: "Hello Mohib! I'm your Fathom AI Intelligence Copilot. Ask me anything across your meetings, or pick a prompt below:",
    },
  ]);

  const promptSuggestions = [
    "What are our main Q4 priorities and launch date?",
    "What pricing was proposed for the Pro tier?",
    "When is the SOC 2 audit report due?",
    "List all action items assigned to Carlos Ramirez",
  ];

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-6 bottom-6 h-12 px-5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-full shadow-2xl shadow-indigo-500/25 flex items-center gap-2.5 text-xs font-semibold transition-all z-20 cursor-pointer"
        title="Open Ask Fathom Copilot"
      >
        <Sparkles className="w-4 h-4 text-white" />
        <span>Ask Fathom AI</span>
        <PanelRight className="w-4 h-4 text-indigo-200" />
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
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I encountered an issue querying the meeting intelligence engine. Please ensure your query relates to recorded calls.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="w-80 md:w-96 border-l border-white/6 bg-[#0c0f17]/95 backdrop-blur-xl flex flex-col h-[calc(100vh-4rem)] select-none shrink-0 transition-all z-20">
      {/* Panel Header */}
      <div className="h-14 px-5 border-b border-white/6 flex items-center justify-between text-xs bg-white/2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-white font-bold text-xs tracking-tight">Ask Fathom</span>
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live AI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Scope Selector */}
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as "my" | "team" | "all")}
            className="bg-[#141824] border border-white/8 text-[11px] text-slate-300 rounded-lg px-2 py-1 outline-none"
          >
            <option value="my">My Calls</option>
            <option value="team">Team Calls</option>
            <option value="all">All Calls</option>
          </select>

          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Collapse panel"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[90%] p-3.5 rounded-2xl leading-relaxed ${
                m.role === "user"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-[#141926] border border-white/6 text-slate-200 shadow-inner"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>

              {/* Timestamp Citations */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-slate-400 font-medium block w-full mb-1">
                    Citations from transcript:
                  </span>
                  {m.citations.map((c, cIdx) => (
                    <Link
                      key={cIdx}
                      href={`/calls/${c.meetingId}?t=${c.ms}`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors font-mono text-[10px]"
                    >
                      <Clock className="w-2.5 h-2.5" />
                      <span>{c.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#141926] border border-white/6 text-slate-400 text-xs w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            <span>Analyzing meeting transcripts with Gemini...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompts (if only 1 initial message) */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Suggested Prompts
          </p>
          <div className="space-y-1.5">
            {promptSuggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="w-full text-left p-2 rounded-xl bg-white/2 hover:bg-white/6 border border-white/5 hover:border-indigo-500/30 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
              >
                <span className="truncate">{prompt}</span>
                <span className="text-slate-500 group-hover:text-indigo-400 text-[10px]">↵</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="p-4 border-t border-white/6 bg-white/1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            placeholder="Ask about decisions, dates, speakers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className="w-full h-10 pl-3.5 pr-10 bg-[#141824] border border-white/8 focus:border-indigo-500/60 rounded-xl text-xs text-white placeholder-slate-400 outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all cursor-pointer"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          Powered by Gemini 3.6 Flash & Postgres Full-Text Search
        </p>
      </div>
    </aside>
  );
}
