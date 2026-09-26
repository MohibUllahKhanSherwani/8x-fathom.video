"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { Meeting } from "@/lib/seed-meetings";

interface VideoPlayerProps {
  meeting: Meeting;
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTimeMs: number;
  durationMs: number;
  onSeek: (ms: number) => void;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  activeSpeakerName: string | null;
  highlights?: Array<{ start_ms: number; end_ms?: number }>;
}

export function VideoPlayer({
  meeting,
  isPlaying,
  onPlayPause,
  currentTimeMs,
  durationMs,
  onSeek,
  playbackRate,
  onPlaybackRateChange,
  activeSpeakerName,
  highlights = [],
}: VideoPlayerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPct = durationMs > 0 ? (currentTimeMs / durationMs) * 100 : 0;

  const handleScrubClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * durationMs);
  };

  const cycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    onPlaybackRateChange(nextSpeed);
  };

  const skipSeconds = (sec: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onSeek(currentTimeMs + sec * 1000);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={playerRef}
      onClick={onPlayPause}
      className="relative aspect-video w-full bg-[#080b11] overflow-hidden group cursor-pointer select-none border-b border-white/6"
    >
      {/* Visual Canvas or Poster */}
      {meeting.thumbnail_url ? (
        <Image
          src={meeting.thumbnail_url}
          alt={meeting.title}
          fill
          priority
          className="object-contain"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-tr from-[#0a0d16] via-[#101524] to-[#0a0d16] flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3 text-indigo-400 shadow-xl shadow-indigo-500/10">
              <Play className="w-6 h-6 ml-0.5 fill-current" />
            </div>
            <p className="text-sm font-bold text-white tracking-tight">{meeting.title}</p>
            <p className="text-xs text-slate-400 mt-1">Click canvas or spacebar to stream recording</p>
          </div>
        </div>
      )}

      {/* Center Play Indicator on Pause */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] pointer-events-none transition-all">
          <div className="w-16 h-16 rounded-full bg-indigo-600/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl">
            <Play className="w-7 h-7 ml-1 fill-white" />
          </div>
        </div>
      )}

      {/* Active Speaker Pill in Video (Top-Left) */}
      <div className="absolute left-4 top-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs text-white flex items-center gap-2 pointer-events-none shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-slate-200">
          {activeSpeakerName || meeting.participants?.[0]?.name || "Speaker"}
        </span>
      </div>

      {/* Floating Bottom Controls Overlay Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-[#080b11]/95 via-[#080b11]/70 to-transparent p-3 pt-8 flex flex-col gap-2 transition-opacity"
      >
        {/* Scrubber Timeline with Speaker Segment Colors & Highlight Pins */}
        <div
          onClick={handleScrubClick}
          className="relative w-full h-4 flex items-center cursor-pointer group/scrub"
        >
          {/* Background Bar */}
          <div className="w-full h-1.5 bg-white/15 group-hover/scrub:h-2 rounded-full overflow-hidden transition-all relative">
            {/* Color-coded speaker segments if available */}
            {meeting.segments && meeting.segments.length > 0 && durationMs > 0 && (
              <div className="absolute inset-0 flex pointer-events-none opacity-40">
                {meeting.segments.map((seg, sIdx) => {
                  const segWidthPct = ((seg.end_ms - seg.start_ms) / durationMs) * 100;
                  const segLeftPct = (seg.start_ms / durationMs) * 100;
                  const partColor = meeting.participants?.find((p) => p.name === seg.speaker)?.color || "#6366f1";
                  return (
                    <div
                      key={sIdx}
                      style={{
                        left: `${segLeftPct}%`,
                        width: `${Math.max(segWidthPct, 0.2)}%`,
                        backgroundColor: partColor,
                      }}
                      className="absolute top-0 bottom-0"
                    />
                  );
                })}
              </div>
            )}

            {/* Elapsed Progress Fill */}
            <div
              style={{ width: `${progressPct}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 relative z-10"
            />
          </div>

          {/* Highlight Marker Pins */}
          {highlights.map((hl, idx) => {
            const hlPct = durationMs > 0 ? (hl.start_ms / durationMs) * 100 : 0;
            return (
              <div
                key={idx}
                style={{ left: `${hlPct}%` }}
                title={`Highlight: ${formatTime(hl.start_ms)}`}
                className="absolute w-2 h-2 rounded-full bg-amber-400 -translate-x-1/2 shadow-sm pointer-events-none z-20"
              />
            );
          })}

          {/* Scrubber Handle */}
          <div
            style={{ left: `${progressPct}%` }}
            className="absolute w-3.5 h-3.5 bg-white rounded-full -translate-x-1/2 shadow-md opacity-0 group-hover/scrub:opacity-100 transition-opacity pointer-events-none z-30"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-3">
            {/* Play / Pause */}
            <button
              onClick={onPlayPause}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>

            {/* Skip 15s Back & Forward */}
            <button
              onClick={(e) => skipSeconds(-15, e)}
              className="p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Rewind 15s (J)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => skipSeconds(15, e)}
              className="p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Forward 15s (L)"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Timestamp Counter */}
            <span className="font-mono text-[11px] text-slate-300 ml-1">
              {formatTime(currentTimeMs)} <span className="text-slate-500">/</span> {formatTime(durationMs)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed Selector */}
            <button
              onClick={cycleSpeed}
              className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 font-mono text-[11px] font-semibold text-white transition-colors cursor-pointer"
            >
              {playbackRate}x
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
