"use client";

import React, { useState, useRef, useEffect, use } from "react";
import Link from "next/link";
import { Play, Pause, RotateCcw, ArrowRight, Share2, Check } from "lucide-react";
import { Meeting } from "@/lib/seed-meetings";

interface ClipPageProps {
  params: Promise<{ token: string }>;
}

interface ClipData {
  title: string;
  meetingId: string;
  meetingTitle: string;
  start_ms: number;
  end_ms: number;
  speaker: string;
  speakerColor: string;
  text: string;
}

const PRESET_CLIPS: Record<string, ClipData> = {
  "launch-decision": {
    title: "Official Launch Date Decision (Nov 18)",
    meetingId: "829997321",
    meetingTitle: "Q4 Roadmap Planning",
    start_ms: 1470000,
    end_ms: 1620000,
    speaker: "Alex Rivera",
    speakerColor: "#C98A3E",
    text: "Let's make the final call right now: we launch on November 18th. Aisha, please reschedule the sponsorships and press embargo.",
  },
  "pricing-matrix": {
    title: "Pro Tier Pricing & Discount Matrix Ownership",
    meetingId: "829997321",
    meetingTitle: "Q4 Roadmap Planning",
    start_ms: 2160000,
    end_ms: 2280000,
    speaker: "Carlos Ramirez",
    speakerColor: "#C98A3E",
    text: "We're keeping the free tier generous: unlimited recording for individuals. For teams, the Pro tier is $19 per user per month. I will have the finalized pricing sheet signed off by this Friday at 5 PM.",
  },
};

export default function ClipPage({ params }: ClipPageProps) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const clip = PRESET_CLIPS[token] || PRESET_CLIPS["launch-decision"];
  const [meeting, setMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    let isCancelled = false;
    async function loadClipMeeting() {
      try {
        const res = await fetch(`/api/meetings/${clip.meetingId}`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.meeting) {
            setMeeting(data.meeting);
          }
        }
      } catch (e) {
        console.error("Failed to load clip meeting:", e);
      }
    }
    loadClipMeeting();
    return () => {
      isCancelled = true;
    };
  }, [clip.meetingId]);

  const clipDurationMs = clip.end_ms - clip.start_ms;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentClipMs, setCurrentClipMs] = useState(0);
  const [copied, setCopied] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (
        audioRef.current.currentTime < clip.start_ms / 1000 ||
        audioRef.current.currentTime >= clip.end_ms / 1000
      ) {
        audioRef.current.currentTime = clip.start_ms / 1000;
      }
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (offsetMs: number) => {
    const targetAbsMs = clip.start_ms + offsetMs;
    setCurrentClipMs(offsetMs);
    if (audioRef.current) {
      audioRef.current.currentTime = targetAbsMs / 1000;
      if (!isPlaying) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = clip.start_ms / 1000;
      setCurrentClipMs(0);
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const currentAbsMs = audio.currentTime * 1000;
      if (currentAbsMs >= clip.end_ms) {
        audio.pause();
        setIsPlaying(false);
        setCurrentClipMs(clipDurationMs);
      } else {
        const offset = Math.max(0, currentAbsMs - clip.start_ms);
        setCurrentClipMs(offset);
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    return () => audio.removeEventListener("timeupdate", onTimeUpdate);
  }, [clip.start_ms, clip.end_ms, clipDurationMs]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPct = Math.min(100, (currentClipMs / clipDurationMs) * 100);

  const formatMs = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#1C1E22] text-[#EDEBE6] font-sans antialiased selection:bg-[#C98A3E]/30 selection:text-[#EDEBE6]">
      {/* Top Header */}
      <header className="border-b border-[#282B31] bg-[#17191C]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-serif-heading text-[18px] font-medium tracking-tight text-[#EDEBE6]"
            >
              Fathom
            </Link>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E929B] hidden sm:inline">
              Verified Clip
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-[4px] border border-[#282B31] hover:border-[#EDEBE6] text-[#EDEBE6] font-mono text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#C98A3E]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Share Clip"}</span>
            </button>

            <Link
              href={`/calls/${clip.meetingId}?t=${Math.floor(clip.start_ms / 1000)}`}
              className="px-3.5 py-1.5 rounded-[4px] bg-[#C98A3E] hover:bg-[#d8974a] text-[#1C1E22] font-semibold text-[12px] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Full Meeting</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Audio element */}
      <audio ref={audioRef} src={meeting?.audio_url || ""} preload="metadata" />

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-6 py-16 space-y-6 text-left">
        <div className="border border-[#282B31] rounded-[4px] bg-[#17191C] p-8 space-y-6">
          {/* Clip Meta */}
          <div className="space-y-2 border-b border-[#282B31] pb-4">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#8E929B]">
              <span>Meeting: {clip.meetingTitle}</span>
              <span>•</span>
              <span className="text-[#EDEBE6]">
                {formatMs(clip.start_ms)} – {formatMs(clip.end_ms)}
              </span>
            </div>
            <h1 className="font-serif-heading text-[24px] font-medium text-[#EDEBE6] leading-snug">
              {clip.title}
            </h1>
          </div>

          {/* Spoken Quote Box */}
          <div className="p-4 rounded-[4px] border border-[#282B31] bg-[#141619] space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-serif-heading font-medium text-[#EDEBE6]">
                {clip.speaker}
              </span>
              <span className="font-mono text-[11px] text-[#8E929B]">
                {Math.round(clipDurationMs / 1000)}s clip
              </span>
            </div>
            <p className="text-[14px] text-[#EDEBE6] italic leading-relaxed">
              &ldquo;{clip.text}&rdquo;
            </p>
          </div>

          {/* Scrubber & Player Controls */}
          <div className="space-y-3 pt-2">
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                handleSeek(ratio * clipDurationMs);
              }}
              className="h-2 bg-[#282B31] rounded-[2px] cursor-pointer relative overflow-hidden"
            >
              <div
                className="h-full bg-[#EDEBE6]"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[12px] font-mono text-[#8E929B]">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  className="w-8 h-8 rounded-[4px] border border-[#282B31] bg-[#1C1E22] hover:bg-[#22252B] text-[#EDEBE6] flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>
                <button
                  onClick={handleRestart}
                  className="text-[#8E929B] hover:text-[#EDEBE6] p-1.5 transition-colors cursor-pointer"
                  title="Restart Clip"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <span className="text-[#EDEBE6]">{formatMs(currentClipMs)}</span> / {formatMs(clipDurationMs)}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
