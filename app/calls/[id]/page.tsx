"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { TopBar } from "@/components/shell/TopBar";
import { VideoPlayer } from "@/components/call/VideoPlayer";
import { SpeakerStage } from "@/components/call/SpeakerStage";
import { SummaryView } from "@/components/call/SummaryView";
import { TranscriptView } from "@/components/call/TranscriptView";
import { AskFathomView } from "@/components/call/AskFathomView";
import { ActionItemsView } from "@/components/call/ActionItemsView";
import { ShareModal } from "@/components/call/ShareModal";
import { Meeting, ActionItem } from "@/lib/seed-meetings";
import {
  Share2,
  Download,
  ArrowLeft,
  Loader2,
  FileText,
  AlignLeft,
  Sparkles,
  LayoutGrid,
  ShieldCheck,
  Pause,
  Play,
  Trash2,
  Check,
  Eye,
  Clock,
} from "lucide-react";

interface CallPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ t?: string; tab?: string }>;
}

export default function CallPage({ params, searchParams }: CallPageProps) {
  const resolvedParams = use(params);
  const resolvedSearchParams = searchParams ? use(searchParams) : undefined;
  const meetingId = resolvedParams.id;
  
  // Parse and normalize t (seconds vs ms)
  const rawT = resolvedSearchParams?.t ? parseInt(resolvedSearchParams.t, 10) : 0;
  const initialTimestamp = rawT > 0 && rawT < 10000 ? rawT * 1000 : rawT;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View modes: 'briefing', 'studio', 'transcript'
  const [viewMode, setViewMode] = useState<"briefing" | "studio" | "transcript">("briefing");
  const [studioTab, setStudioTab] = useState<"transcript" | "summary" | "ask">("transcript");
  
  // Calm Mode for decluttered, zen reading
  const [calmMode, setCalmMode] = useState(false);

  // Recording Transparency & Consent State
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);
  const [sessionPurged, setSessionPurged] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(initialTimestamp);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedSpeakerFilter, setSelectedSpeakerFilter] = useState<string | null>(null);

  // Local state for action items & highlights
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [highlights, setHighlights] = useState<Array<{ id: string; start_ms: number; end_ms?: number; note?: string }>>([]);

  // Fetch meeting dynamically from database
  useEffect(() => {
    let isCancelled = false;
    async function loadMeeting() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/meetings/${meetingId}`);
        if (!res.ok) {
          throw new Error(`Failed to load meeting: ${res.statusText}`);
        }
        const data = await res.json();
        if (!isCancelled) {
          if (data.meeting) {
            setMeeting(data.meeting);
            setActionItems(data.meeting.action_items || []);
            if (data.meeting.highlights && data.meeting.highlights.length > 0) {
              setHighlights(data.meeting.highlights);
            } else if (meetingId === "829997321") {
              setHighlights([
                { id: "h1", start_ms: 870000, end_ms: 960000, note: "Launch date decision (Nov 18)" },
                { id: "h2", start_ms: 1470000, end_ms: 1560000, note: "Carlos owns pricing decision" },
              ]);
            } else {
              setHighlights([]);
            }
          } else {
            setError("Call not found in database.");
          }
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const msg = err instanceof Error ? err.message : "Error fetching meeting details";
          setError(msg);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadMeeting();
    return () => {
      isCancelled = true;
    };
  }, [meetingId]);

  const maxSegmentEndMs = meeting?.segments?.reduce((max, s) => Math.max(max, s.end_ms), 0) || 0;
  const maxHighlightEndMs = highlights?.reduce((max, h) => Math.max(max, h.end_ms || h.start_ms), 0) || 0;
  const durationMs = Math.max((meeting?.duration_sec || 0) * 1000, maxSegmentEndMs, maxHighlightEndMs);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Seek to initial timestamp if provided
  useEffect(() => {
    if (initialTimestamp > 0 && audioRef.current) {
      try {
        audioRef.current.currentTime = initialTimestamp / 1000;
        setCurrentTimeMs(initialTimestamp);
        setViewMode("studio");
        setStudioTab("transcript");
      } catch {
        // ignore
      }
    }
  }, [initialTimestamp]);

  // Find active speaker based on current time
  const activeSpeakerName = (() => {
    if (!meeting?.segments) return null;
    const currentSegment = meeting.segments.find(
      (s) => currentTimeMs >= s.start_ms && currentTimeMs <= s.end_ms
    );
    return currentSegment ? currentSegment.speaker : null;
  })();

  // Handle Play/Pause
  const handlePlayPause = () => {
    if (isRecordingPaused && !isPlaying) {
      alert("Recording is currently paused by host. Resume recording to listen to live audio.");
      return;
    }

    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (currentTimeMs >= durationMs && durationMs > 0) {
        setCurrentTimeMs(0);
        if (audioRef.current) {
          try {
            audioRef.current.currentTime = 0;
          } catch {
            // ignore
          }
        }
      }
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // auto-play restriction fallback
        });
      }
      setIsPlaying(true);
    }
  };

  // Handle Seek
  const handleSeek = (ms: number) => {
    const clampedMs = Math.max(0, Math.min(ms, durationMs || ms));
    setCurrentTimeMs(clampedMs);
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = clampedMs / 1000;
      } catch {
        // ignore
      }
    }
  };

  // Handle Playback Rate Change
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // Synchronize audio clock ticker
  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      const deltaMs = (now - lastTime) * playbackRate;
      lastTime = now;

      setCurrentTimeMs((prevMs) => {
        const audio = audioRef.current;
        if (audio && !audio.paused && !audio.ended && audio.currentTime > 0) {
          const audioMs = Math.round(audio.currentTime * 1000);
          if (audioMs > 0 && Math.abs(audioMs - prevMs) < 2000) {
            return Math.min(audioMs, durationMs);
          }
        }
        const nextMs = prevMs + deltaMs;
        if (durationMs > 0 && nextMs >= durationMs) {
          setIsPlaying(false);
          if (audio) audio.pause();
          return durationMs;
        }
        return nextMs;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, playbackRate, durationMs]);

  // Action item handlers
  const handleToggleDone = async (id: string) => {
    const item = actionItems.find((a) => a.id === id);
    const newDone = !item?.done;
    setActionItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, done: newDone } : it))
    );
    try {
      await fetch("/api/action-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_done", id, done: newDone }),
      });
    } catch (e) {
      console.error("Failed to persist action item done state:", e);
    }
  };

  const handleAddManualItem = async (text: string, assignee: string) => {
    const tempId = `manual-${Date.now()}`;
    const newItem: ActionItem = {
      id: tempId,
      text,
      assignee,
      start_ms: currentTimeMs,
      due_hint: "Upcoming",
      source: "manual",
      done: false,
    };
    setActionItems((prev) => [newItem, ...prev]);

    try {
      const res = await fetch("/api/action-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          meeting_id: meetingId,
          text,
          assignee,
          start_ms: currentTimeMs,
          source: "manual",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.item?.id) {
          setActionItems((prev) =>
            prev.map((it) => (it.id === tempId ? { ...it, id: data.item.id } : it))
          );
        }
      }
    } catch (e) {
      console.error("Failed to persist new action item:", e);
    }
  };

  const handleAddHighlight = (start_ms: number, end_ms: number) => {
    const newHl = {
      id: `hl-${Date.now()}`,
      start_ms,
      end_ms,
      note: `Highlight at ${Math.floor(start_ms / 60000)}:${Math.floor((start_ms % 60000) / 1000)}`,
    };
    setHighlights((prev) => [...prev, newHl]);
  };

  const handleDeleteHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  const handleDownloadTranscript = () => {
    if (!meeting?.segments) return;
    const text = meeting.segments
      .map((s) => {
        const m = Math.floor(s.start_ms / 60000);
        const sec = Math.floor((s.start_ms % 60000) / 1000);
        const time = `${m}:${sec.toString().padStart(2, "0")}`;
        return `[${time}] ${s.speaker}: ${s.text}`;
      })
      .join("\n\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${meeting.title.replace(/[^a-zA-Z0-9_-]/g, "_")}_transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  function formatTime(ms: number) {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex flex-col select-none">
        <TopBar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">
            Loading Meeting Intelligence...
          </p>
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex flex-col select-none">
        <TopBar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <ArrowLeft className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Meeting Unavailable</h2>
          <p className="text-xs text-slate-400 max-w-md">
            {error || "We could not find the requested call in the database."}
          </p>
          <Link
            href="/home"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0f] flex flex-col select-none text-slate-100">
      <TopBar />

      {/* Hidden Audio Driver */}
      <audio
        ref={audioRef}
        src={meeting.audio_url}
        preload="metadata"
      />

      {/* Recording Purged Notice Banner */}
      {sessionPurged && (
        <div className="bg-rose-950/80 border-b border-rose-500/30 px-6 py-2.5 text-center text-xs text-rose-200 flex items-center justify-center gap-2">
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span>Recording session purged per host privacy request. Transcript sync and storage halted.</span>
        </div>
      )}

      {/* Meeting Intelligence Header */}
      <div className="border-b border-white/6 bg-[#0c0f17]/90 px-6 py-4 sticky top-16 z-20 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Back & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/home"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
              title="Back to all calls"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-[10px] font-mono text-slate-400">
                  {meeting.platform || "Zoom"}
                </span>
                <span className="text-[11px] text-slate-400">
                  {Math.round(meeting.duration_sec / 60)} mins
                </span>
                {meeting.id === "829997321" && (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-[10px] font-bold text-indigo-300">
                    STAR CALL
                  </span>
                )}
              </div>
              <h1 className="text-base md:text-lg font-bold text-white truncate">
                {meeting.title}
              </h1>
            </div>
          </div>

          {/* Center: View Mode Switcher Pills */}
          <div className="flex items-center p-1 rounded-xl bg-[#131724] border border-white/8 text-xs self-start md:self-center">
            <button
              onClick={() => {
                setCalmMode(false);
                setViewMode("briefing");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === "briefing" && !calmMode
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Executive Briefing</span>
            </button>

            <button
              onClick={() => {
                setCalmMode(false);
                setViewMode("studio");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === "studio" && !calmMode
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Studio Split</span>
            </button>

            <button
              onClick={() => {
                setCalmMode(false);
                setViewMode("transcript");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === "transcript" && !calmMode
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Full Transcript</span>
            </button>
          </div>

          {/* Right: Actions, Calm Mode & Recording Consent Status */}
          <div className="flex items-center gap-2 self-start md:self-center">
            {/* Zen / Calm Mode Toggle */}
            <button
              onClick={() => setCalmMode(!calmMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                calmMode
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm"
                  : "bg-white/4 text-slate-400 hover:text-white border-white/6"
              }`}
              title="Calm Mode: Strips away visual clutter into a clean, distraction-free reading canvas"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>{calmMode ? "Exit Calm Mode" : "Calm Mode"}</span>
            </button>

            {/* Recording Transparency & Consent Status Badge */}
            <div className="relative">
              <button
                onClick={() => setIsConsentModalOpen(!isConsentModalOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isRecordingPaused
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                }`}
                title="Recording Transparency & Participant Consent Status"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isRecordingPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse"
                  }`}
                />
                <span className="hidden sm:inline">
                  {isRecordingPaused ? "Paused" : "Consent Active"}
                </span>
              </button>

              {/* Consent Popover */}
              {isConsentModalOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 p-4 rounded-2xl bg-[#141824] border border-white/10 shadow-2xl z-50 text-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-white/6">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Recording Transparency</span>
                    </div>
                    <button
                      onClick={() => setIsConsentModalOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/2 border border-white/4 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Transparency Notice Broadcasted:
                    </div>
                    <p className="text-[11px] text-slate-300 italic">
                      &quot;🎙️ Fathom AI has joined this meeting to take notes and action items. Type /stop to opt out.&quot;
                    </p>
                    <div className="text-[10px] text-emerald-400 pt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>
                        All {meeting.participants?.length || 8} participants notified & consented
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => {
                        setIsRecordingPaused(!isRecordingPaused);
                        if (!isRecordingPaused && isPlaying) {
                          handlePlayPause();
                        }
                      }}
                      className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {isRecordingPaused ? (
                        <>
                          <Play className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Resume Recording & Transcribing</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3.5 h-3.5 text-amber-400" />
                          <span>Pause Recording (Mute Bot)</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to purge recording data for this session? This will halt transcription immediately."
                          )
                        ) {
                          setSessionPurged(true);
                          setIsConsentModalOpen(false);
                        }
                      }}
                      className="w-full py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Emergency Purge Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 font-semibold text-xs rounded-xl transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              onClick={handleDownloadTranscript}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/8 text-slate-300 hover:text-white text-xs rounded-xl transition-all cursor-pointer"
              title="Download Transcript"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      {calmMode ? (
        /* ZEN / CALM MODE: Distraction-free, centered reading canvas */
        <div className="flex-1 overflow-y-auto px-6 py-10 bg-[#090a0f]">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="border-b border-white/6 pb-6">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                Calm Reading View
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {meeting.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                <span>{meeting.platform || "Zoom"}</span>
                <span>•</span>
                <span>{Math.round(meeting.duration_sec / 60)} minutes</span>
                <span>•</span>
                <span>{meeting.participants?.length || 8} attendees</span>
              </div>
            </div>

            {/* Embedded Summary in Clean Mode */}
            <SummaryView
              summaryMap={meeting.summary}
              onSeek={(ms) => {
                handleSeek(ms);
              }}
              meetingId={meeting.id}
              onUpdateSummary={(tmpl, content) => {
                setMeeting((prev) =>
                  prev ? { ...prev, summary: { ...prev.summary, [tmpl]: content } } : null
                );
              }}
            />

            {/* Minimal Sticky Audio Playback Bar */}
            <div className="p-4 rounded-2xl bg-[#111522] border border-white/8 sticky bottom-4 flex items-center justify-between gap-4 backdrop-blur-md shadow-2xl">
              <button
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <div className="flex-1 flex items-center gap-3">
                <span className="font-mono text-xs text-slate-400">
                  {formatTime(currentTimeMs)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={durationMs}
                  value={currentTimeMs}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="font-mono text-xs text-slate-400">
                  {formatTime(durationMs)}
                </span>
              </div>

              <button
                onClick={() => setCalmMode(false)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                Exit Calm View
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD 3-MODE LAYOUT */
        <div className="flex-1 flex flex-col overflow-hidden max-w-[1600px] w-full mx-auto">
          {/* MODE 1: EXECUTIVE BRIEFING MODE */}
          {viewMode === "briefing" && (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Left: Summary View & Live Synthesis */}
              <div className="flex-1 overflow-y-auto border-r border-white/6 bg-[#090a0f]">
                <SummaryView
                  summaryMap={meeting.summary}
                  onSeek={(ms) => {
                    handleSeek(ms);
                    setViewMode("studio");
                  }}
                  meetingId={meeting.id}
                  onUpdateSummary={(tmpl, content) => {
                    setMeeting((prev) =>
                      prev ? { ...prev, summary: { ...prev.summary, [tmpl]: content } } : null
                    );
                  }}
                />
              </div>

              {/* Right: Action Items & Player Widget */}
              <aside className="w-full lg:w-[420px] bg-[#0c0f17] p-6 overflow-y-auto space-y-6 shrink-0">
                {/* Mini Audio Player Card */}
                <div className="rounded-2xl overflow-hidden border border-white/8 shadow-xl bg-black">
                  <VideoPlayer
                    meeting={meeting}
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                    currentTimeMs={currentTimeMs}
                    durationMs={durationMs}
                    onSeek={handleSeek}
                    playbackRate={playbackRate}
                    onPlaybackRateChange={handlePlaybackRateChange}
                    activeSpeakerName={activeSpeakerName}
                    highlights={highlights}
                  />
                </div>

                {/* Speaker Stage Mini Matrix */}
                {meeting.participants && meeting.participants.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#111522] border border-white/6">
                    <SpeakerStage
                      participants={meeting.participants}
                      activeSpeakerName={activeSpeakerName}
                      currentTimeMs={currentTimeMs}
                      onSelectSpeaker={(speaker) => {
                        setSelectedSpeakerFilter(speaker);
                        setViewMode("studio");
                        setStudioTab("transcript");
                      }}
                      selectedSpeaker={selectedSpeakerFilter}
                    />
                  </div>
                )}

                {/* Action Items Board */}
                <div className="p-4 rounded-2xl bg-[#111522] border border-white/6">
                  <ActionItemsView
                    actionItems={actionItems}
                    onToggleDone={handleToggleDone}
                    onAddManualItem={handleAddManualItem}
                    onSeek={handleSeek}
                    highlights={highlights}
                    onDeleteHighlight={handleDeleteHighlight}
                  />
                </div>
              </aside>
            </div>
          )}

          {/* MODE 2: STUDIO SPLIT MODE */}
          {viewMode === "studio" && (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Left: Video Player & Speaker Stage */}
              <div className="w-full lg:w-[55%] flex flex-col border-r border-white/6 bg-black overflow-y-auto">
                <VideoPlayer
                  meeting={meeting}
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                  currentTimeMs={currentTimeMs}
                  durationMs={durationMs}
                  onSeek={handleSeek}
                  playbackRate={playbackRate}
                  onPlaybackRateChange={handlePlaybackRateChange}
                  activeSpeakerName={activeSpeakerName}
                  highlights={highlights}
                />

                {meeting.participants && meeting.participants.length > 0 && (
                  <SpeakerStage
                    participants={meeting.participants}
                    activeSpeakerName={activeSpeakerName}
                    currentTimeMs={currentTimeMs}
                    onSelectSpeaker={setSelectedSpeakerFilter}
                    selectedSpeaker={selectedSpeakerFilter}
                  />
                )}
              </div>

              {/* Right: Tabbed Panel (Transcript / Summary / Ask Fathom) */}
              <div className="flex-1 flex flex-col bg-[#0a0d14] overflow-hidden">
                {/* Studio Tabs Header */}
                <div className="h-12 border-b border-white/6 px-6 flex items-center gap-6 bg-[#0c0f17] shrink-0 text-xs">
                  <button
                    onClick={() => setStudioTab("transcript")}
                    className={`h-full font-bold uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-1.5 ${
                      studioTab === "transcript"
                        ? "text-indigo-400"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    <span>Transcript</span>
                    {studioTab === "transcript" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                    )}
                  </button>

                  <button
                    onClick={() => setStudioTab("summary")}
                    className={`h-full font-bold uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-1.5 ${
                      studioTab === "summary"
                        ? "text-indigo-400"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Summary</span>
                    {studioTab === "summary" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                    )}
                  </button>

                  <button
                    onClick={() => setStudioTab("ask")}
                    className={`h-full font-bold uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-1.5 ${
                      studioTab === "ask"
                        ? "text-indigo-400"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI</span>
                    {studioTab === "ask" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                    )}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto">
                  {studioTab === "transcript" && (
                    <TranscriptView
                      segments={meeting.segments}
                      participants={meeting.participants}
                      currentTimeMs={currentTimeMs}
                      onSeek={handleSeek}
                      onAddHighlight={handleAddHighlight}
                      onAddActionItem={(text) => handleAddManualItem(text, "From transcript")}
                      highlights={highlights}
                      meetingId={meeting.id}
                    />
                  )}
                  {studioTab === "summary" && (
                    <SummaryView
                      summaryMap={meeting.summary}
                      onSeek={handleSeek}
                      meetingId={meeting.id}
                      onUpdateSummary={(tmpl, content) => {
                        setMeeting((prev) =>
                          prev ? { ...prev, summary: { ...prev.summary, [tmpl]: content } } : null
                        );
                      }}
                    />
                  )}
                  {studioTab === "ask" && (
                    <AskFathomView
                      meetingTitle={meeting.title}
                      meetingId={meeting.id}
                      onSeek={handleSeek}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: FULL TRANSCRIPT MODE */}
          {viewMode === "transcript" && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0d14]">
              <TranscriptView
                segments={meeting.segments}
                participants={meeting.participants}
                currentTimeMs={currentTimeMs}
                onSeek={handleSeek}
                onAddHighlight={handleAddHighlight}
                onAddActionItem={(text) => handleAddManualItem(text, "From transcript")}
                highlights={highlights}
                meetingId={meeting.id}
              />
            </div>
          )}
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        meetingId={meeting.id}
      />
    </div>
  );
}
