"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Gift,
  Settings,
  HelpCircle,
  Star,
  LogOut,
  Clock,
  MessageSquare,
  ChevronRight,
  User,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { DEMO_USER } from "@/lib/constants";
import { searchMeetings, GlobalSearchResults } from "@/lib/search";

interface TopBarProps {
  isPublic?: boolean;
  onSearchFocus?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function TopBar({
  isPublic = false,
  onSearchFocus,
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
}: TopBarProps) {
  const router = useRouter();
  const [internalQuery, setInternalQuery] = useState("");
  const query = externalSearchQuery !== undefined ? externalSearchQuery : internalQuery;
  const [searchResults, setSearchResults] = useState<GlobalSearchResults | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showReferModal, setShowReferModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleQueryChange = (val: string) => {
    if (externalOnSearchChange) {
      externalOnSearchChange(val);
    } else {
      setInternalQuery(val);
    }

    if (val.trim()) {
      const results = searchMeetings(val);
      setSearchResults(results);
      setIsOpen(true);
      setSelectedIndex(0);
    } else {
      setSearchResults(null);
      setIsOpen(false);
    }
  };

  // Keyboard shortcut: '/' focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
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
        <mark key={i} className="bg-[#00b2ea]/30 text-white font-semibold rounded-xs px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (isPublic) {
    return (
      <header className="h-14 border-b border-[#26282d] bg-[#111214] px-6 flex items-center justify-between select-none z-30">
        <div className="flex items-center gap-4">
          <Logo href="/" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e8b923]/40 bg-[#e8b923]/10 text-xs text-[#e8b923] font-medium">
            <span>Get your own free AI Notetaker</span>
            <span>🔥</span>
          </div>
        </div>
        <div>
          <Link
            href="/login"
            className="px-4 py-1.5 text-sm font-semibold text-white hover:text-[#00b2ea] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="h-14 border-b border-[#26282d] bg-[#111214] px-5 flex items-center justify-between select-none relative z-30">
      {/* Left: Logo + Global Search */}
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        <Logo href="/home" />

        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#9a9ba1] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Call Recordings"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => {
              onSearchFocus?.();
              if (query.trim()) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className="w-full h-8 pl-8 pr-4 bg-[#1e2024] hover:bg-[#25282e] focus:bg-[#25282e] border border-[#2f3238] focus:border-[#00b2ea] rounded-md text-xs text-white placeholder-[#9a9ba1] outline-none transition-all"
          />

          {/* Search Dropdown */}
          {isOpen && searchResults && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-11 bg-[#161719] border border-[#2f3238] rounded-xl shadow-2xl overflow-hidden z-50 text-xs max-h-[480px] overflow-y-auto"
            >
              {searchResults.totalMatches === 0 ? (
                <div className="p-4 text-center text-[#9a9ba1]">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                <div className="py-2">
                  {/* MEETINGS GROUP */}
                  {searchResults.meetings.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[#9a9ba1] tracking-wider bg-[#111214]">
                        Meetings ({searchResults.meetings.length})
                      </div>
                      {searchResults.meetings.map((m, idx) => {
                        const isSelected = selectedIndex === idx;
                        return (
                          <Link
                            key={m.id}
                            href={`/calls/${m.id}`}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-start gap-3 px-3 py-2.5 transition-colors ${
                              isSelected ? "bg-[#25282e]" : "hover:bg-[#1e2024]"
                            }`}
                          >
                            <div className="w-7 h-7 rounded-lg bg-[#1e2024] border border-[#2f3238] flex items-center justify-center shrink-0 mt-0.5 text-[#00b2ea]">
                              <Clock className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-white truncate">
                                {highlightMatch(m.title, query)}
                              </p>
                              <p className="text-[11px] text-[#9a9ba1] truncate mt-0.5">
                                {m.snippet ? (
                                  highlightMatch(m.snippet, query)
                                ) : (
                                  `${Math.round(m.duration_sec / 60)} mins • ${m.participantCount} participants`
                                )}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#9a9ba1] shrink-0 self-center" />
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* TRANSCRIPT MOMENTS GROUP */}
                  {searchResults.transcripts.length > 0 && (
                    <div className="mt-2 border-t border-[#26282d] pt-2">
                      <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[#9a9ba1] tracking-wider bg-[#111214]">
                        Transcript Moments ({searchResults.transcripts.length})
                      </div>
                      {searchResults.transcripts.map((t, tIdx) => {
                        const itemIndex = searchResults.meetings.length + tIdx;
                        const isSelected = selectedIndex === itemIndex;
                        return (
                          <Link
                            key={`${t.meetingId}-${t.start_ms}`}
                            href={`/calls/${t.meetingId}?t=${t.start_ms}`}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-start gap-3 px-3 py-2.5 transition-colors ${
                              isSelected ? "bg-[#25282e]" : "hover:bg-[#1e2024]"
                            }`}
                          >
                            <div className="w-7 h-7 rounded-lg bg-[#1e2024] border border-[#2f3238] flex items-center justify-center shrink-0 mt-0.5 text-[#e8b923]">
                              <MessageSquare className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{t.speaker}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#00b2ea]/15 text-[#00b2ea] border border-[#00b2ea]/30">
                                  {t.timestampLabel}
                                </span>
                                <span className="text-[11px] text-[#9a9ba1] truncate">
                                  in {t.meetingTitle}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#d1d5db] line-clamp-2 mt-1 leading-relaxed">
                                &ldquo;{highlightMatch(t.text, query)}&rdquo;
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#9a9ba1] shrink-0 self-center" />
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


      {/* Right: Actions & User */}
      <div className="flex items-center gap-5 text-xs text-[#9a9ba1]">
        <button
          onClick={() => setShowReferModal(true)}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          <Gift className="w-4 h-4 text-[#9a9ba1]" />
          <span>Refer</span>
        </button>

        <Link
          href="/settings"
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <Settings className="w-4 h-4 text-[#9a9ba1]" />
          <span>Settings</span>
        </Link>

        <button
          onClick={() => setShowHelpModal(true)}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-[#9a9ba1]" />
          <span>Help & Feedback</span>
        </button>

        {/* Gold Points Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#242116] border border-[#e8b923]/40 text-[#e8b923] font-semibold text-xs">
          <Star className="w-3.5 h-3.5 fill-[#e8b923]" />
          <span>{DEMO_USER.points}</span>
        </div>

        {/* User Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
            className="w-8 h-8 rounded-full bg-[#00b2ea] text-white font-bold text-xs flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#00b2ea]/50 transition-all"
            title={DEMO_USER.name}
          >
            {DEMO_USER.avatar}
          </button>

          {showAvatarMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1e2024] border border-[#2f3238] rounded-lg shadow-2xl py-1 z-50 text-xs text-white">
              <div className="px-3 py-2 border-b border-[#2f3238]">
                <p className="font-semibold text-white">{DEMO_USER.name}</p>
                <p className="text-[11px] text-[#9a9ba1] truncate">{DEMO_USER.email}</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setShowAvatarMenu(false)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[#2a2c32] transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-[#9a9ba1]" />
                <span>Settings</span>
              </Link>
              <Link
                href="/login"
                onClick={() => setShowAvatarMenu(false)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[#2a2c32] text-[#ff4d4f] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Refer Modal */}
      {showReferModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e2024] border border-[#2f3238] rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-[#e8b923] mb-2 font-semibold">
              <Gift className="w-5 h-5" />
              <span>Refer & Earn Points</span>
            </div>
            <p className="text-xs text-[#9a9ba1] mb-4 leading-relaxed">
              Share Fathom with teammates. When they record their first call, you both earn 25 points!
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value="https://fathom.video/invite/demo-alex"
                className="flex-1 bg-[#161719] border border-[#2f3238] rounded px-3 py-1.5 text-xs text-white"
              />
              <button
                onClick={() => setShowReferModal(false)}
                className="px-3 py-1.5 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-semibold text-xs rounded transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e2024] border border-[#2f3238] rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-white mb-2 font-semibold text-sm">
              <HelpCircle className="w-5 h-5 text-[#00b2ea]" />
              <span>Help & Feedback</span>
            </div>
            <p className="text-xs text-[#9a9ba1] mb-4 leading-relaxed">
              Have questions or feedback about Fathom? Check our guides or reach out to support.
            </p>
            <div className="space-y-2 text-xs">
              <a
                href="#tutorial"
                onClick={(e) => { e.preventDefault(); setShowHelpModal(false); }}
                className="block p-2 rounded bg-[#161719] hover:bg-[#25282e] text-white transition-colors"
              >
                📖 Getting Started Tutorial (1 min)
              </a>
              <a
                href="#feedback"
                onClick={(e) => { e.preventDefault(); setShowHelpModal(false); }}
                className="block p-2 rounded bg-[#161719] hover:bg-[#25282e] text-white transition-colors"
              >
                💬 Send Product Feedback
              </a>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-4 w-full py-1.5 bg-[#2a2c32] hover:bg-[#34373e] text-white font-medium text-xs rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
