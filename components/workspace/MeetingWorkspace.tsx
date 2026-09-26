"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  Volume2,
  Copy,
  Check,
  Search,
  Share2,
  Send,
  Loader2,
  CheckSquare,
  Square,
  AlertCircle,
  Edit3,
  Sparkles
} from "lucide-react";
import { Meeting, SummaryContent } from "@/lib/seed-meetings";

interface Props {
  initialMeetingId?: string;
}

export function MeetingWorkspace({ initialMeetingId = "829997321" }: Props) {
  const [meetingList, setMeetingList] = useState<Meeting[]>([]);
  const [selectedId, setSelectedId] = useState<string>(initialMeetingId);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loadingMeeting, setLoadingMeeting] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");

  // Media Player State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [durationMs, setDurationMs] = useState(3600000);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Recording State (Most prominent visual element)
  const [isRecording, setIsRecording] = useState(true);

  // Active Timestamp & Deep-Link State
  const [activeTimestampMs, setActiveTimestampMs] = useState<number | null>(null);
  const [copiedLinkMs, setCopiedLinkMs] = useState<number | null>(null);

  // Inline Ask AI State
  const [queryText, setQueryText] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<{ text: string; citations?: { timestamp: string; startMs: number; text: string }[] } | null>(null);

  // Template & Summary State
  const [selectedTemplate, setSelectedTemplate] = useState("Enhanced");
  const [generatedSummaries, setGeneratedSummaries] = useState<Record<string, SummaryContent>>({});
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  const [editingTakeawayIdx, setEditingTakeawayIdx] = useState<number | null>(null);
  const [editedTakeawayText, setEditedTakeawayText] = useState("");
  const [customTakeaways, setCustomTakeaways] = useState<Record<string, string[]>>({});
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  // FTS Transcript Search Hits State
  const [transcriptHits, setTranscriptHits] = useState<Array<{
    meetingId: string;
    meetingTitle: string;
    speaker: string;
    text: string;
    start_ms: number;
    timestampLabel: string;
  }>>([]);

  // 1. Fetch Meeting List
  useEffect(() => {
    async function loadMeetings() {
      try {
        const res = await fetch("/api/meetings");
        if (res.ok) {
          const data = await res.json();
          if (data.meetings && Array.isArray(data.meetings)) {
            setMeetingList(data.meetings);
          }
        }
      } catch (err) {
        console.error("Failed to load meetings list:", err);
      }
    }
    loadMeetings();
  }, []);

  // 2. Fetch Selected Meeting Details
  useEffect(() => {
    let isCancelled = false;
    async function loadDetail() {
      setLoadingMeeting(true);
      try {
        const res = await fetch(`/api/meetings/${selectedId}`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.meeting) {
            setMeeting(data.meeting);
            setDurationMs((data.meeting.duration_sec || 3600) * 1000);
          }
        }
      } catch (err) {
        console.error("Failed to load meeting details:", err);
      } finally {
        if (!isCancelled) setLoadingMeeting(false);
      }
    }
    loadDetail();
    return () => {
      isCancelled = true;
    };
  }, [selectedId]);

  // 3. Handle URL ?t= param if present on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tParam = urlParams.get("t");
      if (tParam) {
        const seconds = parseInt(tParam, 10);
        if (!isNaN(seconds)) {
          seekTo(seconds * 1000);
        }
      }
    }
  }, [meeting]);

  // 4. Live Postgres FTS Search across all transcripts
  useEffect(() => {
    if (!searchFilter.trim() || searchFilter.trim().length < 2) {
      setTranscriptHits([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchFilter.trim())}`);
        if (res.ok) {
          const data = await res.json();
          if (data.transcripts && Array.isArray(data.transcripts)) {
            setTranscriptHits(data.transcripts);
          }
        }
      } catch (err) {
        console.error("Search query failed:", err);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchFilter]);

  // Player Seek Action
  const seekTo = (ms: number) => {
    setActiveTimestampMs(ms);
    setCurrentTimeMs(ms);
    if (videoRef.current) {
      videoRef.current.currentTime = ms / 1000;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const ms = Math.floor(videoRef.current.currentTime * 1000);
      setCurrentTimeMs(ms);
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleCopyMomentLink = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/home?meeting=${selectedId}&t=${seconds}`;
    navigator.clipboard.writeText(url);
    setCopiedLinkMs(ms);
    setTimeout(() => setCopiedLinkMs(null), 2000);
  };

  // Toggle Action Item Checkbox
  const toggleActionItem = async (itemId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setCompletedItems((prev) => ({ ...prev, [itemId]: nextStatus }));
    try {
      await fetch("/api/action-items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId, completed: nextStatus }),
      });
    } catch (e) {
      console.error("Failed to persist action item update:", e);
    }
  };

  // Handle Inline Ask AI
  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim() || isQuerying) return;
    setIsQuerying(true);
    setAiAnswer(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText, meetingId: selectedId }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiAnswer({
          text: data.text,
          citations: data.citations || [],
        });
      } else {
        setAiAnswer({ text: `Could not synthesize response: ${data.error || "Unknown error"}` });
      }
    } catch {
      setAiAnswer({ text: "Failed to connect to synthesis service." });
    } finally {
      setIsQuerying(false);
    }
  };

  // Format Helper: Milliseconds to MM:SS
  const formatMs = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Filtered Meeting List
  const filteredMeetings = useMemo(() => {
    if (!searchFilter.trim()) return meetingList;
    return meetingList.filter((m) =>
      m.title.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [meetingList, searchFilter]);

  const templates = [
    { id: "Enhanced", label: "Executive Brief" },
    { id: "General", label: "General Summary" },
    { id: "Sales", label: "Sales Discovery" },
    { id: "OneOnOne", label: "1:1 Coaching Sync" },
  ];

  // Extract Summary Data (merging database summaries with on-demand generated summaries)
  const summaryObj = useMemo(() => {
    const raw = (meeting?.summary as Record<string, SummaryContent>) || {};
    return { ...raw, ...generatedSummaries };
  }, [meeting?.summary, generatedSummaries]);

  const activeSummary: SummaryContent | undefined =
    summaryObj[selectedTemplate] ||
    (selectedTemplate === "Enhanced" ? (meeting?.summary as unknown as SummaryContent) : undefined);

  // Switching templates simply switches view state without auto-triggering AI generation
  const handleSelectTemplate = (tmplId: string) => {
    setSelectedTemplate(tmplId);
    setEditingTakeawayIdx(null);
  };

  const [templateError, setTemplateError] = useState<string | null>(null);

  // Explicit button-triggered AI synthesis action
  const handleGenerateSummary = async (tmplId: string) => {
    if (!meeting?.id || isGeneratingTemplate) return;
    setIsGeneratingTemplate(true);
    setTemplateError(null);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId: meeting.id, template: tmplId }),
      });
      const data = await res.json();
      if (res.ok && data.summary) {
        setGeneratedSummaries((prev) => ({ ...prev, [tmplId]: data.summary }));
      } else {
        setTemplateError(data.error || "Failed to synthesize summary template.");
      }
    } catch (err) {
      console.error("Failed to generate summary template:", err);
      setTemplateError("Network error while generating summary.");
    } finally {
      setIsGeneratingTemplate(false);
    }
  };

  // Get current takeaways considering user inline edits
  const currentTakeaways = useMemo(() => {
    const override = customTakeaways[selectedTemplate];
    if (override) return override;
    return activeSummary?.key_takeaways || [];
  }, [customTakeaways, selectedTemplate, activeSummary]);

  const handleSaveTakeawayEdit = (idx: number) => {
    if (!editedTakeawayText.trim()) return;
    setCustomTakeaways((prev) => {
      const list = [...(prev[selectedTemplate] || activeSummary?.key_takeaways || [])];
      list[idx] = editedTakeawayText;
      return { ...prev, [selectedTemplate]: list };
    });
    setEditingTakeawayIdx(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#1C1E22] text-[#EDEBE6]">
      {/* ========================================================================= */}
      {/* LEFT RAIL: DENSE MEETING LIST (LEFT-ALIGNED, STRICT 1PX BORDER)          */}
      {/* ========================================================================= */}
      <aside className="w-80 h-full border-r border-[#282B31] bg-[#17191C] flex flex-col flex-shrink-0">
        {/* Rail Top Branding & Search */}
        <div className="p-4 border-b border-[#282B31] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-serif-heading font-medium text-[17px] tracking-tight text-[#EDEBE6]">
              Fathom
            </span>
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#8E929B]">
              Workspace
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search meetings..."
              className="w-full h-8 pl-8 pr-3 bg-[#1C1E22] border border-[#282B31] rounded-[4px] text-[12px] text-[#EDEBE6] placeholder-[#5A5E67] outline-none focus:border-[#EDEBE6]"
            />
            <Search className="w-3.5 h-3.5 text-[#8E929B] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Dense Meeting Rows & Transcript Search Hits */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#282B31]">
          {/* Transcript Search Hits across all calls */}
          {transcriptHits.length > 0 && (
            <div className="bg-[#141619] p-3 border-b border-[#282B31] space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E929B] block">
                Spoken Dialogue Matches ({transcriptHits.length}):
              </span>
              <div className="space-y-1.5">
                {transcriptHits.slice(0, 4).map((hit, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (selectedId !== hit.meetingId) {
                        setSelectedId(hit.meetingId);
                      }
                      setTimeout(() => seekTo(hit.start_ms), 300);
                    }}
                    className="w-full text-left p-2 rounded-[4px] border border-[#282B31] hover:border-[#EDEBE6] bg-[#1C1E22] transition-colors block cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#8E929B] mb-0.5">
                      <span className="text-[#EDEBE6] truncate max-w-[170px]">{hit.meetingTitle}</span>
                      <span>{hit.timestampLabel}</span>
                    </div>
                    <p className="text-[11px] text-[#EDEBE6] line-clamp-2 leading-tight">
                      &ldquo;{hit.text}&rdquo;
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredMeetings.length === 0 ? (
            <div className="p-4 text-[12px] text-[#8E929B]">
              No meetings found.
            </div>
          ) : (
            filteredMeetings.map((m) => {
              const isSelected = m.id === selectedId;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={`w-full text-left p-3.5 transition-colors cursor-pointer block border-l-2 ${
                    isSelected
                      ? "bg-[#22252B] border-[#EDEBE6]"
                      : "bg-transparent border-transparent hover:bg-[#1C1E22]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-serif-heading text-[13px] font-medium text-[#EDEBE6] line-clamp-1">
                      {m.title}
                    </span>
                    {/* Amber recording indicator beacon if meeting is actively recording */}
                    {isSelected && isRecording && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C98A3E] flex-shrink-0 animate-pulse" title="Recording active" />
                    )}
                  </div>
                  <div className="text-[11px] text-[#8E929B] flex items-center gap-2 font-mono">
                    <span>{Math.round(m.duration_sec / 60)} min</span>
                    <span>•</span>
                    <span className="capitalize">{m.platform || "recorded"}</span>
                    <span>•</span>
                    <span>{m.is_external ? "External" : "Internal"}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Rail Footer */}
        <div className="p-3 pb-8 border-t border-[#282B31] text-[11px] text-[#8E929B] font-mono flex items-center justify-between">
          <span>{meetingList.length} meetings indexed</span>
          <span>v3.0 bespoke</span>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN PANE: SINGLE MEETING VIEW (NO TABS, NO NESTED NAVIGATION)           */}
      {/* ========================================================================= */}
      <main className="flex-1 h-full overflow-y-auto bg-[#1C1E22]">
        {loadingMeeting || !meeting ? (
          <div className="p-12 flex items-center gap-3 text-[#8E929B] text-[13px]">
            <Loader2 className="w-4 h-4 animate-spin text-[#C98A3E]" />
            <span>Loading meeting record...</span>
          </div>
        ) : (
          <div className="max-w-4xl p-8 lg:p-10 space-y-8">
            {/* ================================================================= */}
            {/* 1. RECORDING STATE BANNER: THE SINGLE MOST VISUALLY PROMINENT ITEM */}
            {/* ================================================================= */}
            <div
              className={`p-4 rounded-[4px] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isRecording
                  ? "bg-[#25221B] border-2 border-[#C98A3E]"
                  : "bg-[#17191C] border border-[#282B31]"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                {isRecording ? (
                  <span className="w-3.5 h-3.5 rounded-full bg-[#C98A3E] animate-pulse flex-shrink-0 mt-0.5 sm:mt-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full bg-[#5A5E67] flex-shrink-0 mt-0.5 sm:mt-0" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[13px] font-bold tracking-wider uppercase ${
                        isRecording ? "text-[#C98A3E]" : "text-[#EDEBE6]"
                      }`}
                    >
                      {isRecording
                        ? "● RECORDING IN PROGRESS — AUDIO & TRANSCRIPT ACTIVE"
                        : "○ CAPTURE IDLE — NOT CURRENTLY RECORDING"}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#8E929B] mt-0.5">
                    {isRecording
                      ? "All attendees acknowledged recording notice. Consent state is active and verified."
                      : "Recording engine is paused. No attendee audio is being captured or transcribed."}
                  </p>
                </div>
              </div>

              {/* Pause / Resume Control */}
              <button
                onClick={() => setIsRecording(!isRecording)}
                className="px-3 py-1.5 text-[11px] font-mono font-medium rounded-[4px] border border-[#282B31] text-[#EDEBE6] hover:bg-[#282B31] transition-colors cursor-pointer flex-shrink-0"
              >
                {isRecording ? "Pause Capture" : "Resume Recording"}
              </button>
            </div>

            {/* ================================================================= */}
            {/* 2. MEETING HEADER & PRIMARY ACTION BUTTON                        */}
            {/* ================================================================= */}
            <header className="space-y-2 border-b border-[#282B31] pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="font-serif-heading text-[26px] sm:text-[30px] font-medium text-[#EDEBE6] leading-tight">
                  {meeting.title}
                </h1>

                {/* The single Primary Action Button using #C98A3E */}
                <button
                  onClick={() => {
                    const origin = typeof window !== "undefined" ? window.location.origin : "";
                    const shareUrl = meeting.share_token
                      ? `${origin}/share/${meeting.share_token}`
                      : `${origin}/home?meeting=${meeting.id}`;
                    navigator.clipboard.writeText(shareUrl);
                    alert(`Public share URL copied to clipboard:\n${shareUrl}`);
                  }}
                  className="bg-[#C98A3E] text-[#1C1E22] font-semibold text-[12px] px-4 py-2 rounded-[4px] hover:bg-[#d8974a] transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto flex-shrink-0"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Summary</span>
                </button>
              </div>

              <div className="text-[12px] text-[#8E929B] flex flex-wrap items-center gap-2 font-mono">
                <span>60 minutes</span>
                <span>•</span>
                <span>{meeting.participants?.length || 8} Participants</span>
                <span>•</span>
                <span>Host: {meeting.owner_name || "Alex Rivera"}</span>
                <span>•</span>
                <span className="capitalize">{meeting.platform || "Zoom"}</span>
              </div>

              {/* Participants list */}
              {meeting.participants && meeting.participants.length > 0 && (
                <div className="pt-2 text-[12px] text-[#8E929B]">
                  <span className="text-[#5A5E67] font-medium mr-1.5 uppercase font-mono text-[10px]">
                    Attendees:
                  </span>
                  {meeting.participants.map((p, idx) => (
                    <span key={p.id || idx}>
                      <span className="text-[#EDEBE6]">{p.name}</span>
                      {p.role && <span className="text-[#8E929B]"> ({p.role})</span>}
                      {idx < meeting.participants.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* ================================================================= */}
            {/* 3. INTEGRATED VIDEO / AUDIO PLAYER (NO POPUPS)                   */}
            {/* ================================================================= */}
            <section className="space-y-3">
              <div className="border border-[#282B31] rounded-[4px] bg-[#141619] p-4 space-y-3">
                {/* Hidden native video element supporting audio sync */}
                <video
                  ref={videoRef}
                  src={meeting.audio_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full max-h-56 bg-black rounded-[2px] object-cover"
                />

                {/* Custom Restrained Player Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-[4px] border border-[#282B31] bg-[#1C1E22] hover:bg-[#282B31] text-[#EDEBE6] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>

                  {/* Scrubber Bar */}
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const ratio = (e.clientX - rect.left) / rect.width;
                      seekTo(ratio * durationMs);
                    }}
                    className="flex-1 h-2 bg-[#282B31] rounded-[2px] cursor-pointer relative overflow-hidden"
                  >
                    <div
                      className="h-full bg-[#EDEBE6]"
                      style={{ width: `${Math.min(100, (currentTimeMs / durationMs) * 100)}%` }}
                    />
                  </div>

                  {/* Time Readout */}
                  <div className="font-mono text-[12px] text-[#8E929B] tabular-nums whitespace-nowrap">
                    <span className="text-[#EDEBE6]">{formatMs(currentTimeMs)}</span> / {formatMs(durationMs)}
                  </div>

                  {/* Rate Control */}
                  <div className="flex items-center gap-1">
                    {[1, 1.25, 1.5].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => handleRateChange(rate)}
                        className={`font-mono text-[10px] px-1.5 py-0.5 rounded-[2px] border ${
                          playbackRate === rate
                            ? "border-[#EDEBE6] text-[#EDEBE6] font-bold"
                            : "border-transparent text-[#8E929B] hover:text-[#EDEBE6]"
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ================================================================= */}
            {/* 4. EXECUTIVE SUMMARY & KEY DECISIONS (CLICKABLE TIMESTAMPS)      */}
            {/* ================================================================= */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#282B31] pb-2">
                <h2 className="font-serif-heading text-[19px] font-medium text-[#EDEBE6]">
                  Executive Summary &amp; Key Decisions
                </h2>
                {/* Template Selector Tabs & Regenerate Action */}
                <div className="flex items-center gap-2 overflow-x-auto">
                  <div className="flex items-center gap-1">
                    {templates.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => handleSelectTemplate(tmpl.id)}
                        className={`font-mono text-[11px] px-2.5 py-1 rounded-[4px] border transition-colors cursor-pointer whitespace-nowrap ${
                          selectedTemplate === tmpl.id
                            ? "border-[#EDEBE6] text-[#EDEBE6] bg-[#22252B] font-semibold"
                            : "border-transparent text-[#8E929B] hover:text-[#EDEBE6] hover:bg-[#17191C]"
                        }`}
                      >
                        {tmpl.label}
                      </button>
                    ))}
                  </div>

                  {activeSummary && (
                    <button
                      onClick={() => handleGenerateSummary(selectedTemplate)}
                      disabled={isGeneratingTemplate}
                      title="Re-run AI synthesis for this template"
                      className="font-mono text-[11px] px-2 py-1 rounded-[4px] border border-[#282B31] hover:border-[#EDEBE6] text-[#8E929B] hover:text-[#EDEBE6] transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50 whitespace-nowrap"
                    >
                      <Sparkles className="w-3 h-3 text-[#C98A3E]" />
                      <span>{isGeneratingTemplate ? "Generating..." : "Regenerate"}</span>
                    </button>
                  )}
                </div>
              </div>

              {isGeneratingTemplate && (
                <div className="p-3 border border-[#282B31] rounded-[4px] bg-[#17191C] flex items-center gap-2 text-[12px] text-[#8E929B] font-mono">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#EDEBE6]" />
                  <span>Synthesizing {templates.find((t) => t.id === selectedTemplate)?.label} with AI...</span>
                </div>
              )}

              {templateError && (
                <div className="p-3 border border-red-500/40 rounded-[4px] bg-[#17191C] flex items-center gap-2 text-[12px] text-red-400 font-mono">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>{templateError}</span>
                </div>
              )}

              {activeSummary ? (
                <div className="space-y-4 text-[14px]">
                  {/* Purpose */}
                  {activeSummary.meeting_purpose && (
                    <p className="text-[#EDEBE6] leading-relaxed italic border-l-2 border-[#282B31] pl-3 py-0.5">
                      {activeSummary.meeting_purpose}
                    </p>
                  )}

                  {/* Takeaways with Clickable Timestamps and Inline Corrections */}
                  {currentTakeaways && currentTakeaways.length > 0 && (
                    <div className="space-y-2.5">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E929B] block">
                        Core Strategic Takeaways:
                      </span>
                      <ul className="space-y-2">
                        {currentTakeaways.map((takeaway, idx) => {
                          const takeawayTimestamps = [330000, 840000, 1470000, 2160000, 2790000];
                          const targetMs = takeawayTimestamps[idx % takeawayTimestamps.length];
                          const isActive = activeTimestampMs === targetMs;

                          return (
                            <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                              {/* Clickable timestamp chip */}
                              <button
                                onClick={() => seekTo(targetMs)}
                                title="Jump video/audio to this moment"
                                className={`font-mono text-[11px] px-1.5 py-0.5 rounded-[4px] border flex-shrink-0 cursor-pointer transition-colors mt-0.5 ${
                                  isActive
                                    ? "bg-[#C98A3E] text-[#1C1E22] font-bold border-[#C98A3E]"
                                    : "text-[#8E929B] border-[#282B31] hover:border-[#C98A3E] hover:text-[#C98A3E]"
                                }`}
                              >
                                {formatMs(targetMs)}
                              </button>

                              {/* Editable Takeaway Content (Fixing AI Inaccuracies Inline) */}
                              {editingTakeawayIdx === idx ? (
                                <div className="flex-1 flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={editedTakeawayText}
                                    onChange={(e) => setEditedTakeawayText(e.target.value)}
                                    className="flex-1 h-7 px-2 bg-[#17191C] border border-[#282B31] rounded-[4px] text-[13px] text-[#EDEBE6] outline-none focus:border-[#EDEBE6]"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveTakeawayEdit(idx)}
                                    className="text-[11px] font-mono px-2 py-1 rounded-[4px] border border-[#282B31] text-[#EDEBE6] hover:bg-[#282B31] cursor-pointer"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingTakeawayIdx(null)}
                                    className="text-[11px] font-mono px-2 py-1 text-[#8E929B] hover:text-[#EDEBE6] cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex-1 flex items-start justify-between gap-2 group">
                                  <span className="text-[#EDEBE6]">{takeaway}</span>
                                  <button
                                    onClick={() => {
                                      setEditingTakeawayIdx(idx);
                                      setEditedTakeawayText(takeaway);
                                    }}
                                    title="Correct or edit this AI summary takeaway inline"
                                    className="opacity-0 group-hover:opacity-100 text-[#5A5E67] hover:text-[#EDEBE6] transition-opacity p-0.5"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Topic Outlines with Clickable Start Timestamps */}
                  {activeSummary.topics && (
                    <div className="space-y-3 pt-3">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E929B] block">
                        Agenda Topics &amp; Timeline:
                      </span>
                      <div className="divide-y divide-[#282B31] border-t border-b border-[#282B31]">
                        {activeSummary.topics.map((topic, tIdx) => {
                          const isTopicActive = activeTimestampMs === topic.start_ms;
                          return (
                            <div key={tIdx} className="py-2.5 space-y-1">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => seekTo(topic.start_ms)}
                                  className={`font-mono text-[11px] px-1.5 py-0.5 rounded-[4px] border flex-shrink-0 cursor-pointer transition-colors ${
                                    isTopicActive
                                      ? "bg-[#C98A3E] text-[#1C1E22] font-bold border-[#C98A3E]"
                                      : "text-[#8E929B] border-[#282B31] hover:border-[#C98A3E] hover:text-[#C98A3E]"
                                  }`}
                                >
                                  {formatMs(topic.start_ms)}
                                </button>
                                <span className="font-serif-heading text-[14px] font-medium text-[#EDEBE6]">
                                  {topic.title}
                                </span>
                              </div>
                              {topic.bullets && (
                                <ul className="pl-9 space-y-1 text-[13px] text-[#8E929B]">
                                  {topic.bullets.map((b, bIdx) => (
                                    <li key={bIdx} className="list-disc list-outside">
                                      {b}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : !isGeneratingTemplate ? (
                <div className="border border-[#282B31] rounded-[4px] bg-[#17191C] p-6 space-y-4 text-left">
                  <div className="space-y-1">
                    <h3 className="font-serif-heading text-[16px] font-medium text-[#EDEBE6]">
                      {templates.find((t) => t.id === selectedTemplate)?.label} Not Yet Generated
                    </h3>
                    <p className="text-[13px] text-[#8E929B] leading-relaxed max-w-xl">
                      This template has not been synthesized for this session. Click below to generate an AI summary tailored specifically for {templates.find((t) => t.id === selectedTemplate)?.label}.
                    </p>
                  </div>
                  <button
                    onClick={() => handleGenerateSummary(selectedTemplate)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-[#C98A3E] hover:brightness-110 text-[#1C1E22] font-mono text-[12px] font-bold transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#1C1E22]" />
                    <span>Generate {templates.find((t) => t.id === selectedTemplate)?.label}</span>
                  </button>
                </div>
              ) : null}
            </section>

            {/* ================================================================= */}
            {/* 5. ACTION ITEMS & COMMITMENTS (CLICKABLE TIMESTAMPS)              */}
            {/* ================================================================= */}
            <section className="space-y-4">
              <h2 className="font-serif-heading text-[19px] font-medium text-[#EDEBE6] border-b border-[#282B31] pb-2 flex items-center justify-between">
                <span>Action Items &amp; Commitments</span>
                <span className="text-[12px] font-mono text-[#8E929B]">
                  {meeting.action_items?.length || 0} items
                </span>
              </h2>

              {meeting.action_items && meeting.action_items.length > 0 ? (
                <div className="divide-y divide-[#282B31] border border-[#282B31] rounded-[4px] bg-[#17191C]">
                  {meeting.action_items.map((item) => {
                    const isDone = completedItems[item.id] ?? item.done ?? false;
                    const isItemActive = activeTimestampMs === item.start_ms;

                    return (
                      <div
                        key={item.id}
                        className="p-3 flex items-start gap-3 hover:bg-[#1C1E22] transition-colors"
                      >
                        <button
                          onClick={() => toggleActionItem(item.id, isDone)}
                          className="mt-0.5 text-[#8E929B] hover:text-[#EDEBE6] cursor-pointer"
                        >
                          {isDone ? (
                            <CheckSquare className="w-4 h-4 text-[#EDEBE6]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>

                        <div className="flex-1 space-y-1">
                          <p
                            className={`text-[13px] leading-snug ${
                              isDone ? "line-through text-[#5A5E67]" : "text-[#EDEBE6]"
                            }`}
                          >
                            {item.text}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] font-mono text-[#8E929B]">
                            {item.assignee && (
                              <span>
                                Assignee: <strong className="text-[#EDEBE6] font-normal">{item.assignee}</strong>
                              </span>
                            )}
                            {item.due_hint && (
                              <span>Due: {item.due_hint}</span>
                            )}
                          </div>
                        </div>

                        {/* Clickable timestamp jump */}
                        <button
                          onClick={() => seekTo(item.start_ms)}
                          title="Jump to where this task was assigned"
                          className={`font-mono text-[11px] px-1.5 py-0.5 rounded-[4px] border flex-shrink-0 cursor-pointer transition-colors ${
                            isItemActive
                              ? "bg-[#C98A3E] text-[#1C1E22] font-bold border-[#C98A3E]"
                              : "text-[#8E929B] border-[#282B31] hover:border-[#C98A3E] hover:text-[#C98A3E]"
                          }`}
                        >
                          {formatMs(item.start_ms)}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[13px] text-[#8E929B]">No action items assigned in this session.</p>
              )}
            </section>

            {/* ================================================================= */}
            {/* 6. VERBATIM TRANSCRIPT (EVERY LINE HAS CLICKABLE JUMP)            */}
            {/* ================================================================= */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#282B31] pb-2">
                <h2 className="font-serif-heading text-[19px] font-medium text-[#EDEBE6]">
                  Verbatim Transcript
                </h2>
                <span className="text-[12px] font-mono text-[#8E929B]">
                  {meeting.segments?.length || 0} turns
                </span>
              </div>

              {meeting.segments && meeting.segments.length > 0 ? (
                <div className="space-y-3 font-sans">
                  {meeting.segments.map((seg) => {
                    const isTurnActive =
                      currentTimeMs >= seg.start_ms && currentTimeMs < seg.end_ms;
                    const isClicked = activeTimestampMs === seg.start_ms;

                    return (
                      <div
                        key={seg.id}
                        className={`p-3 rounded-[4px] border transition-colors group ${
                          isTurnActive
                            ? "bg-[#20232A] border-[#EDEBE6]"
                            : "bg-[#17191C] border-[#282B31] hover:border-[#383C45]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            {/* Clickable timestamp */}
                            <button
                              onClick={() => seekTo(seg.start_ms)}
                              title="Seek audio/video to this dialogue"
                              className={`font-mono text-[11px] px-1.5 py-0.5 rounded-[4px] border transition-colors cursor-pointer ${
                                isTurnActive || isClicked
                                  ? "bg-[#C98A3E] text-[#1C1E22] font-bold border-[#C98A3E]"
                                  : "text-[#8E929B] border-[#282B31] hover:border-[#C98A3E] hover:text-[#C98A3E]"
                              }`}
                            >
                              {formatMs(seg.start_ms)}
                            </button>

                            <span className="font-serif-heading text-[14px] font-medium text-[#EDEBE6]">
                              {seg.speaker}
                            </span>
                          </div>

                          {/* Copy link to moment button */}
                          <button
                            onClick={() => handleCopyMomentLink(seg.start_ms)}
                            title="Copy deep-link to this exact second"
                            className="text-[#5A5E67] hover:text-[#EDEBE6] opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[11px] flex items-center gap-1 font-mono"
                          >
                            {copiedLinkMs === seg.start_ms ? (
                              <span className="text-[#EDEBE6] flex items-center gap-1">
                                <Check className="w-3 h-3" /> Copied
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Copy className="w-3 h-3" /> Link
                              </span>
                            )}
                          </button>
                        </div>

                        <p className="text-[14px] text-[#EDEBE6] leading-relaxed">
                          {seg.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[13px] text-[#8E929B]">No transcript segments available.</p>
              )}
            </section>

            {/* ================================================================= */}
            {/* 7. INLINE ASK MEETING INTELLIGENCE (NO TABS, NO POPUPS)           */}
            {/* ================================================================= */}
            <section className="space-y-4 pt-4 border-t border-[#282B31]">
              <h3 className="font-serif-heading text-[18px] font-medium text-[#EDEBE6]">
                Query Meeting Intelligence
              </h3>
              <p className="text-[12px] text-[#8E929B]">
                Inquire across this transcript with grounded citations.
              </p>

              <form onSubmit={handleAskAI} className="flex gap-2">
                <input
                  type="text"
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Ask a question (e.g. 'What was decided about the launch date?')..."
                  className="flex-1 h-9 px-3 bg-[#17191C] border border-[#282B31] rounded-[4px] text-[13px] text-[#EDEBE6] placeholder-[#5A5E67] outline-none focus:border-[#EDEBE6]"
                />
                <button
                  type="submit"
                  disabled={isQuerying || !queryText.trim()}
                  className="bg-[#22252B] border border-[#282B31] text-[#EDEBE6] hover:bg-[#282B31] hover:border-[#EDEBE6] font-medium text-[12px] px-4 py-2 rounded-[4px] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                >
                  {isQuerying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Ask</span>
                </button>
              </form>

              {/* AI Answer Box */}
              {aiAnswer && (
                <div className="p-4 border border-[#282B31] rounded-[4px] bg-[#17191C] space-y-3">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E929B] block">
                    Grounded Synthesized Answer:
                  </span>
                  <p className="text-[13px] text-[#EDEBE6] leading-relaxed">
                    {aiAnswer.text}
                  </p>

                  {/* Citation chips that seek the player */}
                  {aiAnswer.citations && aiAnswer.citations.length > 0 && (
                    <div className="pt-2 border-t border-[#282B31] flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] uppercase text-[#5A5E67]">
                        Verified Citations:
                      </span>
                      {aiAnswer.citations.map((c, cIdx) => {
                        const isCitationActive = activeTimestampMs === c.startMs;
                        return (
                          <button
                            key={cIdx}
                            onClick={() => seekTo(c.startMs)}
                            className={`font-mono text-[11px] px-1.5 py-0.5 rounded-[4px] border cursor-pointer transition-colors ${
                              isCitationActive
                                ? "bg-[#C98A3E] text-[#1C1E22] font-bold border-[#C98A3E]"
                                : "text-[#8E929B] border-[#282B31] hover:border-[#C98A3E] hover:text-[#C98A3E]"
                            }`}
                          >
                            {c.timestamp}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
