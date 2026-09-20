"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { TopBar } from "@/components/shell/TopBar";
import { VideoPlayer } from "@/components/call/VideoPlayer";
import { SummaryView } from "@/components/call/SummaryView";
import { TranscriptView } from "@/components/call/TranscriptView";
import { AskFathomView } from "@/components/call/AskFathomView";
import { ActionItemsView } from "@/components/call/ActionItemsView";
import { ShareModal } from "@/components/call/ShareModal";
import { SEED_MEETINGS, ActionItem } from "@/lib/seed-meetings";
import { Link2, MoreVertical, Download, Trash2, ArrowLeft } from "lucide-react";

interface CallPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ t?: string; tab?: string }>;
}

export default function CallPage({ params, searchParams }: CallPageProps) {
  const resolvedParams = use(params);
  const resolvedSearchParams = searchParams ? use(searchParams) : undefined;
  const meetingId = resolvedParams.id;
  const initialTimestamp = resolvedSearchParams?.t ? parseInt(resolvedSearchParams.t, 10) : 0;
  const initialTab = resolvedSearchParams?.tab === "transcript" || resolvedSearchParams?.t ? "transcript" : "summary";

  // Find meeting
  const initialMeeting = SEED_MEETINGS.find((m) => m.id === meetingId) || SEED_MEETINGS[0];

  const [activeTab, setActiveTab] = useState<"summary" | "transcript" | "ask">(initialTab);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(initialTimestamp);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showKebabMenu, setShowKebabMenu] = useState(false);

  // Local state for action items & highlights
  const [actionItems, setActionItems] = useState<ActionItem[]>(initialMeeting.action_items);
  const [highlights, setHighlights] = useState<Array<{ id: string; start_ms: number; end_ms?: number; note?: string }>>([
    { id: "h1", start_ms: 1470000, end_ms: 1620000, note: "Launch date decision (Nov 18)" },
    { id: "h2", start_ms: 2160000, end_ms: 2250000, note: "Carlos owns pricing decision" },
  ]);

  const durationMs = initialMeeting.duration_sec * 1000;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Seek to initial timestamp on mount if specified
  useEffect(() => {
    if (initialTimestamp > 0 && audioRef.current) {
      audioRef.current.currentTime = initialTimestamp / 1000;
    }
  }, [initialTimestamp]);

  // Find active speaker based on current time
  const activeSpeakerName = (() => {
    const currentSegment = initialMeeting.segments.find(
      (s) => currentTimeMs >= s.start_ms && currentTimeMs <= s.end_ms
    );
    return currentSegment ? currentSegment.speaker : null;
  })();

  // Handle Play/Pause
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Handle Seek
  const handleSeek = (ms: number) => {
    setCurrentTimeMs(ms);
    if (audioRef.current) {
      audioRef.current.currentTime = ms / 1000;
      if (!isPlaying) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  // Handle Playback Rate
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // Synchronize audio element time update
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTimeMs(Math.round(audio.currentTime * 1000));
    };

    const onEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  // Action item handlers
  const handleToggleDone = (id: string) => {
    setActionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleAddManualItem = (text: string, assignee: string) => {
    const newItem: ActionItem = {
      id: `manual-${Date.now()}`,
      text,
      assignee,
      start_ms: currentTimeMs,
      due_hint: "Upcoming",
      source: "manual",
      done: false,
    };
    setActionItems((prev) => [newItem, ...prev]);
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
    const content = initialMeeting.segments
      .map((s) => `[${Math.floor(s.start_ms / 60000)}:${Math.floor((s.start_ms % 60000) / 1000)}] ${s.speaker}: ${s.text}`)
      .join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${initialMeeting.slug}-transcript.txt`;
    a.click();
    setShowKebabMenu(false);
  };

  return (
    <div className="min-h-screen bg-[#111214] flex flex-col select-none">
      <TopBar />

      {/* Hidden Audio Element driving media sync */}
      <audio
        ref={audioRef}
        src={initialMeeting.audio_url}
        preload="metadata"
      />

      {/* Two-Column Call Layout Matching 15.png */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1440px] w-full mx-auto">
        {/* LEFT COLUMN: Player + Tabs (Summary / Transcript / Ask) */}
        <div className="flex-1 flex flex-col border-r border-[#26282d] bg-black overflow-y-auto">
          {/* Video Player with Overlay Controls */}
          <VideoPlayer
            meeting={initialMeeting}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            currentTimeMs={currentTimeMs}
            durationMs={durationMs}
            onSeek={handleSeek}
            playbackRate={playbackRate}
            onPlaybackRateChange={handlePlaybackRateChange}
            activeSpeakerName={activeSpeakerName}
          />

          {/* Three Navigation Tabs: SUMMARY, TRANSCRIPT, ASK FATHOM */}
          <div className="h-10 border-b border-[#26282d] px-6 flex items-center gap-8 bg-black select-none shrink-0">
            <button
              onClick={() => setActiveTab("summary")}
              className={`h-full font-bold text-xs uppercase tracking-wider transition-colors relative cursor-pointer ${
                activeTab === "summary"
                  ? "text-[#00b2ea]"
                  : "text-[#9a9ba1] hover:text-white"
              }`}
            >
              <span>Summary</span>
              {activeTab === "summary" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b2ea]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("transcript")}
              className={`h-full font-bold text-xs uppercase tracking-wider transition-colors relative cursor-pointer ${
                activeTab === "transcript"
                  ? "text-[#00b2ea]"
                  : "text-[#9a9ba1] hover:text-white"
              }`}
            >
              <span>Transcript</span>
              {activeTab === "transcript" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b2ea]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("ask")}
              className={`h-full font-bold text-xs uppercase tracking-wider transition-colors relative cursor-pointer ${
                activeTab === "ask"
                  ? "text-[#00b2ea]"
                  : "text-[#9a9ba1] hover:text-white"
              }`}
            >
              <span>Ask Fathom</span>
              {activeTab === "ask" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b2ea]" />
              )}
            </button>
          </div>

          {/* Active Tab Content Area */}
          <div className="flex-1 min-h-[480px]">
            {activeTab === "summary" && (
              <SummaryView
                summaryMap={initialMeeting.summary}
                onSeek={handleSeek}
              />
            )}
            {activeTab === "transcript" && (
              <TranscriptView
                segments={initialMeeting.segments}
                participants={initialMeeting.participants}
                currentTimeMs={currentTimeMs}
                onSeek={handleSeek}
                onAddHighlight={handleAddHighlight}
                onAddActionItem={(text) => handleAddManualItem(text, "From transcript")}
                highlights={highlights}
              />
            )}
            {activeTab === "ask" && (
              <AskFathomView
                meetingTitle={initialMeeting.title}
                onSeek={handleSeek}
              />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Metadata, Share, Action Items */}
        <aside className="w-full lg:w-[380px] bg-[#111214] p-6 overflow-y-auto space-y-6 shrink-0 border-t lg:border-t-0 border-[#26282d]">
          {/* Header & Back Link */}
          <div>
            <Link
              href="/home"
              className="inline-flex items-center gap-1.5 text-xs text-[#9a9ba1] hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all calls</span>
            </Link>

            <h1 className="text-lg font-bold text-white mb-1">
              {initialMeeting.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-[#9a9ba1]">
              <span>Sep 20, 2026</span>
            </div>
          </div>

          {/* Share Button & Kebab Menu Matching 15.png */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex-1 h-9 px-4 rounded-md border border-[#00b2ea]/40 bg-[#00b2ea]/12 hover:bg-[#00b2ea]/20 text-[#00b2ea] font-semibold text-xs flex items-center justify-between transition-all cursor-pointer shadow-xs"
            >
              <span>Share</span>
              <Link2 className="w-3.5 h-3.5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowKebabMenu(!showKebabMenu)}
                className="w-9 h-9 rounded-md bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238] flex items-center justify-center text-[#9a9ba1] hover:text-white transition-colors cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showKebabMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-[#1e2024] border border-[#2f3238] rounded-xl shadow-2xl py-1 z-30 text-xs">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setShowKebabMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#25282e] text-white"
                  >
                    Copy page link
                  </button>
                  <button
                    onClick={handleDownloadTranscript}
                    className="w-full text-left px-3 py-2 hover:bg-[#25282e] text-white flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-[#9a9ba1]" />
                    <span>Download transcript (.txt)</span>
                  </button>
                  <button
                    onClick={() => setShowKebabMenu(false)}
                    className="w-full text-left px-3 py-2 hover:bg-[#25282e] text-[#ff4d4f] flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete call</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ACTION ITEMS Header & List Matching 15.png */}
          <div>
            <h2 className="text-[11px] font-bold text-[#9a9ba1] uppercase tracking-wider mb-3">
              ACTION ITEMS
            </h2>

            {actionItems.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#161719] border border-[#26282d] text-xs text-[#9a9ba1] italic">
                None detected. Add manually on transcript tab
              </div>
            ) : (
              <ActionItemsView
                actionItems={actionItems}
                onToggleDone={handleToggleDone}
                onAddManualItem={handleAddManualItem}
                onSeek={handleSeek}
                highlights={highlights}
                onDeleteHighlight={handleDeleteHighlight}
              />
            )}
          </div>
        </aside>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        meetingId={initialMeeting.id}
      />
    </div>
  );
}
