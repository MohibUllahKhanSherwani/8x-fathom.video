"use client";

import React from "react";
import { Participant } from "@/lib/seed-meetings";

interface SpeakerStageProps {
  participants: Participant[];
  activeSpeakerName: string | null;
  currentTimeMs: number;
}

export function SpeakerStage({
  participants,
  activeSpeakerName,
}: SpeakerStageProps) {
  // Grid layout adapts based on participant count (2 to 8)
  const count = participants.length;
  const gridCols =
    count <= 2
      ? "grid-cols-2"
      : count <= 4
      ? "grid-cols-2"
      : count <= 6
      ? "grid-cols-3"
      : "grid-cols-4";

  return (
    <div className="w-full bg-black rounded-t-xl overflow-hidden p-4 border-b border-[#26282d]">
      <div className={`grid ${gridCols} gap-3 max-w-2xl mx-auto`}>
        {participants.map((p) => {
          const isActive = activeSpeakerName === p.name;

          return (
            <div
              key={p.id}
              className={`relative aspect-video rounded-lg bg-[#1a1d24] flex flex-col items-center justify-center p-2 transition-all duration-150 ${
                isActive
                  ? "ring-2 ring-[#3dbb6b] shadow-lg shadow-[#3dbb6b]/20 bg-[#222730]"
                  : "border border-[#2e3440]/60 opacity-85 hover:opacity-100"
              }`}
            >
              {/* Speaker Avatar Circle */}
              <div
                style={{ backgroundColor: p.color }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md mb-2 select-none"
              >
                {p.name.charAt(0)}
              </div>

              {/* Name & Role Label */}
              <div className="text-center truncate max-w-[90%]">
                <span className="text-[11px] font-semibold text-white truncate block">
                  {p.name}
                </span>
                {p.talk_pct && (
                  <span className="text-[9px] text-[#9a9ba1] block">
                    {p.talk_pct}% talk time
                  </span>
                )}
              </div>

              {/* Active Audio Indicator Ping */}
              {isActive && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#3dbb6b]/20 border border-[#3dbb6b]/50 px-1.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3dbb6b] animate-pulse" />
                  <span className="text-[9px] font-bold text-[#3dbb6b]">LIVE</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
