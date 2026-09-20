"use client";

import React, { useState } from "react";
import {
  FileText,
  Copy,
  ChevronDown,
  Check,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { SummaryContent } from "@/lib/seed-meetings";

interface SummaryViewProps {
  summaryMap: Record<string, SummaryContent>;
  onSeek: (ms: number) => void;
}

export function SummaryView({ summaryMap, onSeek }: SummaryViewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("Enhanced");
  const [selectedLanguage, setSelectedLanguage] = useState("US EN");
  const [copied, setCopied] = useState(false);
  const [showCopyMenu, setShowCopyMenu] = useState(false);

  const currentSummary = summaryMap[selectedTemplate] || summaryMap["Enhanced"];

  const handleCopy = (format: string = "markdown") => {
    if (!currentSummary) return;

    let text = `# Meeting Purpose\n${currentSummary.meeting_purpose}\n\n# Key Takeaways\n`;
    text += currentSummary.key_takeaways.map((k) => `- ${k}`).join("\n");
    text += "\n\n# Topics\n";
    text += currentSummary.topics
      .map(
        (t) =>
          `## ${t.title}\n` + t.bullets.map((b) => `  - ${b}`).join("\n")
      )
      .join("\n\n");
    text += "\n\n# Next Steps\n";
    text += currentSummary.next_steps.map((n) => `- ${n}`).join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setShowCopyMenu(false);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  if (!currentSummary) {
    return (
      <div className="p-8 text-center text-[#9a9ba1] text-xs">
        No summary generated for this template.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black text-white select-none">
      {/* Top Controls Row */}
      <div className="p-4 border-b border-[#26282d] flex flex-wrap items-center justify-between gap-3">
        {/* Template & Language Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Template Dropdown */}
          <div className="relative">
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="h-8 pl-3 pr-8 bg-[#1e2024] hover:bg-[#26282d] border border-[#2f3238] rounded-lg text-xs font-semibold text-white outline-none cursor-pointer appearance-none"
            >
              <option value="Enhanced">Enhanced</option>
              <option value="General">General</option>
              <option value="Sales Discovery">Sales Discovery</option>
              <option value="Customer Success">Customer Success</option>
              <option value="Stand-up">Stand-up</option>
              <option value="1:1">1:1</option>
              <option value="Interview">Interview</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#9a9ba1] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="h-8 pl-3 pr-7 bg-[#1e2024] hover:bg-[#26282d] border border-[#2f3238] rounded-lg text-xs font-semibold text-[#9a9ba1] hover:text-white outline-none cursor-pointer appearance-none"
            >
              <option value="US EN">US EN</option>
              <option value="Auto">Auto</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#9a9ba1] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Copy Summary Button & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowCopyMenu(!showCopyMenu)}
            className="h-8 px-3 rounded-lg bg-[#00b2ea]/15 hover:bg-[#00b2ea]/25 border border-[#00b2ea]/40 text-[#00b2ea] font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Summary"}</span>
            <FileText className="w-3.5 h-3.5 ml-0.5" />
          </button>

          {showCopyMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-[#1e2024] border border-[#2f3238] rounded-lg shadow-2xl py-1 z-30 text-xs">
              <button
                onClick={() => handleCopy("google-docs")}
                className="w-full text-left px-3 py-2 hover:bg-[#25282e] flex items-center gap-2 text-white"
              >
                <span>📄 Google Docs</span>
              </button>
              <button
                onClick={() => handleCopy("gmail")}
                className="w-full text-left px-3 py-2 hover:bg-[#25282e] flex items-center gap-2 text-white"
              >
                <span>✉️ GMail</span>
              </button>
              <button
                onClick={() => handleCopy("notion")}
                className="w-full text-left px-3 py-2 hover:bg-[#25282e] flex items-center gap-2 text-white"
              >
                <span>📝 Notion</span>
              </button>
              <button
                onClick={() => handleCopy("word")}
                className="w-full text-left px-3 py-2 hover:bg-[#25282e] flex items-center gap-2 text-white"
              >
                <span>📘 Microsoft Word</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gold Helper Banner */}
      <div className="px-6 py-2 bg-[#242116] border-b border-[#e8b923]/30 text-[11px] text-[#e8b923] flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>NEW: Customize this summary by selecting different templates above.</span>
      </div>

      {/* Summary Content Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs leading-relaxed">
        {/* Meeting Purpose */}
        <div>
          <h3 className="text-sm font-bold text-white mb-2">Meeting Purpose</h3>
          <p className="text-[#d1d5db] bg-[#161719] p-3.5 rounded-xl border border-[#26282d]">
            {currentSummary.meeting_purpose}
          </p>
        </div>

        {/* Key Takeaways */}
        <div>
          <h3 className="text-sm font-bold text-white mb-2">Key Takeaways</h3>
          <ul className="space-y-2 bg-[#161719] p-4 rounded-xl border border-[#26282d]">
            {currentSummary.key_takeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-[#d1d5db]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00b2ea] mt-1.5 shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Topics */}
        {currentSummary.topics && currentSummary.topics.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Topics</h3>
            <div className="space-y-3">
              {currentSummary.topics.map((topic, idx) => (
                <div
                  key={idx}
                  className="bg-[#161719] p-4 rounded-xl border border-[#26282d] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white text-xs">{topic.title}</h4>
                    {topic.start_ms !== undefined && (
                      <button
                        onClick={() => onSeek(topic.start_ms)}
                        className="px-2 py-0.5 rounded-full bg-[#1e2024] hover:bg-[#00b2ea]/20 text-[#00b2ea] text-[10px] font-mono font-medium transition-colors cursor-pointer"
                      >
                        {formatTime(topic.start_ms)}
                      </button>
                    )}
                  </div>

                  <ul className="space-y-1.5 pl-1">
                    {topic.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 text-[#9a9ba1]">
                        <span className="w-1 h-1 rounded-full bg-[#9a9ba1] mt-1.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {currentSummary.next_steps && currentSummary.next_steps.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-white mb-2">Next Steps</h3>
            <ul className="space-y-2 bg-[#161719] p-4 rounded-xl border border-[#26282d]">
              {currentSummary.next_steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[#d1d5db]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3dbb6b] mt-1.5 shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
