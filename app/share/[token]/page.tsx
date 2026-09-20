"use client";

import React, { useState, useRef, useEffect, use } from "react";
import { TopBar } from "@/components/shell/TopBar";
import { SpeakerStage } from "@/components/call/SpeakerStage";
import { PlayerControls } from "@/components/call/PlayerControls";
import { SummaryView } from "@/components/call/SummaryView";
import { TranscriptView } from "@/components/call/TranscriptView";
import { ActionItemsView } from "@/components/call/ActionItemsView";
import { Meeting } from "@/lib/seed-meetings";
import { Share2, Loader2 } from "lucide-react";

interface SharePageProps {
  params: Promise<{ token: string }>;
}

export default function PublicSharePage({ params }: SharePageProps) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const targetId = token === "star" || token === "demo" ? "829997321" : token;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"summary" | "transcript">("summary");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Fetch meeting from Supabase database
  useEffect(() => {
    let isCancelled = false;
    async function loadShareMeeting() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/meetings/${targetId}`);
        if (!res.ok) throw new Error("Failed to load shared call");
        const data = await res.json();
        if (!isCancelled) {
          if (data.meeting) {
            setMeeting(data.meeting);
          } else {
            setError("Shared call not found.");
          }
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const msg = err instanceof Error ? err.message : "Error fetching shared call";
          setError(msg);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    loadShareMeeting();
    return () => {
      isCancelled = true;
    };
  }, [targetId]);

  const durationMs = (meeting?.duration_sec || 0) * 1000;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeSpeakerName = (() => {
    if (!meeting?.segments) return null;
    const currentSegment = meeting.segments.find(
      (s) => currentTimeMs >= s.start_ms && currentTimeMs <= s.end_ms
    );
    return currentSegment ? currentSegment.speaker : null;
  })();

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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTimeMs(Math.round(audio.currentTime * 1000));
    };
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111214] flex flex-col select-none">
        <TopBar isPublic />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-xs text-[#9a9ba1]">
          <Loader2 className="w-6 h-6 animate-spin text-[#00b2ea]" />
          <span>Loading shared call...</span>
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen bg-[#111214] flex flex-col select-none">
        <TopBar isPublic />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-base font-bold text-white mb-2">Shared Call Not Found</h2>
          <p className="text-xs text-[#9a9ba1] mb-4">
            {error || "This shared recording link is invalid or has expired."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111214] flex flex-col select-none">
      {/* Public Signed-Out TopBar */}
      <TopBar isPublic />

      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        src={meeting.audio_url}
        preload="metadata"
      />

      {/* Two-Column Read-Only Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1600px] w-full mx-auto">
        {/* Left Column: Player & Tabs */}
        <div className="flex-1 flex flex-col border-r border-[#26282d] bg-black overflow-y-auto">
          <SpeakerStage
            participants={meeting.participants}
            activeSpeakerName={activeSpeakerName}
            currentTimeMs={currentTimeMs}
          />

          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            currentTimeMs={currentTimeMs}
            durationMs={durationMs}
            onSeek={handleSeek}
            playbackRate={playbackRate}
            onPlaybackRateChange={setPlaybackRate}
            topics={meeting.summary.Enhanced?.topics}
          />

          {/* Two Tabs: Summary & Transcript */}
          <div className="h-11 border-b border-[#26282d] px-6 flex items-center gap-8 bg-black select-none shrink-0">
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
          </div>

          <div className="flex-1 min-h-[500px]">
            {activeTab === "summary" ? (
              <SummaryView
                summaryMap={meeting.summary}
                onSeek={handleSeek}
              />
            ) : (
              <TranscriptView
                segments={meeting.segments}
                participants={meeting.participants}
                currentTimeMs={currentTimeMs}
                onSeek={handleSeek}
                onAddHighlight={() => {}}
                onAddActionItem={() => {}}
              />
            )}
          </div>
        </div>

        {/* Right Column: Metadata & Read-Only Action Items */}
        <aside className="w-full lg:w-[420px] bg-[#161719] p-6 overflow-y-auto space-y-6 shrink-0 border-t lg:border-t-0 border-[#26282d]">
          <div>
            <h1 className="text-xl font-bold text-white mb-1.5 leading-snug">
              {meeting.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-[#9a9ba1]">
              <span>Sep 20, 2026</span>
              <span>•</span>
              <span>{Math.round(meeting.duration_sec / 60)} mins</span>
            </div>
          </div>

          <div className="p-3 bg-[#1e2024] rounded-xl border border-[#2f3238] flex items-center gap-2 text-xs text-[#d1d5db]">
            <Share2 className="w-4 h-4 text-[#00b2ea]" />
            <span>Shared via Fathom AI Notetaker</span>
          </div>

          <ActionItemsView
            actionItems={meeting.action_items}
            onToggleDone={() => {}}
            onAddManualItem={() => {}}
            onSeek={handleSeek}
          />
        </aside>
      </div>
    </div>
  );
}
