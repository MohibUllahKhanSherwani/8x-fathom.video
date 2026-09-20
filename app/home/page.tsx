"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { TopBar } from "@/components/shell/TopBar";
import { AskFathomPanel } from "@/components/home/AskFathomPanel";
import { Meeting } from "@/lib/seed-meetings";
import { UploadModal } from "@/components/home/UploadModal";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"my" | "team" | "playlists" | "alerts" | "deals">("my");
  const [isCallsDropdownOpen, setIsCallsDropdownOpen] = useState(false);
  const [isAskFathomOpen, setIsAskFathomOpen] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch meetings dynamically from Supabase database
  useEffect(() => {
    let isCancelled = false;
    async function loadMeetings() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/meetings?tab=${activeTab}`);
        if (!res.ok) {
          throw new Error(`Failed to load meetings: ${res.statusText}`);
        }
        const data = await res.json();
        if (!isCancelled) {
          setMeetings(data.meetings || []);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const msg = err instanceof Error ? err.message : "Error fetching meetings";
          setError(msg);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadMeetings();
    return () => {
      isCancelled = true;
    };
  }, [activeTab]);

  // Filter meetings based on search query
  const filteredMeetings = meetings.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = m.title.toLowerCase().includes(q);
    const participantMatch = m.participants?.some((p) => p.name.toLowerCase().includes(q));
    return titleMatch || participantMatch;
  });

  // Group into Today vs Earlier
  const todayMeetings = filteredMeetings.filter((m) => m.seed_offset_minutes <= 1440);
  const earlierMeetings = filteredMeetings.filter((m) => m.seed_offset_minutes > 1440);

  return (
    <div className="min-h-screen bg-[#111214] flex flex-col select-none">
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Subheader: Calls Dropdown (My Calls ⌵ / Team Calls), Playlists, Alerts, Deals */}
          <div className="h-11 border-b border-[#26282d] px-6 flex items-center justify-between select-none bg-[#111214] sticky top-0 z-10">
            <div className="flex items-center gap-7 h-full">
              {/* Calls Dropdown: My Calls ⌵ / Team Calls */}
              <div className="relative h-full flex items-center">
                <button
                  onClick={() => setIsCallsDropdownOpen(!isCallsDropdownOpen)}
                  className={`h-full text-xs font-semibold flex items-center gap-1.5 transition-colors relative cursor-pointer ${
                    activeTab === "my" || activeTab === "team"
                      ? "text-[#00b2ea]"
                      : "text-[#d1d5db] hover:text-white"
                  }`}
                >
                  <span>{activeTab === "team" ? "Team Calls" : "My Calls"}</span>
                  <span className={`text-[10px] transition-transform duration-150 ${isCallsDropdownOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                  {(activeTab === "my" || activeTab === "team") && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b2ea]" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {isCallsDropdownOpen && (
                  <div className="absolute top-11 left-0 w-44 rounded-xl bg-[#1a1c22] border border-[#2e313b] shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() => {
                        setActiveTab("my");
                        setIsCallsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-[#252833] transition-colors cursor-pointer ${
                        activeTab === "my" ? "text-[#00b2ea] font-semibold" : "text-[#d1d5db]"
                      }`}
                    >
                      <span>My Calls</span>
                      {activeTab === "my" && <span className="text-xs">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("team");
                        setIsCallsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-[#252833] transition-colors cursor-pointer ${
                        activeTab === "team" ? "text-[#00b2ea] font-semibold" : "text-[#d1d5db]"
                      }`}
                    >
                      <span>Team Calls</span>
                      {activeTab === "team" && <span className="text-xs">✓</span>}
                    </button>
                  </div>
                )}
              </div>

              {/* Other Subheader Tabs */}
              {[
                { id: "playlists", label: "Playlists" },
                { id: "alerts", label: "Alerts" },
                { id: "deals", label: "Deals" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as typeof activeTab);
                      setIsCallsDropdownOpen(false);
                    }}
                    className={`h-full text-xs font-semibold transition-colors relative cursor-pointer ${
                      isActive
                        ? "text-[#00b2ea]"
                        : "text-[#d1d5db] hover:text-white"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b2ea]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Video Cards Grid */}
          <div className="flex-1 p-6 space-y-8 max-w-[1400px]">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-3 text-xs text-[#9a9ba1]">
                <Loader2 className="w-6 h-6 animate-spin text-[#00b2ea]" />
                <span>Loading calls from Supabase database...</span>
              </div>
            ) : error ? (
              <div className="p-6 rounded-xl bg-[#2a1215] border border-[#f87171]/40 text-xs text-[#fca5a5]">
                <p className="font-semibold mb-1">Database Error</p>
                <p>{error}</p>
              </div>
            ) : (
              <>
                {/* Section: Today */}
                <div>
                  <h2 className="text-sm font-bold text-white mb-4">Today</h2>

                  {todayMeetings.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#9a9ba1]">
                      No calls recorded today.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {todayMeetings.map((meeting) => (
                        <MeetingCard key={meeting.id} meeting={meeting} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Section: Earlier Calls */}
                {earlierMeetings.length > 0 && (
                  <div>
                    <h2 className="text-sm font-bold text-white mb-4">Earlier</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {earlierMeetings.map((meeting) => (
                        <MeetingCard key={meeting.id} meeting={meeting} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* Ask Fathom Right Panel */}
        <AskFathomPanel
          isOpen={isAskFathomOpen}
          onToggle={() => setIsAskFathomOpen(!isAskFathomOpen)}
        />
      </div>

      {/* Upload Recording Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const durationMin = Math.round(meeting.duration_sec / 60);

  return (
    <Link
      href={`/calls/${meeting.id}`}
      className="group block focus:outline-none"
    >
      {/* 16:9 Thumbnail Container */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-[#1e2024] border border-[#26282d] group-hover:border-[#3a3d45] transition-all">
        {meeting.thumbnail_url ? (
          <Image
            src={meeting.thumbnail_url}
            alt={meeting.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full bg-[#1e2024] flex items-center justify-center text-[#9a9ba1] text-xs">
            <span>Video Recording</span>
          </div>
        )}

        {/* Bottom-left Badge */}
        <div className="absolute left-2 bottom-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[10px] text-white font-medium shadow-sm">
          {meeting.id === "829997322"
            ? 'Click "Start Recording" in Fathom'
            : meeting.is_star
            ? "8-Person Star Meeting"
            : meeting.owner_name}
        </div>

        {/* Bottom-right Duration Badge */}
        <div className="absolute right-2 bottom-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[10px] text-white font-medium shadow-sm">
          {durationMin} mins
        </div>
      </div>

      {/* Title Below Thumbnail */}
      <div className="mt-2">
        <h3 className="text-xs font-semibold text-white group-hover:text-[#00b2ea] transition-colors truncate">
          {meeting.title}
        </h3>
      </div>
    </Link>
  );
}
