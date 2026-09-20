"use client";

import React, { useState, useRef, useEffect, use } from "react";
import Link from "next/link";
import { Play, Pause, RotateCcw, Volume2, ArrowUpRight, Share2, Sparkles, Clock } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SEED_MEETINGS } from "@/lib/seed-meetings";

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
    meetingId: "829997322",
    meetingTitle: "Q4 Roadmap Planning",
    start_ms: 1470000,
    end_ms: 1620000,
    speaker: "Alex Rivera",
    speakerColor: "#00b2ea",
    text: "Let's make the final call right now: we launch on November 18th. Aisha, please reschedule the sponsorships and press embargo.",
  },
  "pricing-matrix": {
    title: "Pro Tier Pricing & Discount Matrix Ownership",
    meetingId: "829997322",
    meetingTitle: "Q4 Roadmap Planning",
    start_ms: 2160000,
    end_ms: 2280000,
    speaker: "Carlos Ramirez",
    speakerColor: "#f97316",
    text: "We're keeping the free tier generous: unlimited recording for individuals. For teams, the Pro tier is $19 per user per month. I will have the finalized pricing sheet signed off by this Friday at 5 PM.",
  },
};

export default function ClipPage({ params }: ClipPageProps) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  // Fallback to launch-decision if token not recognized
  const clip = PRESET_CLIPS[token] || PRESET_CLIPS["launch-decision"];
  const meeting = SEED_MEETINGS.find((m) => m.id === clip.meetingId) || SEED_MEETINGS[0];

  const clipDurationMs = clip.end_ms - clip.start_ms;
  const clipDurationSec = clipDurationMs / 1000;

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
      if (audioRef.current.currentTime < clip.start_ms / 1000 || audioRef.current.currentTime >= clip.end_ms / 1000) {
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

    audio.currentTime = clip.start_ms / 1000;

    const onTimeUpdate = () => {
      const currentAbsMs = audio.currentTime * 1000;
      if (currentAbsMs >= clip.end_ms) {
        audio.pause();
        setIsPlaying(false);
        setCurrentClipMs(clipDurationMs);
      } else if (currentAbsMs >= clip.start_ms) {
        setCurrentClipMs(Math.round(currentAbsMs - clip.start_ms));
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

  return (
    <div className="min-h-screen bg-[#111214] flex flex-col select-none">
      {/* Top Bar */}
      <header className="h-14 border-b border-[#26282d] bg-[#111214] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo href="/" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e8b923]/40 bg-[#e8b923]/10 text-xs text-[#e8b923] font-medium">
            <span>Fathom Clip</span>
            <span>✂️</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238] text-xs text-white font-medium transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "Copied!" : "Share Clip"}</span>
          </button>

          <Link
            href={`/calls/${clip.meetingId}?t=${clip.start_ms}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            <span>Watch Full Call</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={meeting.audio_url} preload="metadata" />

      {/* Main Clip Player Container */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-[#161719] border border-[#26282d] rounded-2xl p-8 shadow-2xl space-y-6">
          {/* Header & Meeting Info */}
          <div>
            <div className="flex items-center gap-2 text-xs text-[#9a9ba1] mb-2">
              <span>From:</span>
              <span className="font-semibold text-white">{clip.meetingTitle}</span>
              <span>•</span>
              <span className="font-mono text-[#00b2ea]">
                {Math.floor(clip.start_ms / 60000)}:{Math.floor((clip.start_ms % 60000) / 1000).toString().padStart(2, "0")} -{" "}
                {Math.floor(clip.end_ms / 60000)}:{Math.floor((clip.end_ms % 60000) / 1000).toString().padStart(2, "0")}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white leading-snug">{clip.title}</h1>
          </div>

          {/* Spoken Quote Box */}
          <div className="p-6 bg-[#1e2024] border border-[#2f3238] rounded-xl flex items-start gap-4 shadow-inner">
            <div
              style={{ backgroundColor: clip.speakerColor }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
            >
              {clip.speaker.charAt(0)}
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{clip.speaker}</span>
                <span className="text-[11px] text-[#9a9ba1] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{Math.round(clipDurationSec)}s clip</span>
                </span>
              </div>
              <p className="text-sm text-[#e5e7eb] leading-relaxed italic">
                &ldquo;{clip.text}&rdquo;
              </p>
            </div>
          </div>

          {/* Clip Playback Controls */}
          <div className="space-y-3 pt-2">
            {/* Scrub Bar */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = Math.max(0, Math.min(1, clickX / rect.width));
                handleSeek(pct * clipDurationMs);
              }}
              className="relative h-2 bg-[#2a2c32] hover:h-2.5 rounded-full cursor-pointer transition-all group"
            >
              <div
                style={{ width: `${progressPct}%` }}
                className="h-full bg-[#00b2ea] rounded-full relative"
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Time & Play Buttons */}
            <div className="flex items-center justify-between text-xs text-[#9a9ba1]">
              <span className="font-mono">
                {Math.floor(currentClipMs / 1000)}s / {Math.floor(clipDurationSec)}s
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRestart}
                  className="p-2 rounded-full hover:bg-[#25282e] text-[#9a9ba1] hover:text-white transition-colors cursor-pointer"
                  title="Restart clip"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="w-11 h-11 rounded-full bg-[#00b2ea] hover:bg-[#00c5ff] text-black flex items-center justify-center transition-all cursor-pointer shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-black" />
                  ) : (
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#9a9ba1]">
                <Volume2 className="w-4 h-4" />
                <span>Audio Only</span>
              </div>
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="pt-4 border-t border-[#26282d] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#9a9ba1]">
              <Sparkles className="w-4 h-4 text-[#00b2ea]" />
              <span>Recorded with Fathom AI Notetaker</span>
            </div>

            <Link
              href="/demo"
              className="text-[#00b2ea] hover:underline font-semibold"
            >
              Get Free Notetaker →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
