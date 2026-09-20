"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Copy, Plus, MoreHorizontal, ArrowDown, Check } from "lucide-react";
import { Segment, Participant } from "@/lib/seed-meetings";

interface TranscriptViewProps {
  segments: Segment[];
  participants: Participant[];
  currentTimeMs: number;
  onSeek: (ms: number) => void;
  onAddHighlight: (start_ms: number, end_ms: number) => void;
  onAddActionItem: (text: string, start_ms: number) => void;
  highlights?: Array<{ start_ms: number; end_ms?: number }>;
}

export function TranscriptView({
  segments,
  participants,
  currentTimeMs,
  onSeek,
  onAddHighlight,
  onAddActionItem,
  highlights = [],
}: TranscriptViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeMenuSegmentId, setActiveMenuSegmentId] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeBubbleRef = useRef<HTMLDivElement>(null);

  // Binary search for active segment
  const activeSegmentIndex = useMemo(() => {
    let low = 0;
    let high = segments.length - 1;
    let result = -1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (segments[mid].start_ms <= currentTimeMs) {
        result = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return result;
  }, [segments, currentTimeMs]);

  // Auto-scroll to active bubble if enabled
  useEffect(() => {
    if (isAutoScroll && activeBubbleRef.current) {
      activeBubbleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeSegmentIndex, isAutoScroll]);

  // Handle user manual scroll
  const handleScroll = () => {
    if (isAutoScroll) {
      // Temporarily disable auto-scroll on manual scroll
      setIsAutoScroll(false);
    }
  };

  // Copy full transcript
  const handleCopyTranscript = () => {
    const text = segments
      .map((s) => {
        const min = Math.floor(s.start_ms / 60000);
        const sec = Math.floor((s.start_ms % 60000) / 1000);
        const time = `${min}:${sec < 10 ? "0" : ""}${sec}`;
        return `[${time}] ${s.speaker}: ${s.text}`;
      })
      .join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format mm:ss
  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Filter segments
  const filteredSegments = segments.filter((s) => {
    if (selectedSpeaker && s.speaker !== selectedSpeaker) return false;
    if (searchQuery.trim()) {
      return s.text.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-black text-white relative">
      {/* Tab Subheader Controls */}
      <div className="p-4 border-b border-[#26282d] flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#9a9ba1] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238] focus:border-[#00b2ea] rounded-full text-xs text-white placeholder-[#9a9ba1] outline-none transition-all"
          />
        </div>

        {/* Copy Transcript Button */}
        <button
          onClick={handleCopyTranscript}
          className="h-8 px-3 rounded-lg border border-[#00b2ea]/40 hover:border-[#00b2ea] bg-[#00b2ea]/10 text-[#00b2ea] font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied!" : "Copy Transcript"}</span>
        </button>
      </div>

      {/* Speaker Filter Chips */}
      <div className="px-4 py-2 border-b border-[#26282d] flex items-center gap-2 overflow-x-auto no-scrollbar select-none">
        <span className="text-[10px] uppercase font-semibold text-[#9a9ba1] shrink-0">
          Speakers:
        </span>
        <button
          onClick={() => setSelectedSpeaker(null)}
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
            selectedSpeaker === null
              ? "bg-[#00b2ea] text-black font-semibold"
              : "bg-[#1e2024] text-[#9a9ba1] hover:text-white"
          }`}
        >
          All
        </button>
        {participants.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedSpeaker(selectedSpeaker === p.name ? null : p.name)}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
              selectedSpeaker === p.name
                ? "bg-[#00b2ea] text-black font-semibold"
                : "bg-[#1e2024] text-[#9a9ba1] hover:text-white"
            }`}
          >
            {p.name} {p.talk_pct ? `(${p.talk_pct}%)` : ""}
          </button>
        ))}
      </div>

      {/* Segments Stream */}
      <div
        ref={containerRef}
        onWheel={handleScroll}
        onTouchMove={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-4 relative"
      >
        {filteredSegments.map((segment) => {
          const isActive = segments[activeSegmentIndex]?.id === segment.id;
          const isHighlighted = highlights.some(
            (h) => segment.start_ms >= h.start_ms && (!h.end_ms || segment.start_ms <= h.end_ms)
          );

          return (
            <div
              key={segment.id}
              ref={isActive ? activeBubbleRef : null}
              className="group relative flex items-start gap-2"
            >
              {/* Left Hover (+) Action Button */}
              <div className="w-6 shrink-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                <button
                  onClick={() => onAddHighlight(segment.start_ms, segment.end_ms)}
                  className="w-5 h-5 rounded-full bg-[#00b2ea] hover:bg-[#00c5ff] text-black flex items-center justify-center cursor-pointer shadow-sm"
                  title="Add Highlight from here"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                </button>
              </div>

              {/* Main Utterance Content */}
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-semibold text-[#9a9ba1] block mb-1">
                  {segment.speaker}
                </span>

                <div
                  onClick={() => onSeek(segment.start_ms)}
                  className={`relative p-3.5 rounded-xl cursor-pointer transition-all duration-150 text-xs leading-relaxed ${
                    isActive
                      ? "bg-[#282d38] border border-[#00b2ea] text-white shadow-md shadow-[#00b2ea]/10"
                      : "bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238]/60 text-[#d1d5db]"
                  } ${isHighlighted ? "border-l-4 border-l-[#e8b923]" : ""}`}
                >
                  <p>{segment.text}</p>

                  {/* Timestamp on Hover */}
                  <span className="absolute right-3 top-3 text-[10px] font-mono text-[#9a9ba1] opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatTime(segment.start_ms)}
                  </span>
                </div>
              </div>

              {/* Right Hover (...) Menu */}
              <div className="w-6 shrink-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity mt-2 relative">
                <button
                  onClick={() =>
                    setActiveMenuSegmentId(
                      activeMenuSegmentId === segment.id ? null : segment.id
                    )
                  }
                  className="w-5 h-5 rounded-full bg-[#2a2c32] hover:bg-[#34373e] text-[#9a9ba1] hover:text-white flex items-center justify-center cursor-pointer"
                  title="More actions"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </button>

                {activeMenuSegmentId === segment.id && (
                  <div className="absolute right-0 top-6 w-44 bg-[#1e2024] border border-[#2f3238] rounded-lg shadow-xl py-1 z-30 text-xs">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(segment.text);
                        setActiveMenuSegmentId(null);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#2a2c32] text-white"
                    >
                      Copy text
                    </button>
                    <button
                      onClick={() => {
                        onAddActionItem(segment.text, segment.start_ms);
                        setActiveMenuSegmentId(null);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#2a2c32] text-white"
                    >
                      Add as action item
                    </button>
                    <a
                      href={`/clip/launch-decision`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setActiveMenuSegmentId(null)}
                      className="block w-full text-left px-3 py-1.5 hover:bg-[#2a2c32] text-[#e8b923]"
                    >
                      ✂️ Create & Share Clip
                    </a>
                    <button
                      onClick={() => {
                        onSeek(segment.start_ms);
                        setActiveMenuSegmentId(null);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#2a2c32] text-[#00b2ea]"
                    >
                      Jump to this moment
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>


      {/* Resume Auto-Scroll Floating Pill */}
      {!isAutoScroll && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={() => setIsAutoScroll(true)}
            className="px-4 py-1.5 rounded-full bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-semibold text-xs flex items-center gap-1.5 shadow-xl transition-all cursor-pointer"
          >
            <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Resume Auto-Scroll</span>
          </button>
        </div>
      )}
    </div>
  );
}
