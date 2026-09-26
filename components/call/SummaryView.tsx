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
  Edit3,
  Flag,
  Link2,
  X,
  Save,
  AlertCircle,
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
  const [copiedLinkMs, setCopiedLinkMs] = useState<number | null>(null);
  const [generatedSummaries, setGeneratedSummaries] = useState<Record<string, SummaryContent>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Inline Edit State
  const [editingTarget, setEditingTarget] = useState<{
    type: "purpose" | "takeaway" | "bullet" | "next_step";
    index?: number;
    topicIndex?: number;
    text: string;
  } | null>(null);

  // Inaccuracy Flagging State
  const [flagTarget, setFlagTarget] = useState<{
    type: "takeaway" | "bullet" | "purpose" | "next_step";
    index?: number;
    topicIndex?: number;
    originalText: string;
    context?: string;
  } | null>(null);
  const [userCorrectionText, setUserCorrectionText] = useState("");
  const [isFixingWithAI, setIsFixingWithAI] = useState(false);

  // User feedback toast
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

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

  const currentSummary = mergedMap[selectedTemplate] || mergedMap["Enhanced"];

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

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

  // Persist updated summary to state and Supabase
  const persistSummaryUpdate = async (updated: SummaryContent, successMsg: string) => {
    setGeneratedSummaries((prev) => ({ ...prev, [selectedTemplate]: updated }));
    onUpdateSummary?.(selectedTemplate, updated);

    if (meetingId) {
      try {
        await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meetingId,
            template: selectedTemplate,
            action: "save_summary",
            updatedContent: updated,
          }),
        });
      } catch {
        // non-blocking
      }
    }
    showToast(successMsg);
  };

  // Handle Saving an Inline Edit
  const handleSaveInlineEdit = () => {
    if (!editingTarget || !currentSummary) return;

    const updated: SummaryContent = JSON.parse(JSON.stringify(currentSummary));

    if (editingTarget.type === "purpose") {
      updated.meeting_purpose = editingTarget.text;
    } else if (editingTarget.type === "takeaway" && editingTarget.index !== undefined) {
      updated.key_takeaways[editingTarget.index] = editingTarget.text;
    } else if (
      editingTarget.type === "bullet" &&
      editingTarget.topicIndex !== undefined &&
      editingTarget.index !== undefined
    ) {
      if (updated.topics && updated.topics[editingTarget.topicIndex]) {
        updated.topics[editingTarget.topicIndex].bullets[editingTarget.index] = editingTarget.text;
      }
    } else if (editingTarget.type === "next_step" && editingTarget.index !== undefined) {
      if (updated.next_steps) {
        updated.next_steps[editingTarget.index] = editingTarget.text;
      }
    }

    persistSummaryUpdate(updated, "✓ Edited & saved to database");
    setEditingTarget(null);
  };

  // Handle AI Fact-Correction with Gemini
  const handleFixWithAI = async () => {
    if (!flagTarget || !currentSummary || !meetingId || !userCorrectionText.trim()) return;

    setIsFixingWithAI(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingId,
          template: selectedTemplate,
          action: "correct_fact",
          originalBullet: flagTarget.originalText,
          userCorrection: userCorrectionText,
          context: flagTarget.context,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to correct fact");
      }

      const corrected = data.correctedBullet || userCorrectionText;
      const updated: SummaryContent = JSON.parse(JSON.stringify(currentSummary));

      if (flagTarget.type === "purpose") {
        updated.meeting_purpose = corrected;
      } else if (flagTarget.type === "takeaway" && flagTarget.index !== undefined) {
        updated.key_takeaways[flagTarget.index] = corrected;
      } else if (
        flagTarget.type === "bullet" &&
        flagTarget.topicIndex !== undefined &&
        flagTarget.index !== undefined
      ) {
        if (updated.topics && updated.topics[flagTarget.topicIndex]) {
          updated.topics[flagTarget.topicIndex].bullets[flagTarget.index] = corrected;
        }
      } else if (flagTarget.type === "next_step" && flagTarget.index !== undefined) {
        if (updated.next_steps) {
          updated.next_steps[flagTarget.index] = corrected;
        }
      }

      await persistSummaryUpdate(updated, "✨ Corrected by Gemini AI against transcript");
      setFlagTarget(null);
      setUserCorrectionText("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error correcting fact";
      showToast(`Fix failed: ${msg}`);
    } finally {
      setIsFixingWithAI(false);
    }
  };

  // Copy Deep Link to Moment
  const handleCopyMomentLink = (startMs: number) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/calls/${meetingId || ""}?t=${Math.floor(startMs / 1000)}`;
    navigator.clipboard.writeText(url);
    setCopiedLinkMs(startMs);
    setTimeout(() => setCopiedLinkMs(null), 2000);
    showToast(`🔗 Copied link to ${formatTimestamp(startMs)} to clipboard!`);
  };

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

  function formatTimestamp(ms?: number) {
    if (ms === undefined) return "0:00";
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0d14] p-6 space-y-6 overflow-y-auto select-text relative">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed top-20 right-8 z-50 px-4 py-2 rounded-xl bg-[#161c2c] border border-indigo-500/40 text-xs font-semibold text-white shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Template & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#101420] border border-white/6 sticky top-0 z-10 backdrop-blur-md">
        {/* Template Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {templates.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setSelectedTemplate(tmpl.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedTemplate === tmpl.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-white/4 text-slate-400 hover:text-white hover:bg-white/8"
              }`}
            >
              {tmpl.label}
            </button>
          ))}
        </div>

        {/* 1-Click Export Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySlack}
            title="Copy Slack Formatted"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/4 hover:bg-white/8 border border-white/6 text-xs text-slate-300 hover:text-white transition-all cursor-pointer font-medium"
          >
            {copiedSlack ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Slack</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyMarkdown}
            title="Copy Markdown"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/4 hover:bg-white/8 border border-white/6 text-xs text-slate-300 hover:text-white transition-all cursor-pointer font-medium"
          >
            {copiedMarkdown ? (
              <>
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-indigo-400">Copied</span>
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

      {/* Inline AI Fact-Correction Modal / Overlay */}
      {flagTarget && (
        <div className="p-4 rounded-2xl bg-[#161c2e] border border-amber-500/30 space-y-3 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <AlertCircle className="w-4 h-4" />
              <span>Flag Inaccurate Fact & Fix with Gemini AI</span>
            </div>
            <button
              onClick={() => setFlagTarget(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-black/30 border border-white/6 text-xs text-slate-400">
            <span className="text-slate-500 block text-[10px] font-bold uppercase mb-0.5">
              Current Statement:
            </span>
            <span className="italic text-slate-200">&quot;{flagTarget.originalText}&quot;</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300 block">
              What was wrong? (e.g. &quot;Launch date is Nov 18, not Dec 1&quot; or &quot;Price is $25k, not $50k&quot;)
            </label>
            <input
              type="text"
              autoFocus
              value={userCorrectionText}
              onChange={(e) => setUserCorrectionText(e.target.value)}
              placeholder="Type the accurate fact or number here..."
              className="w-full p-2.5 rounded-xl bg-[#0e121d] border border-white/10 focus:border-amber-400/60 text-xs text-white outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isFixingWithAI) handleFixWithAI();
              }}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setFlagTarget(null)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              disabled={isFixingWithAI || !userCorrectionText.trim()}
              onClick={handleFixWithAI}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              {isFixingWithAI ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Verifying with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  <span>Fix with Gemini</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

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
          <div className="p-5 rounded-2xl bg-[#111522] border border-white/6 shadow-sm group relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Meeting Purpose</span>
              </div>
              <button
                onClick={() =>
                  setEditingTarget({
                    type: "purpose",
                    text: currentSummary.meeting_purpose,
                  })
                }
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-opacity text-[10px] flex items-center gap-1 cursor-pointer"
                title="Edit Purpose"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            {editingTarget?.type === "purpose" ? (
              <div className="space-y-2 mt-2">
                <textarea
                  rows={2}
                  value={editingTarget.text}
                  onChange={(e) =>
                    setEditingTarget({ ...editingTarget, text: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#161c2c] border border-indigo-500/50 text-xs text-white outline-none resize-none"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setEditingTarget(null)}
                    className="px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveInlineEdit}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {currentSummary.meeting_purpose}
              </p>
            )}
          </div>

          {/* Key Takeaways Grid */}
          <div className="p-5 rounded-2xl bg-[#111522] border border-white/6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <span>Key Takeaways & Strategic Decisions</span>
            </h3>
            <div className="space-y-2.5">
              {currentSummary.key_takeaways.map((takeaway, idx) => {
                const isEditing =
                  editingTarget?.type === "takeaway" && editingTarget.index === idx;

                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 group/item p-2 rounded-xl hover:bg-white/2 transition-colors relative"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>

                    {isEditing ? (
                      <div className="flex-1 space-y-2">
                        <textarea
                          rows={2}
                          value={editingTarget.text}
                          onChange={(e) =>
                            setEditingTarget({ ...editingTarget, text: e.target.value })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#161c2c] border border-indigo-500/50 text-xs text-white outline-none resize-none"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingTarget(null)}
                            className="px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveInlineEdit}
                            className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-start justify-between gap-2">
                        <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                          {takeaway}
                        </p>

                        {/* Inline Actions: Edit + Flag Error */}
                        <div className="opacity-0 group-hover/item:opacity-100 flex items-center gap-1 shrink-0 transition-opacity">
                          <button
                            onClick={() =>
                              setEditingTarget({
                                type: "takeaway",
                                index: idx,
                                text: takeaway,
                              })
                            }
                            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                            title="Edit takeaway"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() =>
                              setFlagTarget({
                                type: "takeaway",
                                index: idx,
                                originalText: takeaway,
                                context: "Key Takeaways",
                              })
                            }
                            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-amber-400"
                            title="Flag incorrect fact / AI hallucination"
                          >
                            <Flag className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
                        <div className="flex items-center gap-1.5">
                          {/* Seek Button */}
                          <button
                            onClick={() => onSeek(topic.start_ms)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/20 font-mono text-[10px] transition-colors cursor-pointer"
                            title="Jump to audio moment"
                          >
                            <Clock className="w-2.5 h-2.5" />
                            <span>{formatTimestamp(topic.start_ms)}</span>
                          </button>

                          {/* Copy Moment Link */}
                          <button
                            onClick={() => handleCopyMomentLink(topic.start_ms)}
                            className="p-1 rounded bg-white/4 hover:bg-white/8 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Copy deep-link to this moment"
                          >
                            {copiedLinkMs === topic.start_ms ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Link2 className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    <ul className="space-y-2 pl-1">
                      {topic.bullets.map((bullet, bIdx) => {
                        const isEditing =
                          editingTarget?.type === "bullet" &&
                          editingTarget.topicIndex === tIdx &&
                          editingTarget.index === bIdx;

                        return (
                          <li
                            key={bIdx}
                            className="text-xs text-slate-300 group/bullet flex items-start gap-2 p-1 rounded hover:bg-white/2"
                          >
                            <span className="text-slate-500 shrink-0">•</span>

                            {isEditing ? (
                              <div className="flex-1 space-y-2">
                                <textarea
                                  rows={2}
                                  value={editingTarget.text}
                                  onChange={(e) =>
                                    setEditingTarget({
                                      ...editingTarget,
                                      text: e.target.value,
                                    })
                                  }
                                  className="w-full p-2 rounded-lg bg-[#161c2c] border border-indigo-500/50 text-xs text-white outline-none resize-none"
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setEditingTarget(null)}
                                    className="px-2 py-0.5 rounded text-xs text-slate-400 hover:text-white"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleSaveInlineEdit}
                                    className="px-2.5 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold flex items-center gap-1"
                                  >
                                    <Save className="w-3 h-3" />
                                    <span>Save</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1 flex items-start justify-between gap-2">
                                <span>{bullet}</span>
                                <div className="opacity-0 group-bullet:opacity-100 flex items-center gap-1 shrink-0 transition-opacity">
                                  <button
                                    onClick={() =>
                                      setEditingTarget({
                                        type: "bullet",
                                        topicIndex: tIdx,
                                        index: bIdx,
                                        text: bullet,
                                      })
                                    }
                                    className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                                    title="Edit bullet"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      setFlagTarget({
                                        type: "bullet",
                                        topicIndex: tIdx,
                                        index: bIdx,
                                        originalText: bullet,
                                        context: topic.title,
                                      })
                                    }
                                    className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-amber-400"
                                    title="Flag incorrect fact / AI hallucination"
                                  >
                                    <Flag className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </li>
                        );
                      })}
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
                {currentSummary.next_steps.map((step, sIdx) => {
                  const isEditing =
                    editingTarget?.type === "next_step" && editingTarget.index === sIdx;

                  return (
                    <li
                      key={sIdx}
                      className="text-xs text-slate-300 flex items-start gap-2.5 group/step p-1 rounded hover:bg-white/2"
                    >
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      {isEditing ? (
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={editingTarget.text}
                            onChange={(e) =>
                              setEditingTarget({ ...editingTarget, text: e.target.value })
                            }
                            className="w-full p-2 rounded-lg bg-[#161c2c] border border-indigo-500/50 text-xs text-white outline-none"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingTarget(null)}
                              className="px-2 py-0.5 rounded text-xs text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveInlineEdit}
                              className="px-2.5 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              <span>Save</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-start justify-between gap-2">
                          <span>{step}</span>
                          <div className="opacity-0 group-step:opacity-100 flex items-center gap-1 shrink-0 transition-opacity">
                            <button
                              onClick={() =>
                                setEditingTarget({
                                  type: "next_step",
                                  index: sIdx,
                                  text: step,
                                })
                              }
                              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                              title="Edit action step"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
