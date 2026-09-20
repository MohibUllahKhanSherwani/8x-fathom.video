"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
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
      className="relative aspect-video w-full bg-black overflow-hidden group cursor-pointer select-none"
    >
      {/* Video Frame or Poster */}
      {meeting.thumbnail_url ? (
        <Image
          src={meeting.thumbnail_url}
          alt={meeting.title}
          fill
          priority
          className="object-contain"
        />
      ) : (
        <div className="w-full h-full bg-[#161719] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#1e2024] border border-[#2f3238] flex items-center justify-center mx-auto mb-2 text-[#00b2ea]">
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </div>
            <p className="text-xs font-semibold text-white">{meeting.title}</p>
            <p className="text-[11px] text-[#9a9ba1]">Click to play</p>
          </div>
        </div>
      )}

      {/* Play/Pause Center Indicator on Pause */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-2xl">
            <Play className="w-6 h-6 ml-1 fill-white" />
          </div>
        </div>
      )}

      {/* Speaker Indicator Badge in Video Bottom-Left */}
      <div className="absolute left-3 bottom-10 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] text-white flex items-center gap-1.5 pointer-events-none shadow-sm">
        <span className="text-[#3dbb6b] font-mono">ıll</span>
        <span>{activeSpeakerName || meeting.participants[0]?.name || "Speaker"}</span>
      </div>

      {/* Bottom Controls Overlay Bar Matching Screenshot 15.png */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2.5 pt-6 flex flex-col gap-1.5 transition-opacity"
      >
        {/* Scrubber Bar */}
        <div
          onClick={handleScrubClick}
          className="relative w-full h-3 flex items-center cursor-pointer group/scrub"
        >
          {/* Background Bar */}
          <div className="w-full h-1 bg-white/30 group-hover/scrub:h-1.5 rounded-full overflow-hidden transition-all">
            <div
              style={{ width: `${progressPct}%` }}
              className="h-full bg-[#00b2ea]"
            />
          </div>

          {/* Scrubber Handle */}
          <div
            style={{ left: `${progressPct}%` }}
            className="absolute w-2.5 h-2.5 bg-white rounded-full -translate-x-1/2 shadow opacity-0 group-hover/scrub:opacity-100 transition-opacity pointer-events-none"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-3">
            {/* Play / Pause */}
            <button
              onClick={onPlayPause}
              className="text-white hover:text-[#00b2ea] transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
            </button>

            {/* Volume */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-white hover:text-[#00b2ea] transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Timestamp */}
            <span className="font-mono text-[11px] text-white">
              {formatTime(currentTimeMs)} / {formatTime(durationMs)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed */}
            <button
              onClick={cycleSpeed}
              className="px-1.5 py-0.5 rounded bg-black/50 hover:bg-black/80 border border-white/20 font-mono text-[10px] font-semibold text-white transition-colors cursor-pointer"
            >
              {playbackRate}x
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-[#00b2ea] transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
