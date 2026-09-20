"use client";

import React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
} from "lucide-react";
import { SummaryTopic } from "@/lib/seed-meetings";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTimeMs: number;
  durationMs: number;
  onSeek: (ms: number) => void;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  topics?: SummaryTopic[];
  highlights?: Array<{ start_ms: number; end_ms?: number }>;
}

export function PlayerControls({
  isPlaying,
  onPlayPause,
  currentTimeMs,
  durationMs,
  onSeek,
  playbackRate,
  onPlaybackRateChange,
  topics = [],
  highlights = [],
}: PlayerControlsProps) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPct = durationMs > 0 ? (currentTimeMs / durationMs) * 100 : 0;

  const handleScrubClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * durationMs);
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    onPlaybackRateChange(nextSpeed);
  };

  return (
    <div className="bg-black p-4 border-b border-[#26282d] select-none">
      {/* Scrub Bar with Chapter Ticks and Highlight Markers */}
      <div
        onClick={handleScrubClick}
        className="group relative w-full h-3 flex items-center cursor-pointer mb-3"
      >
        {/* Background Track */}
        <div className="w-full h-1 bg-[#26282d] group-hover:h-1.5 rounded-full overflow-hidden relative transition-all">
          {/* Progress fill */}
          <div
            style={{ width: `${progressPct}%` }}
            className="h-full bg-[#00b2ea] transition-all duration-75"
          />
        </div>

        {/* Chapter Ticks */}
        {topics.map((t, idx) => {
          const tickPct = (t.start_ms / durationMs) * 100;
          if (tickPct <= 0 || tickPct >= 100) return null;

          return (
            <div
              key={idx}
              style={{ left: `${tickPct}%` }}
              className="absolute w-0.5 h-2 bg-white/40 -translate-x-1/2 pointer-events-none"
              title={t.title}
            />
          );
        })}

        {/* Gold Highlight Markers */}
        {highlights.map((h, idx) => {
          const hlPct = (h.start_ms / durationMs) * 100;

          return (
            <div
              key={idx}
              style={{ left: `${hlPct}%` }}
              className="absolute w-1.5 h-3 bg-[#e8b923] rounded-xs -translate-x-1/2 shadow-xs"
              title="Highlight"
            />
          );
        })}

        {/* Playhead Handle */}
        <div
          style={{ left: `${progressPct}%` }}
          className="absolute w-3 h-3 bg-white rounded-full -translate-x-1/2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        />
      </div>

      {/* Control Buttons & Timestamps */}
      <div className="flex items-center justify-between text-xs text-[#9a9ba1]">
        {/* Left: Play/Pause, Skips, Time */}
        <div className="flex items-center gap-4">
          <button
            onClick={onPlayPause}
            className="w-8 h-8 rounded-full bg-white hover:bg-white/90 text-black flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={() => onSeek(Math.max(0, currentTimeMs - 10000))}
            className="hover:text-white transition-colors cursor-pointer"
            title="Rewind 10s"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSeek(Math.min(durationMs, currentTimeMs + 10000))}
            className="hover:text-white transition-colors cursor-pointer"
            title="Skip 10s"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <span className="font-mono text-[11px] text-white select-none">
            {formatTime(currentTimeMs)} / {formatTime(durationMs)}
          </span>
        </div>

        {/* Right: Speed, Volume, Mini-player */}
        <div className="flex items-center gap-4">
          {/* Speed Toggle */}
          <button
            onClick={cycleSpeed}
            className="px-2 py-0.5 rounded bg-[#1e2024] hover:bg-[#26282d] border border-[#2f3238] text-white font-mono text-[11px] font-semibold transition-colors cursor-pointer"
          >
            {playbackRate}x
          </button>

          <button
            className="hover:text-white transition-colors cursor-pointer"
            title="Volume"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            className="hover:text-white transition-colors cursor-pointer"
            title="Mini Player"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
