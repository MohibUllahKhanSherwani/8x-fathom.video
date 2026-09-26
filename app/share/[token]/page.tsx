"use client";

import React, { useState, useRef, useEffect, use } from "react";
import Link from "next/link";
import { TopBar } from "@/components/shell/TopBar";
import { SpeakerStage } from "@/components/call/SpeakerStage";
import { PlayerControls } from "@/components/call/PlayerControls";
import { SummaryView } from "@/components/call/SummaryView";
import { TranscriptView } from "@/components/call/TranscriptView";
import { ActionItemsView } from "@/components/call/ActionItemsView";
import { Meeting } from "@/lib/seed-meetings";
import { Share2, Loader2, Sparkles, FileText, AlignLeft, ShieldCheck } from "lucide-react";

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
      <div className="min-h-screen bg-[#090a0f] flex flex-col select-none">
        <TopBar isPublic />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-xs text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          <span>Loading shared meeting intelligence...</span>
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex flex-col select-none">
        <TopBar isPublic />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-base font-bold text-white mb-2">Shared Recording Not Found</h2>
          <p className="text-xs text-slate-400 mb-4">
            {error || "This shared recording link is invalid or has expired."}
          </p>
          <Link
            href="/demo"
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            Launch Sandbox Demo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0f] flex flex-col select-none text-slate-100">
      {/* Public TopBar */}
      <TopBar isPublic />

      {/* Hidden Audio Driver */}
      <audio
        ref={audioRef}
        src={meeting.audio_url}
        preload="metadata"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1600px] w-full mx-auto">
        {/* Left Column: Player & Tabs */}
        <div className="flex-1 flex flex-col border-r border-white/6 bg-black overflow-y-auto">
          {meeting.participants && meeting.participants.length > 0 && (
            <SpeakerStage
              participants={meeting.participants}
              activeSpeakerName={activeSpeakerName}
              currentTimeMs={currentTimeMs}
            />
          )}

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

          {/* Tab Selector */}
          <div className="h-12 border-b border-white/6 px-6 flex items-center gap-6 bg-[#0c0f17] select-none shrink-0 text-xs">
            <button
              onClick={() => setActiveTab("summary")}
              className={`h-full font-bold uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-1.5 ${
                activeTab === "summary"
                  ? "text-indigo-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Summary</span>
              {activeTab === "summary" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("transcript")}
              className={`h-full font-bold uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-1.5 ${
                activeTab === "transcript"
                  ? "text-indigo-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Transcript</span>
              {activeTab === "transcript" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
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

        {/* Right Column: Overview & Tasks */}
        <aside className="w-full lg:w-[420px] bg-[#0c0f17] p-6 overflow-y-auto space-y-6 shrink-0 border-t lg:border-t-0 border-white/6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-[10px] font-mono text-slate-400">
                {meeting.platform || "Zoom"}
              </span>
              <span className="text-[11px] text-slate-400">
                {Math.round(meeting.duration_sec / 60)} mins
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mb-2 leading-snug">
              {meeting.title}
            </h1>
            <p className="text-xs text-slate-400">
              Recorded with automated speaker diarization and executive synthesis.
            </p>
          </div>

          <div className="p-3.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex items-center gap-2.5 text-xs text-indigo-300">
            <Share2 className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>Publicly shared meeting portal via Fathom AI</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#111522] border border-white/6">
            <ActionItemsView
              actionItems={meeting.action_items || []}
              onToggleDone={() => {}}
              onAddManualItem={() => {}}
              onSeek={handleSeek}
            />
          </div>

          <div className="pt-4 border-t border-white/6 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Database Record</span>
            </div>
            <Link href="/demo" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Explore Demo →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
