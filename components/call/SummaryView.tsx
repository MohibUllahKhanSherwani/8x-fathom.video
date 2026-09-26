"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Check,
  Copy,
  Loader2,
  Clock,
  ArrowRight,
  ListTodo,
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
  const [selectedLanguage] = useState("Auto");
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedSlack, setCopiedSlack] = useState(false);
  const [generatedSummaries, setGeneratedSummaries] = useState<Record<string, SummaryContent>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const templates = [
    { id: "Enhanced", label: "Executive Brief" },
    { id: "General", label: "General Summary" },
    { id: "Sales Discovery", label: "Sales & Client Discovery" },
    { id: "1-on-1", label: "1:1 Coaching Sync" },
  ];

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

  const handleCopyMarkdown = () => {
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
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handleCopySlack = () => {
    if (!currentSummary) return;

    let text = `*🎯 Meeting Purpose*\n${currentSummary.meeting_purpose}\n\n*⚡ Key Takeaways*\n`;
    text += currentSummary.key_takeaways.map((k) => `• ${k}`).join("\n");
    if (currentSummary.next_steps && currentSummary.next_steps.length > 0) {
      text += `\n\n*📋 Next Steps*\n` + currentSummary.next_steps.map((n) => `• ${n}`).join("\n");
    }

    navigator.clipboard.writeText(text);
    setCopiedSlack(true);
    setTimeout(() => setCopiedSlack(false), 2000);
  };

  const formatTimestamp = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl select-text">
      {/* Top Toolbar: Template Selector & Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/6">
        {/* Template Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#121622] border border-white/8 overflow-x-auto">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedTemplate === t.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Copy / Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySlack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Copy formatted for Slack"
          >
            {copiedSlack ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Slack Format</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-xs text-indigo-300 font-medium transition-all cursor-pointer"
          >
            {copiedMarkdown ? (
              <>
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Markdown</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generation Loading State */}
      {isGenerating && (
        <div className="p-8 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex flex-col items-center justify-center gap-2.5 text-indigo-300 text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          <span className="font-semibold">Synthesizing {selectedTemplate} summary with Gemini...</span>
          <span className="text-[11px] text-slate-400">Transcribing and extracting strategic decision points</span>
        </div>
      )}

      {/* Generation Error State */}
      {genError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <p className="font-semibold">Generation Error</p>
          <p className="mt-0.5">{genError}</p>
        </div>
      )}

      {/* Content Rendering */}
      {currentSummary && !isGenerating && (
        <div className="space-y-6">
          {/* Executive Purpose Card */}
          <div className="p-5 rounded-2xl bg-[#111522] border border-white/6 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Meeting Purpose</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {currentSummary.meeting_purpose}
            </p>
          </div>

          {/* Key Takeaways Grid */}
          <div className="p-5 rounded-2xl bg-[#111522] border border-white/6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <span>Key Takeaways & Strategic Decisions</span>
            </h3>
            <div className="space-y-2.5">
              {currentSummary.key_takeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                    {takeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Topics Breakdown */}
          {currentSummary.topics && currentSummary.topics.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#111522] border border-white/6 shadow-sm">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Discussion Topics Breakdown</span>
              </h3>
              <div className="space-y-4">
                {currentSummary.topics.map((topic, tIdx) => (
                  <div key={tIdx} className="p-4 rounded-xl bg-white/2 border border-white/4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-white">
                        {topic.title}
                      </h4>
                      {topic.start_ms !== undefined && (
                        <button
                          onClick={() => onSeek(topic.start_ms)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/20 font-mono text-[10px] transition-colors cursor-pointer"
                        >
                          <Clock className="w-2.5 h-2.5" />
                          <span>{formatTimestamp(topic.start_ms)}</span>
                        </button>
                      )}
                    </div>
                    <ul className="space-y-1.5 pl-1">
                      {topic.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-slate-500 shrink-0">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps / Forward Momentum */}
          {currentSummary.next_steps && currentSummary.next_steps.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#111522] border border-white/6 shadow-sm">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-amber-400" />
                <span>Next Steps & Immediate Actions</span>
              </h3>
              <ul className="space-y-2">
                {currentSummary.next_steps.map((step, sIdx) => (
                  <li key={sIdx} className="text-xs text-slate-300 flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
