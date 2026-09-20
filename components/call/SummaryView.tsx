"use client";

import React, { useState } from "react";
import {
  FileText,
  ChevronDown,
  Sparkles,
  Settings,
} from "lucide-react";
import { SummaryContent } from "@/lib/seed-meetings";

interface SummaryViewProps {
  summaryMap: Record<string, SummaryContent>;
  onSeek: (ms: number) => void;
}

export function SummaryView({ summaryMap, onSeek }: SummaryViewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("Enhanced");
  const [selectedLanguage, setSelectedLanguage] = useState("Auto");
  const [copyWithHyperlinks, setCopyWithHyperlinks] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const currentSummary = summaryMap[selectedTemplate] || summaryMap["Enhanced"];

  const handleCopy = (targetApp: string = "clipboard") => {
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
    if (currentSummary.next_steps && currentSummary.next_steps.length > 0) {
      text += "\n\n# Next Steps\n";
      text += currentSummary.next_steps.map((n) => `- ${n}`).join("\n");
    }

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
      {/* Top Controls Row Matching Screenshot 15.png */}
      <div className="p-4 border-b border-[#26282d] flex flex-wrap items-center justify-between gap-3">
        {/* Template & Language Controls */}
        <div className="flex items-center gap-2">
          {/* Template Button with Gear */}
          <div className="flex items-center bg-[#1e2024] hover:bg-[#26282d] border border-[#2f3238] rounded-lg">
            <div className="relative">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="h-8 pl-3 pr-7 bg-transparent text-xs font-semibold text-white outline-none cursor-pointer appearance-none"
              >
                <option value="Enhanced">Enhanced</option>
                <option value="General">General</option>
                <option value="Sales Discovery">Sales Discovery</option>
                <option value="Customer Success">Customer Success</option>
                <option value="Stand-up">Stand-up</option>
                <option value="1:1">1:1</option>
                <option value="Interview">Interview</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#9a9ba1] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="h-8 px-2 border-l border-[#2f3238] hover:text-[#00b2ea] text-[#9a9ba1] transition-colors cursor-pointer"
              title="Customize template"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Auto / Language Dropdown with Sparkles */}
          <div className="relative flex items-center bg-[#1e2024] hover:bg-[#26282d] border border-[#2f3238] rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#9a9ba1] ml-2.5 pointer-events-none" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="h-8 pl-2 pr-7 bg-transparent text-xs font-semibold text-white outline-none cursor-pointer appearance-none"
            >
              <option value="Auto">Auto</option>
              <option value="US EN">US EN</option>
              <option value="ES">Spanish</option>
              <option value="FR">French</option>
              <option value="DE">German</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#9a9ba1] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Copy Summary Blue Button & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowCopyMenu(!showCopyMenu)}
            className="h-8 px-3 rounded-lg bg-[#00b2ea]/15 hover:bg-[#00b2ea]/25 border border-[#00b2ea]/40 text-[#00b2ea] font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <span>{copied ? "Copied!" : "Copy Summary"}</span>
            <FileText className="w-3.5 h-3.5" />
          </button>

          {/* Dropdown Menu matching 15.png */}
          {showCopyMenu && (
            <div className="absolute right-0 mt-1.5 w-52 bg-[#1e2024] border border-[#2f3238] rounded-xl shadow-2xl py-1 z-30 text-xs">
              <button
                onClick={() => handleCopy("google-docs")}
                className="w-full text-left px-3.5 py-2 hover:bg-[#25282e] flex items-center gap-2.5 text-white"
              >
                <span>📄</span>
                <span className="font-medium">Google Docs</span>
              </button>
              <button
                onClick={() => handleCopy("gmail")}
                className="w-full text-left px-3.5 py-2 hover:bg-[#25282e] flex items-center gap-2.5 text-white"
              >
                <span>✉️</span>
                <span className="font-medium">GMail</span>
              </button>
              <button
                onClick={() => handleCopy("notion")}
                className="w-full text-left px-3.5 py-2 hover:bg-[#25282e] flex items-center gap-2.5 text-white"
              >
                <span>📝</span>
                <span className="font-medium">Notion</span>
              </button>
              <button
                onClick={() => handleCopy("word")}
                className="w-full text-left px-3.5 py-2 hover:bg-[#25282e] flex items-center gap-2.5 text-white"
              >
                <span>📘</span>
                <span className="font-medium">Microsoft Word</span>
              </button>

              <div className="my-1 border-t border-[#26282d]" />

              {/* Copy with hyperlinks toggle */}
              <div
                onClick={() => setCopyWithHyperlinks(!copyWithHyperlinks)}
                className="px-3.5 py-2 hover:bg-[#25282e] flex items-center justify-between text-white cursor-pointer"
              >
                <span className="font-medium">Copy with hyperlinks</span>
                <div
                  className={`w-7 h-4 rounded-full transition-colors relative flex items-center ${
                    copyWithHyperlinks ? "bg-[#00b2ea]" : "bg-[#3a3d45]"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      copyWithHyperlinks ? "translate-x-3.5" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gold Helper Banner Matching Screenshot 15.png */}
      <div className="px-6 py-2 bg-[#242010] border-b border-[#e8b923]/30 text-[11px] text-[#e8b923] flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
        <span className="text-[#f59e0b] font-medium">
          NEW: Customize this summary by clicking the ⚙ icon above
        </span>
      </div>

      {/* Summary Content Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs leading-relaxed">
        {/* Meeting Purpose */}
        <div>
          <h3 className="text-sm font-bold text-white mb-2">Meeting Purpose</h3>
          <p className="text-[#d1d5db]">
            {currentSummary.meeting_purpose}
          </p>
        </div>

        {/* Key Takeaways */}
        <div>
          <h3 className="text-sm font-bold text-white mb-2">Key Takeaways</h3>
          <ul className="space-y-2">
            {currentSummary.key_takeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-[#d1d5db]">
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Topics */}
        {currentSummary.topics && currentSummary.topics.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Topics</h3>
            <div className="space-y-4">
              {currentSummary.topics.map((topic, idx) => (
                <div key={idx} className="space-y-2">
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

                  <ul className="space-y-1.5 pl-2">
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
      </div>

      {/* Customize Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e2024] border border-[#2f3238] rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-2">Customize Summary Template</h3>
            <p className="text-xs text-[#9a9ba1] mb-4">
              Choose which sections and AI instructions are included in the &ldquo;{selectedTemplate}&rdquo; template.
            </p>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 text-white">
                <input type="checkbox" defaultChecked className="accent-[#00b2ea]" />
                <span>Meeting Purpose & Context</span>
              </label>
              <label className="flex items-center gap-2 text-white">
                <input type="checkbox" defaultChecked className="accent-[#00b2ea]" />
                <span>Key Takeaways (bulleted)</span>
              </label>
              <label className="flex items-center gap-2 text-white">
                <input type="checkbox" defaultChecked className="accent-[#00b2ea]" />
                <span>Granular Topic Breakdown</span>
              </label>
              <label className="flex items-center gap-2 text-white">
                <input type="checkbox" defaultChecked className="accent-[#00b2ea]" />
                <span>Explicit Action Items with Owners</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#2a2c32] hover:bg-[#34373e] text-white text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
