"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/shell/TopBar";
import { AskFathomPanel } from "@/components/home/AskFathomPanel";
import { SEED_MEETINGS, getRollingTimestamp, Meeting } from "@/lib/seed-meetings";
import { Plus, CheckSquare, Clock, Users, ArrowUpRight } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"my" | "team">("my");
  const [isAskFathomOpen, setIsAskFathomOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter meetings based on tab and search query
  const meetings = SEED_MEETINGS.filter((m) => {
    if (activeTab === "my" && m.visibility !== "private") return false;
    if (activeTab === "team" && m.visibility !== "team") return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const titleMatch = m.title.toLowerCase().includes(q);
    const participantMatch = m.participants.some((p) => p.name.toLowerCase().includes(q));
    const summaryMatch = m.summary.Enhanced?.key_takeaways.some((t) => t.toLowerCase().includes(q));
    return titleMatch || participantMatch || summaryMatch;
  });

  // Format relative date grouping
  const formatMeetingDate = (offsetMinutes: number) => {
    const d = new Date(Date.now() - offsetMinutes * 60 * 1000);
    const now = new Date();
    const diffHours = Math.round(offsetMinutes / 60);

    if (diffHours < 24 && d.getDate() === now.getDate()) {
      return `Today, ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    }
    if (diffHours < 48) {
      return `Yesterday, ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-[#111214] flex flex-col select-none">
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Subheader: My Calls / Team Calls Tabs */}
          <div className="h-12 border-b border-[#26282d] px-8 flex items-center justify-between select-none bg-[#111214] sticky top-0 z-10">
            <div className="flex items-center gap-8 h-full">
              <button
                onClick={() => setActiveTab("my")}
                className={`h-full font-semibold text-xs transition-colors relative cursor-pointer ${
                  activeTab === "my"
                    ? "text-[#00b2ea]"
                    : "text-[#9a9ba1] hover:text-white"
                }`}
              >
                <span>My Calls</span>
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-[#1e2024] text-[10px] text-[#9a9ba1]">
                  {SEED_MEETINGS.filter((m) => m.visibility === "private").length}
                </span>
                {activeTab === "my" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b2ea]" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("team")}
                className={`h-full font-semibold text-xs transition-colors relative cursor-pointer ${
                  activeTab === "team"
                    ? "text-[#00b2ea]"
                    : "text-[#9a9ba1] hover:text-white"
                }`}
              >
                <span>Team Calls</span>
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-[#1e2024] text-[10px] text-[#9a9ba1]">
                  {SEED_MEETINGS.filter((m) => m.visibility === "team").length}
                </span>
                {activeTab === "team" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b2ea]" />
                )}
              </button>
            </div>

            {/* Subheader Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/onboarding"
                className="h-8 px-3.5 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Notetaker</span>
              </Link>
            </div>
          </div>

          {/* Meeting List Container */}
          <div className="flex-1 p-8 max-w-5xl w-full mx-auto space-y-3">
            {meetings.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm font-semibold text-white mb-1">No matching calls found</p>
                <p className="text-xs text-[#9a9ba1]">Try adjusting your search query or switching tabs.</p>
              </div>
            ) : (
              meetings.map((meeting) => {
                const durationMin = Math.round(meeting.duration_sec / 60);
                const actionItemCount = meeting.action_items.length;

                return (
                  <Link
                    key={meeting.id}
                    href={`/calls/${meeting.id}`}
                    className="block group bg-[#161719] hover:bg-[#1e2024] border border-[#26282d] hover:border-[#3a3d45] rounded-xl p-4 transition-all duration-150 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Left: Meeting Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="font-bold text-sm text-white group-hover:text-[#00b2ea] transition-colors truncate">
                            {meeting.title}
                          </h3>
                          {meeting.is_star && (
                            <span className="px-2 py-0.5 rounded-full bg-[#00b2ea]/15 text-[#00b2ea] border border-[#00b2ea]/30 text-[10px] font-semibold">
                              Star Meeting
                            </span>
                          )}
                          {meeting.is_external && (
                            <span className="px-2 py-0.5 rounded-full bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/30 text-[10px] font-semibold">
                              External
                            </span>
                          )}
                        </div>

                        {/* Metadata row */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#9a9ba1]">
                          <span>{formatMeetingDate(meeting.seed_offset_minutes)}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{durationMin} mins</span>
                          </span>

                          {activeTab === "team" && (
                            <>
                              <span>•</span>
                              <span className="text-[#00b2ea] font-medium">Owner: {meeting.owner_name}</span>
                            </>
                          )}

                          {actionItemCount > 0 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-[#d1d5db]">
                                <CheckSquare className="w-3.5 h-3.5 text-[#3dbb6b]" />
                                <span>{actionItemCount} action items</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right: Stacked Participant Avatars */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex -space-x-2 overflow-hidden">
                          {meeting.participants.slice(0, 5).map((p) => (
                            <div
                              key={p.id}
                              style={{ backgroundColor: p.color }}
                              className="w-7 h-7 rounded-full border-2 border-[#161719] flex items-center justify-center text-[11px] font-bold text-white shadow-xs"
                              title={`${p.name} (${p.role || "Participant"})`}
                            >
                              {p.name.charAt(0)}
                            </div>
                          ))}
                          {meeting.participants.length > 5 && (
                            <div className="w-7 h-7 rounded-full bg-[#2a2c32] border-2 border-[#161719] flex items-center justify-center text-[10px] font-semibold text-[#9a9ba1]">
                              +{meeting.participants.length - 5}
                            </div>
                          )}
                        </div>

                        <div className="w-8 h-8 rounded-lg bg-[#1e2024] group-hover:bg-[#25282e] border border-[#2f3238] flex items-center justify-center text-[#9a9ba1] group-hover:text-white transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </main>

        {/* Ask Fathom Right Panel */}
        <AskFathomPanel
          isOpen={isAskFathomOpen}
          onToggle={() => setIsAskFathomOpen(!isAskFathomOpen)}
        />
      </div>
    </div>
  );
}
