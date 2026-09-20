"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  Sparkles,
  Settings,
  Check,
  Copy,
  Loader2,
} from "lucide-react";
import { SummaryContent } from "@/lib/seed-meetings";

interface SummaryViewProps {
  summaryMap: Record<string, SummaryContent>;
  onSeek: (ms: number) => void;
  meetingId?: string;
  onUpdateSummary?: (template: string, content: SummaryContent) => void;
}

export function SummaryView({ summaryMap, onSeek, meetingId, onUpdateSummary }: SummaryViewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("Enhanced");
  const [selectedLanguage, setSelectedLanguage] = useState("Auto");
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [generatedSummaries, setGeneratedSummaries] = useState<Record<string, SummaryContent>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const mergedMap = useMemo(
    () => ({ ...summaryMap, ...generatedSummaries }),
    [summaryMap, generatedSummaries]
  );

  // If selectedTemplate is not in mergedMap and meetingId is provided, generate via /api/summarize
  useEffect(() => {
    if (!meetingId) return;
    if (mergedMap[selectedTemplate]) return;

    let isCancelled = false;
    async function fetchSummary() {
      setIsGenerating(true);
      setGenError(null);
      try {
        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meetingId,
            template: selectedTemplate,
            language: selectedLanguage === "Auto" ? "en" : selectedLanguage.toLowerCase(),
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to generate summary");
        }

        if (!isCancelled && data.summary) {
          setGeneratedSummaries((prev) => ({ ...prev, [selectedTemplate]: data.summary }));
          onUpdateSummary?.(selectedTemplate, data.summary);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const msg = err instanceof Error ? err.message : "Error generating summary";
          setGenError(msg);
        }
      } finally {
        if (!isCancelled) {
          setIsGenerating(false);
        }
      }
    }

    fetchSummary();
    return () => {
      isCancelled = true;
    };
  }, [selectedTemplate, selectedLanguage, meetingId, mergedMap, onUpdateSummary]);

  const currentSummary = mergedMap[selectedTemplate] || mergedMap["Enhanced"];

  const handleCopy = () => {
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
    setTimeout(() => setCopied(false), 1000);
  };

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-16 gap-3 text-xs text-[#9a9ba1]">
        <Loader2 className="w-6 h-6 animate-spin text-[#00b2ea]" />
        <span>Generating {selectedTemplate} summary with Gemini LLM...</span>
      </div>
    );
  }

  if (genError) {
    return (
      <div className="p-8 text-center text-xs text-[#fca5a5]">
        <p className="font-semibold mb-2">Error generating summary</p>
        <p className="text-[#9a9ba1]">{genError}</p>
      </div>
    );
  }

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
          {/* Custom Template Dropdown */}
          <div className="relative flex items-center bg-[#1e2024] hover:bg-[#26282d] border border-[#2f3238] rounded-lg">
            <button
              type="button"
              onClick={() => {
                setIsTemplateOpen(!isTemplateOpen);
                setIsLanguageOpen(false);
              }}
              className="h-8 pl-3 pr-2.5 flex items-center gap-2 text-xs font-semibold text-white cursor-pointer"
            >
              <span>{selectedTemplate}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#9a9ba1] transition-transform duration-150 ${isTemplateOpen ? "rotate-180 text-[#00b2ea]" : ""}`} />
            </button>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="h-8 px-2 border-l border-[#2f3238] hover:text-[#00b2ea] text-[#9a9ba1] transition-colors cursor-pointer"
              title="Customize template"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* Template Menu */}
            {isTemplateOpen && (
              <div className="absolute top-9 left-0 w-48 rounded-xl bg-[#16181f] border border-[#2e313b] shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                {[
                  "Enhanced",
                  "General",
                  "Sales Discovery",
                  "Customer Success",
                  "Stand-up",
                  "1:1",
                  "Interview",
                ].map((tmpl) => (
                  <button
                    key={tmpl}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(tmpl);
                      setIsTemplateOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#222634] transition-colors cursor-pointer ${
                      selectedTemplate === tmpl
                        ? "text-[#00b2ea] font-semibold bg-[#00b2ea]/10"
                        : "text-[#d1d5db] hover:text-white"
                    }`}
                  >
                    <span>{tmpl}</span>
                    {selectedTemplate === tmpl && <Check className="w-3.5 h-3.5 text-[#00b2ea]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom Auto / Language Dropdown with Sparkles */}
          <div className="relative flex items-center bg-[#1e2024] hover:bg-[#26282d] border border-[#2f3238] rounded-lg">
            <button
              type="button"
              onClick={() => {
                setIsLanguageOpen(!isLanguageOpen);
                setIsTemplateOpen(false);
              }}
              className="h-8 pl-2.5 pr-2.5 flex items-center gap-1.5 text-xs font-semibold text-white cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00b2ea]" />
              <span>{selectedLanguage}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#9a9ba1] transition-transform duration-150 ${isLanguageOpen ? "rotate-180 text-[#00b2ea]" : ""}`} />
            </button>

            {/* Language Menu */}
            {isLanguageOpen && (
              <div className="absolute top-9 left-0 w-36 rounded-xl bg-[#16181f] border border-[#2e313b] shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                {[
                  { id: "Auto", label: "Auto" },
                  { id: "US EN", label: "English" },
                  { id: "ES", label: "Spanish" },
                  { id: "FR", label: "French" },
                  { id: "DE", label: "German" },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => {
                      setSelectedLanguage(lang.id);
                      setIsLanguageOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#222634] transition-colors cursor-pointer ${
                      selectedLanguage === lang.id
                        ? "text-[#00b2ea] font-semibold bg-[#00b2ea]/10"
                        : "text-[#d1d5db] hover:text-white"
                    }`}
                  >
                    <span>{lang.label}</span>
                    {selectedLanguage === lang.id && <Check className="w-3.5 h-3.5 text-[#00b2ea]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Direct Copy Summary Button */}
        <button
          onClick={handleCopy}
          className={`h-8 px-3 rounded-lg border font-semibold text-xs flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs ${
            copied
              ? "bg-[#3dbb6b]/15 border-[#3dbb6b]/40 text-[#3dbb6b]"
              : "bg-[#00b2ea]/15 hover:bg-[#00b2ea]/25 border-[#00b2ea]/40 text-[#00b2ea]"
          }`}
          title="Copy summary to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#3dbb6b] animate-in zoom-in-75 duration-150" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
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
