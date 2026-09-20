"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { TopBar } from "@/components/shell/TopBar";
import { AskFathomPanel } from "@/components/home/AskFathomPanel";
import { Meeting } from "@/lib/seed-meetings";
import { UploadModal } from "@/components/home/UploadModal";
import { Loader2, MoreHorizontal } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"my" | "team" | "playlists" | "alerts" | "deals">("my");
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
          {/* Subheader: My Calls, Team Calls, Playlists, Alerts, Deals */}
          <div className="h-11 border-b border-[#26282d] px-6 flex items-center justify-between select-none bg-[#111214] sticky top-0 z-10">
            <div className="flex items-center gap-7 h-full">
              {/* My Calls with Tooltip */}
              <div className="relative group h-full flex items-center">
                <button
                  onClick={() => setActiveTab("my")}
                  className={`h-full text-xs font-semibold transition-colors relative cursor-pointer flex items-center ${
                    activeTab === "my"
                      ? "text-[#00b2ea]"
                      : "text-[#d1d5db] hover:text-white"
                  }`}
                >
                  <span>My Calls</span>
                  {activeTab === "my" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b2ea]" />
                  )}
                </button>
                <div className="absolute top-10 left-0 hidden group-hover:block bg-[#1f2228] text-white text-[10px] px-2 py-0.5 rounded shadow-lg border border-[#323640] whitespace-nowrap z-50 pointer-events-none">
                  Click to return home
                </div>
              </div>

              {/* Team Calls */}
              <button
                onClick={() => setActiveTab("team")}
                className={`h-full text-xs font-semibold transition-colors relative cursor-pointer flex items-center ${
                  activeTab === "team"
                    ? "text-[#00b2ea]"
                    : "text-[#d1d5db] hover:text-white"
                }`}
              >
                <span>Team Calls</span>
                {activeTab === "team" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b2ea]" />
                )}
              </button>

              {/* Playlists */}
              <button
                onClick={() => setActiveTab("playlists")}
                className={`h-full text-xs font-semibold transition-colors relative cursor-pointer flex items-center ${
                  activeTab === "playlists"
                    ? "text-[#00b2ea]"
                    : "text-[#d1d5db] hover:text-white"
                }`}
              >
                <span>Playlists</span>
                {activeTab === "playlists" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b2ea]" />
                )}
              </button>

              {/* Alerts */}
              <button
                onClick={() => setActiveTab("alerts")}
                className={`h-full text-xs font-semibold transition-colors relative cursor-pointer flex items-center ${
                  activeTab === "alerts"
                    ? "text-[#00b2ea]"
                    : "text-[#d1d5db] hover:text-white"
                }`}
              >
                <span>Alerts</span>
                {activeTab === "alerts" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b2ea]" />
                )}
              </button>

              {/* Deals */}
              <button
                onClick={() => setActiveTab("deals")}
                className={`h-full text-xs font-semibold transition-colors relative cursor-pointer flex items-center ${
                  activeTab === "deals"
                    ? "text-[#00b2ea]"
                    : "text-[#d1d5db] hover:text-white"
                }`}
              >
                <span>Deals</span>
                {activeTab === "deals" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b2ea]" />
                )}
              </button>
            </div>
          </div>

          {/* Video Cards Grid */}
          <div className="flex-1 p-6 space-y-8 max-w-[1400px]">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-3 text-xs text-[#9a9ba1]">
                <Loader2 className="w-6 h-6 animate-spin text-[#00b2ea]" />
                <span>Loading calls...</span>
              </div>
            ) : error ? (
              <div className="p-6 rounded-xl bg-[#2a1215] border border-[#f87171]/40 text-xs text-[#fca5a5]">
                <p className="font-semibold mb-1">Unable to load calls</p>
                <p>{error}</p>
              </div>
            ) : (
              <>
                {/* Section: Today */}
                <div>
                  <h2 className="text-sm font-bold text-white mb-3">Today</h2>

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
                    <h2 className="text-sm font-bold text-white mb-3">Earlier</h2>
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
    <div className="group block focus:outline-none">
      <Link href={`/calls/${meeting.id}`} className="block">
        {/* 16:9 Thumbnail Container */}
        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-[#1e2024] border border-[#26282d] group-hover:border-[#3a3d45] transition-all">
          {meeting.thumbnail_url ? (
            <Image
              src={meeting.thumbnail_url}
              alt={meeting.title}
              fill
              className="object-cover group-hover:scale-102 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-[#1e2024] flex items-center justify-center text-[#9a9ba1] text-xs">
              <span>Video Recording</span>
            </div>
          )}

          {/* Bottom-left Badge: exact text Click "Start Recording" in Fathom for test call */}
          <div className="absolute left-2 bottom-2 px-2 py-0.5 rounded bg-black/85 backdrop-blur-xs text-[10px] text-white font-medium shadow-sm max-w-[80%] truncate">
            {meeting.id === "829997322" || meeting.title.toLowerCase().includes("test call")
              ? 'Click "Start Recording" in Fathom'
              : meeting.owner_name || "Team Call"}
          </div>

          {/* Bottom-right Duration Badge */}
          <div className="absolute right-2 bottom-2 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-xs text-[10px] text-white font-medium shadow-sm">
            {durationMin} mins
          </div>
        </div>
      </Link>

      {/* Title & Actions Below Thumbnail */}
      <div className="mt-2 flex items-center justify-between">
        <Link
          href={`/calls/${meeting.id}`}
          className="text-xs font-semibold text-white group-hover:text-[#00b2ea] transition-colors truncate flex-1"
        >
          {meeting.title}
        </Link>
        <button
          type="button"
          className="text-[#6b7280] hover:text-white p-1 rounded transition-colors cursor-pointer shrink-0 ml-1"
          title="More options"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
