"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/shell/TopBar";
import { AskFathomPanel } from "@/components/home/AskFathomPanel";
import { Video, Plus, Sparkles, PhoneCall } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"my" | "team">("my");
  const [isAskFathomOpen, setIsAskFathomOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#111214] flex flex-col">
      <TopBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Subheader: My Calls / Team Calls Tabs */}
          <div className="h-12 border-b border-[#26282d] px-8 flex items-center justify-between select-none bg-[#111214]">
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

          {/* List Area / Empty State for Phase 0 */}
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#1e2024] border border-[#2f3238] flex items-center justify-center mb-4 text-[#00b2ea]">
              <Video className="w-8 h-8" />
            </div>

            <h2 className="text-base font-bold text-white mb-2">
              {activeTab === "my" ? "No calls in your library yet" : "No team calls recorded yet"}
            </h2>

            <p className="text-xs text-[#9a9ba1] max-w-sm mb-6 leading-relaxed">
              {activeTab === "my"
                ? "Fathom automatically captures, transcribes, and summarizes your Zoom, Google Meet, and Microsoft Teams meetings."
                : "Team calls shared across your workspace will appear here."}
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="/onboarding"
                className="h-9 px-4 bg-[#1e2024] hover:bg-[#26292f] border border-[#2f3238] text-white font-medium text-xs rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-[#00b2ea]" />
                <span>Start Test Call</span>
              </Link>

              <Link
                href="/demo"
                className="h-9 px-4 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                <span>Load Seed Demo Data</span>
              </Link>
            </div>
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
