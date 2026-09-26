"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { TopBar } from "@/components/shell/TopBar";
import { AskFathomPanel } from "@/components/home/AskFathomPanel";
import { Meeting } from "@/lib/seed-meetings";
import { UploadModal } from "@/components/home/UploadModal";
import {
  Loader2,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  Share2,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function HomePage() {
  const [activeScope, setActiveScope] = useState<"my" | "team">("my");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
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
        const res = await fetch(`/api/meetings?tab=${activeScope}`);
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
  }, [activeScope]);

  // Dynamic Intelligence Metrics
  const stats = useMemo(() => {
    const totalDurationSec = meetings.reduce((acc, m) => acc + (m.duration_sec || 0), 0);
    const totalHours = (totalDurationSec / 3600).toFixed(1);
    const totalActions = meetings.reduce((acc, m) => acc + (m.action_items?.length || 0), 0);
    
    // Unique participants
    const participantSet = new Set<string>();
    meetings.forEach((m) => {
      m.participants?.forEach((p) => participantSet.add(p.name));
    });

    return {
      hours: totalHours,
      actionItems: totalActions,
      participants: participantSet.size,
      totalMeetings: meetings.length,
    };
  }, [meetings]);

  // Filter meetings by search query and category
  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = m.title.toLowerCase().includes(q);
        const participantMatch = m.participants?.some((p) => p.name.toLowerCase().includes(q));
        if (!titleMatch && !participantMatch) return false;
      }

      // Category filter
      if (selectedCategory === "all") return true;
      const t = m.title.toLowerCase();
      if (selectedCategory === "executive") return t.includes("q4") || t.includes("roadmap") || t.includes("qbr");
      if (selectedCategory === "engineering") return t.includes("engineering") || t.includes("standup") || t.includes("escalation");
      if (selectedCategory === "sales") return t.includes("discovery") || t.includes("northwind") || t.includes("launch");
      if (selectedCategory === "1on1") return t.includes("1:1") || t.includes("interview");
      return true;
    });
  }, [meetings, searchQuery, selectedCategory]);

  const categories = [
    { id: "all", label: "All Calls" },
    { id: "executive", label: "Executive & Strategy" },
    { id: "engineering", label: "Engineering & Ops" },
    { id: "sales", label: "Sales & Clients" },
    { id: "1on1", label: "1:1s & Hiring" },
  ];

  return (
    <div className="min-h-screen bg-[#090a0f] flex flex-col select-none text-slate-100">
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewMeetingClick={() => setIsUploadOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Dashboard Content */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Executive Intelligence Matrix (Hero Stats) */}
          <div className="p-6 md:p-8 border-b border-white/6 bg-gradient-to-b from-white/2 to-transparent">
            <div className="max-w-[1400px] mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                    <span>Meeting Intelligence Hub</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-normal">
                      Postgres FTS + Gemini
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Synchronized transcripts, real-time speaker distribution, and automated AI summaries.
                  </p>
                </div>

                {/* Scope Switcher: My Calls vs Team Calls */}
                <div className="flex items-center p-1 rounded-xl bg-[#131722] border border-white/8 text-xs self-start">
                  <button
                    onClick={() => setActiveScope("my")}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      activeScope === "my"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    My Calls ({meetings.length})
                  </button>
                  <button
                    onClick={() => setActiveScope("team")}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      activeScope === "team"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Team Calls
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#111520]/80 border border-white/6 relative overflow-hidden group">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Analyzed Call Time</span>
                    <Clock className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">
                    {stats.hours} <span className="text-xs font-normal text-slate-400">hrs</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {stats.totalMeetings} recorded sessions
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#111520]/80 border border-white/6 relative overflow-hidden group">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Action Items Extracted</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">
                    {stats.actionItems}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Assigned across teams
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#111520]/80 border border-white/6 relative overflow-hidden group">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Collaborators</span>
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">
                    {stats.participants}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Distinct speaker profiles
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#111520]/80 border border-white/6 relative overflow-hidden group">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>AI Synthesis Engine</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 tracking-tight flex items-center gap-1.5">
                    100% <span className="text-xs font-normal text-slate-300">Live</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Gemini 3.6 Flash Active
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Pills Bar */}
          <div className="px-6 md:px-8 py-3.5 border-b border-white/6 bg-[#0c0f17]/50 flex items-center gap-2 overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? "bg-white/10 text-white border border-white/15"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Meetings Cards Stream */}
          <div className="flex-1 p-6 md:p-8 max-w-[1400px] w-full mx-auto">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-3 text-xs text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                <span>Querying Supabase database...</span>
              </div>
            ) : error ? (
              <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                <p className="font-semibold mb-1">Database query error</p>
                <p>{error}</p>
              </div>
            ) : filteredMeetings.length === 0 ? (
              <div className="py-20 text-center text-xs text-slate-400 bg-white/2 rounded-2xl border border-white/5 p-8">
                <p className="font-semibold text-slate-300 text-sm">No meeting records found</p>
                <p className="mt-1">Try clearing your search query or upload a new call recording.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMeetings.map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Ask Fathom Intelligence Panel */}
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

  // Extract a real teaser snippet from summary or title
  const teaserText = useMemo(() => {
    if (meeting.summary?.Enhanced?.meeting_purpose) {
      return meeting.summary.Enhanced.meeting_purpose;
    }
    if (meeting.summary?.Enhanced?.key_takeaways?.[0]) {
      return meeting.summary.Enhanced.key_takeaways[0];
    }
    return `Recorded ${durationMin}-minute session with dynamic speaker identification and AI transcript synthesis.`;
  }, [meeting, durationMin]);

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between group transition-all relative overflow-hidden">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-[11px] font-mono text-slate-300">
              {meeting.platform || "Zoom"}
            </span>
            {meeting.id === "829997321" && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-[10px] font-bold text-indigo-300">
                STAR 60-MIN CALL
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <Clock className="w-3 h-3" />
            <span>{durationMin} mins</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/calls/${meeting.id}`} className="block group-hover:text-indigo-400 transition-colors">
          <h3 className="font-bold text-white text-sm line-clamp-1 mb-2">
            {meeting.title}
          </h3>
        </Link>

        {/* AI Key Takeaway Teaser */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {teaserText}
        </p>

        {/* Attendees / Participant Avatars */}
        {meeting.participants && meeting.participants.length > 0 && (
          <div className="flex items-center gap-2 pt-3 border-t border-white/6 mb-4">
            <div className="flex -space-x-1.5 overflow-hidden">
              {meeting.participants.slice(0, 5).map((p, idx) => (
                <div
                  key={idx}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0c0f17] text-[10px] font-bold text-white flex items-center justify-center shrink-0"
                  style={{ backgroundColor: p.color || "#6366f1" }}
                  title={`${p.name} (${p.talk_pct || 10}% talk time)`}
                >
                  {p.name.charAt(0)}
                </div>
              ))}
              {meeting.participants.length > 5 && (
                <div className="h-6 w-6 rounded-full bg-white/10 ring-2 ring-[#0c0f17] text-[10px] font-semibold text-slate-300 flex items-center justify-center">
                  +{meeting.participants.length - 5}
                </div>
              )}
            </div>
            <span className="text-[11px] text-slate-400 truncate">
              {meeting.participants.map((p) => p.name.split(" ")[0]).slice(0, 3).join(", ")}
              {meeting.participants.length > 3 && "..."}
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/6 text-xs">
        <Link
          href={`/calls/${meeting.id}`}
          className="flex items-center gap-1.5 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <span>Open Intelligence</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {meeting.share_token && (
          <Link
            href={`/share/${meeting.share_token}`}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            title="Public Share Portal"
          >
            <Share2 className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
