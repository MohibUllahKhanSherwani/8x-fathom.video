"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Copy, Plus, ArrowDown, Check, Clock, Quote } from "lucide-react";
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
  const [copiedSnippetId, setCopiedSnippetId] = useState<number | null>(null);

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

  const copyQuoteSnippet = (s: Segment) => {
    const time = formatTime(s.start_ms);
    const quote = `"${s.text}" — ${s.speaker} [${time}]`;
    navigator.clipboard.writeText(quote);
    setCopiedSnippetId(s.idx || s.id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
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
    <div className="flex flex-col h-full bg-[#0a0d14] relative select-text">
      {/* Transcript Toolbar */}
      <div className="p-4 border-b border-white/6 flex flex-wrap items-center justify-between gap-3 bg-[#0d101a] sticky top-0 z-20">
        {/* Search inside transcript */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search within spoken phrases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 bg-[#131724] border border-white/8 rounded-lg text-xs text-white placeholder-slate-400 outline-none focus:border-indigo-500/50"
          />
          {searchQuery.trim() && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">
              {filteredSegments.length} matches
            </span>
          )}
        </div>

        {/* Speaker Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedSpeaker(null)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedSpeaker === null
                ? "bg-indigo-600 text-white"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            All Speakers
          </button>
          {participants.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedSpeaker(p.name === selectedSpeaker ? null : p.name)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedSpeaker === p.name
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: p.color || "#6366f1" }}
              />
              <span>{p.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Copy Transcript Button */}
        <button
          onClick={handleCopyTranscript}
          className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/8 rounded-md text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy Full"}</span>
        </button>
      </div>

      {/* Segments Stream */}
      <div
        ref={containerRef}
        onWheel={handleScroll}
        className="flex-1 p-6 space-y-4 overflow-y-auto"
      >
        {filteredSegments.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-400">
            No spoken dialogue found matching criteria.
          </div>
        ) : (
          filteredSegments.map((segment) => {
            const isActive =
              currentTimeMs >= segment.start_ms && currentTimeMs <= segment.end_ms;
            const participant = participants.find((p) => p.name === segment.speaker);
            const isHighlighted = highlights.some(
              (h) => segment.start_ms >= h.start_ms && segment.start_ms <= (h.end_ms || h.start_ms)
            );

            return (
              <div
                key={segment.id || segment.idx}
                ref={isActive ? activeBubbleRef : null}
                className={`p-4 rounded-xl transition-all duration-150 group relative ${
                  isActive
                    ? "bg-[#141a2a] border-l-3 border-indigo-500 shadow-md"
                    : isHighlighted
                    ? "bg-[#181610] border-l-2 border-amber-400/80"
                    : "hover:bg-white/2"
                }`}
              >
                {/* Speaker Header & Timestamp */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      style={{ backgroundColor: participant?.color || "#6366f1" }}
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    >
                      {segment.speaker?.charAt(0) || "S"}
                    </div>
                    <span className="font-semibold text-xs text-slate-200">
                      {segment.speaker}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>

                  {/* Click to Seek Timestamp Badge */}
                  <button
                    onClick={() => onSeek(segment.start_ms)}
                    className="flex items-center gap-1 font-mono text-[10px] text-slate-400 hover:text-cyan-300 px-1.5 py-0.5 rounded bg-white/4 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                    title="Jump to this exact moment"
                  >
                    <Clock className="w-2.5 h-2.5" />
                    <span>{formatTime(segment.start_ms)}</span>
                  </button>
                </div>

                {/* Spoken Text */}
                <p
                  onClick={() => onSeek(segment.start_ms)}
                  className={`text-xs leading-relaxed cursor-pointer ${
                    isActive ? "text-white font-medium" : "text-slate-300"
                  }`}
                >
                  {segment.text}
                </p>

                {/* Hover Quick Actions */}
                <div className="absolute right-3 top-3 hidden group-hover:flex items-center gap-1 bg-[#101420] border border-white/10 rounded-lg p-1 shadow-lg">
                  <button
                    onClick={() => copyQuoteSnippet(segment)}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"
                    title="Copy Quote with Timestamp"
                  >
                    {copiedSnippetId === (segment.idx || segment.id) ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Quote className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onClick={() => onAddHighlight(segment.start_ms, segment.end_ms)}
                    className="p-1 text-slate-400 hover:text-amber-400 rounded hover:bg-white/10 transition-colors"
                    title="Highlight key moment"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating "Resume Auto-Scroll" Button */}
      {!isAutoScroll && (
        <button
          onClick={() => {
            setIsAutoScroll(true);
            if (activeBubbleRef.current) {
              activeBubbleRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-full shadow-2xl flex items-center gap-1.5 transition-all cursor-pointer z-30"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>Resume Auto-Scroll</span>
        </button>
      )}
    </div>
  );
}
