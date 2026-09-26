"use client";

import React from "react";
import { Participant } from "@/lib/seed-meetings";

interface SpeakerStageProps {
  participants: Participant[];
  activeSpeakerName: string | null;
  currentTimeMs: number;
  onSelectSpeaker?: (speakerName: string | null) => void;
  selectedSpeaker?: string | null;
}

export function SpeakerStage({
  participants,
  activeSpeakerName,
  onSelectSpeaker,
  selectedSpeaker,
}: SpeakerStageProps) {
  const count = participants.length;
  const gridCols =
    count <= 2
      ? "grid-cols-2"
      : count <= 4
      ? "grid-cols-2 sm:grid-cols-4"
      : count <= 6
      ? "grid-cols-3 sm:grid-cols-6"
      : "grid-cols-4 sm:grid-cols-8";

  return (
    <div className="w-full bg-[#0a0d14] p-4 border-b border-white/6">
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Active Speaker Stage</span>
          <span className="text-[10px] text-slate-500 font-mono">
            {participants.length} participants
          </span>
        </div>
        {selectedSpeaker && (
          <button
            onClick={() => onSelectSpeaker?.(null)}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
          >
            Clear speaker filter
          </button>
        )}
      </div>

      <div className={`grid ${gridCols} gap-2.5`}>
        {participants.map((p) => {
          const isActive = activeSpeakerName === p.name;
          const isFiltered = selectedSpeaker === p.name;

          return (
            <div
              key={p.id}
              onClick={() => onSelectSpeaker?.(isFiltered ? null : p.name)}
              className={`relative rounded-xl p-3 flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                isActive
                  ? "bg-[#182032] ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20"
                  : isFiltered
                  ? "bg-indigo-950/60 ring-1 ring-indigo-500"
                  : "bg-[#121622]/80 hover:bg-[#161c2c] border border-white/5"
              }`}
            >
              {/* Speaker Avatar Circle */}
              <div
                style={{ backgroundColor: p.color || "#6366f1" }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md mb-2 relative"
              >
                {p.name.charAt(0)}

                {/* Pulse wave animation if active */}
                {isActive && (
                  <span className="absolute -inset-1 rounded-full border border-emerald-400/60 animate-ping pointer-events-none" />
                )}
              </div>

              {/* Name & Talk-time */}
              <div className="text-center w-full truncate">
                <span className="text-[11px] font-semibold text-white truncate block">
                  {p.name.split(" ")[0]}
                </span>
                {p.talk_pct !== undefined && (
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    {p.talk_pct}% talk
                  </span>
                )}
              </div>

              {/* Active Audio Wave Indicator */}
              {isActive && (
                <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-emerald-500/20 border border-emerald-500/40 px-1 py-0.5 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider">ON</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
