"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Settings,
  HelpCircle,
  Clock,
  MessageSquare,
  ChevronRight,
  Plus,
  Sparkles,
  LogOut,
  Command,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { DEMO_USER } from "@/lib/constants";
import type { GlobalSearchResults } from "@/lib/search";

interface TopBarProps {
  isPublic?: boolean;
  onSearchFocus?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onNewMeetingClick?: () => void;
}

export function TopBar({
  isPublic = false,
  onSearchFocus,
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
  onNewMeetingClick,
}: TopBarProps) {
  const router = useRouter();
  const [internalQuery, setInternalQuery] = useState("");
  const query = externalSearchQuery !== undefined ? externalSearchQuery : internalQuery;
  const [searchResults, setSearchResults] = useState<GlobalSearchResults | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Debounced search to /api/search endpoint
  useEffect(() => {
    if (!query.trim()) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setIsOpen(true);
          setSelectedIndex(0);
        }
      } catch (err) {
        console.error("Error executing database search:", err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleQueryChange = (val: string) => {
    if (externalOnSearchChange) {
      externalOnSearchChange(val);
    } else {
      setInternalQuery(val);
    }
    if (!val.trim()) {
      setSearchResults(null);
      setIsOpen(false);
    }
  };

  // Keyboard shortcut: '/' or 'Cmd+K' focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Flattened items for keyboard navigation
  const allItems = searchResults
    ? [
        ...searchResults.meetings.map((m) => ({
          type: "meeting" as const,
          id: m.id,
          title: m.title,
          url: `/calls/${m.id}`,
        })),
        ...searchResults.transcripts.map((t) => ({
          type: "transcript" as const,
          id: `${t.meetingId}-${t.start_ms}`,
          title: t.meetingTitle,
          url: `/calls/${t.meetingId}?t=${t.start_ms}`,
        })),
      ]
    : [];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || allItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = allItems[selectedIndex];
      if (selected) {
        setIsOpen(false);
        router.push(selected.url);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const highlightMatch = (text: string, q: string) => {
    if (!q.trim()) return text;
    const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="bg-indigo-500/30 text-indigo-200 font-semibold rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (isPublic) {
    return (
      <header className="h-16 border-b border-white/5 bg-[#090a0f]/90 backdrop-blur-xl px-6 flex items-center justify-between select-none z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <Logo href="/" />
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-xs text-indigo-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Meeting Intelligence</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all"
          >
            Launch Live Demo
          </Link>
          <Link
            href="/login"
            className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 border-b border-white/6 bg-[#090a0f]/90 backdrop-blur-xl px-6 flex items-center justify-between select-none relative z-30 sticky top-0">
      {/* Left: Logo & Workspace Indicator */}
      <div className="flex items-center gap-6">
        <Logo href="/home" />

        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/8 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-200">Mohib&apos;s Workspace</span>
          <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
            PRO
          </span>
        </div>
      </div>

      {/* Center: Omni-Search Command Bar */}
      <div className="flex-1 max-w-lg mx-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search transcripts, decisions, attendees..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => {
              onSearchFocus?.();
              if (query.trim()) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className="w-full h-9.5 pl-10 pr-16 bg-[#131722]/80 hover:bg-[#161c2a] focus:bg-[#161c2a] border border-white/8 focus:border-indigo-500/60 rounded-xl text-xs text-white placeholder-slate-400 outline-none transition-all shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none text-[10px] text-slate-400 bg-white/5 border border-white/8 px-1.5 py-0.5 rounded-md">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>

          {/* Search Results Popover */}
          {isOpen && searchResults && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-12 bg-[#0f131d]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 text-xs max-h-[500px] overflow-y-auto"
            >
              {searchResults.totalMatches === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  <p className="font-medium text-slate-300">No results found for &ldquo;{query}&rdquo;</p>
                  <p className="text-[11px] mt-1 text-slate-500">Try searching for keywords like &ldquo;pricing&rdquo;, &ldquo;SOC 2&rdquo;, or &ldquo;roadmap&rdquo;</p>
                </div>
              ) : (
                <div className="py-2.5">
                  {/* MEETINGS GROUP */}
                  {searchResults.meetings.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-white/2 flex items-center justify-between">
                        <span>Meetings</span>
                        <span className="text-slate-500 font-mono">{searchResults.meetings.length}</span>
                      </div>
                      {searchResults.meetings.map((m, idx) => {
                        const isSelected = selectedIndex === idx;
                        return (
                          <Link
                            key={m.id}
                            href={`/calls/${m.id}`}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-start gap-3.5 px-4 py-3 transition-colors ${
                              isSelected ? "bg-indigo-600/15 border-l-2 border-indigo-500" : "hover:bg-white/4"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
                              <Clock className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-white truncate text-xs">
                                {highlightMatch(m.title, query)}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                {m.snippet ? (
                                  highlightMatch(m.snippet, query)
                                ) : (
                                  `${Math.round(m.duration_sec / 60)} mins • ${m.participantCount} participants`
                                )}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 self-center" />
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* TRANSCRIPT MOMENTS GROUP */}
                  {searchResults.transcripts.length > 0 && (
                    <div className="mt-2 border-t border-white/6 pt-2">
                      <div className="px-4 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-white/2 flex items-center justify-between">
                        <span>Spoken Moments</span>
                        <span className="text-slate-500 font-mono">{searchResults.transcripts.length}</span>
                      </div>
                      {searchResults.transcripts.map((t, tIdx) => {
                        const itemIndex = searchResults.meetings.length + tIdx;
                        const isSelected = selectedIndex === itemIndex;
                        return (
                          <Link
                            key={`${t.meetingId}-${t.start_ms}`}
                            href={`/calls/${t.meetingId}?t=${t.start_ms}`}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-start gap-3.5 px-4 py-3 transition-colors ${
                              isSelected ? "bg-indigo-600/15 border-l-2 border-indigo-500" : "hover:bg-white/4"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                              <MessageSquare className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-200">{t.speaker}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                  {t.timestampLabel}
                                </span>
                                <span className="text-[11px] text-slate-400 truncate">
                                  in {t.meetingTitle}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                                &ldquo;{highlightMatch(t.text, query)}&rdquo;
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 self-center" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions, New Meeting CTA & User Profile */}
      <div className="flex items-center gap-4">
        {onNewMeetingClick && (
          <button
            onClick={onNewMeetingClick}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload Recording</span>
          </button>
        )}

        <div className="flex items-center gap-2 border-l border-white/8 pl-3">
          <Link
            href="/settings"
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Avatar Menu */}
          <div className="relative ml-1">
            <button
              onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center cursor-pointer ring-2 ring-white/10 hover:ring-indigo-500/50 transition-all"
              title={DEMO_USER.name}
            >
              {DEMO_USER.avatar}
            </button>

            {showAvatarMenu && (
              <div className="absolute right-0 mt-2.5 w-56 bg-[#111520] border border-white/10 rounded-2xl shadow-2xl py-1.5 z-50 text-xs text-white">
                <div className="px-4 py-3 border-b border-white/6">
                  <p className="font-semibold text-white">{DEMO_USER.name}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{DEMO_USER.email}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Real Database Connected</span>
                  </div>
                </div>
                <Link
                  href="/settings"
                  onClick={() => setShowAvatarMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-white/5 transition-colors text-slate-300"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Account & Settings</span>
                </Link>
                <Link
                  href="/demo"
                  onClick={() => setShowAvatarMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-white/5 transition-colors text-indigo-300"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Sandbox Demo Mode</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setShowAvatarMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-white/5 text-rose-400 transition-colors border-t border-white/6 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121622] border border-white/10 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 text-white mb-2 font-semibold text-sm">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <span>Fathom Help & Shortcuts</span>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Fathom AI is your high-velocity executive meeting intelligence platform with synchronized audio playback, automated summaries, and instant quote clipping.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/3 border border-white/5">
                <span className="text-slate-300">Focus Search</span>
                <kbd className="px-2 py-0.5 bg-black/40 rounded border border-white/10 text-[10px] font-mono text-slate-300">⌘K or /</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/3 border border-white/5">
                <span className="text-slate-300">Play / Pause</span>
                <kbd className="px-2 py-0.5 bg-black/40 rounded border border-white/10 text-[10px] font-mono text-slate-300">Space</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/3 border border-white/5">
                <span className="text-slate-300">Skip 15s</span>
                <kbd className="px-2 py-0.5 bg-black/40 rounded border border-white/10 text-[10px] font-mono text-slate-300">J / L</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-5 w-full py-2 bg-white/8 hover:bg-white/12 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
