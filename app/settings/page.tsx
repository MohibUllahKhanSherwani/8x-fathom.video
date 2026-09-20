"use client";

import React, { useState } from "react";
import { TopBar } from "@/components/shell/TopBar";
import {
  ChevronDown,
  Edit2,
  ExternalLink,
} from "lucide-react";

export default function SettingsPage() {
  const [autoRecordScope, setAutoRecordScope] = useState("all");
  const [autoShareScope, setAutoShareScope] = useState("summary_recording");
  const [botName, setBotName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fathom_bot_name") || "mohib's Fathom Notetaker";
    }
    return "mohib's Fathom Notetaker";
  });
  const [isEditingBotName, setIsEditingBotName] = useState(false);
  const [autoActionItems, setAutoActionItems] = useState(true);
  const [defaultTemplate, setDefaultTemplate] = useState("Enhanced");
  const [notificationBanner, setNotificationBanner] = useState(true);
  const [autoCaptureZoom, setAutoCaptureZoom] = useState(false);
  const [autoCaptureMeet, setAutoCaptureMeet] = useState(false);

  const handleSaveBotName = (name: string) => {
    setBotName(name);
    if (typeof window !== "undefined") {
      localStorage.setItem("fathom_bot_name", name);
    }
    setIsEditingBotName(false);
  };

  return (
    <div className="min-h-screen bg-[#111214] flex flex-col select-none text-white">
      <TopBar />

      <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-10 space-y-8">
        {/* Top Scope Row Matching Screenshot 7.png */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#9a9ba1] pt-2">
          <span>Auto-record</span>
          <div className="relative inline-block">
            <select
              value={autoRecordScope}
              onChange={(e) => setAutoRecordScope(e.target.value)}
              className="h-8 pl-3 pr-7 bg-[#1e2024] hover:bg-[#26282d] border border-[#2f3238] focus:border-[#00b2ea] rounded-lg text-xs font-semibold text-white outline-none cursor-pointer appearance-none"
            >
              <option value="all">All meetings</option>
              <option value="external">External meetings only</option>
              <option value="internal">Internal meetings only</option>
              <option value="none">Don&apos;t auto-record</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#9a9ba1] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span>and auto-share</span>
          <div className="relative inline-block">
            <select
              value={autoShareScope}
              onChange={(e) => setAutoShareScope(e.target.value)}
              className="h-8 pl-3 pr-7 bg-[#1e2024] hover:bg-[#26282d] border border-[#2f3238] focus:border-[#00b2ea] rounded-lg text-xs font-semibold text-white outline-none cursor-pointer appearance-none"
            >
              <option value="summary_recording">Summary & recording</option>
              <option value="summary_only">Summary only</option>
              <option value="none">Don&apos;t auto-share</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#9a9ba1] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span>with attendees</span>
        </div>

        {/* SECTION: VIDEO CONFERENCING */}
        <div className="space-y-3">
          <h2 className="text-[11px] font-bold text-[#9a9ba1] uppercase tracking-wider">
            VIDEO CONFERENCING
          </h2>

          <div className="bg-[#161719] border border-[#26282d] rounded-xl overflow-hidden divide-y divide-[#26282d]">
            {/* Zoom */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2d8cff] flex items-center justify-center text-white text-xs font-bold">
                    zm
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Zoom:</span>
                      <span className="text-xs font-semibold text-[#e8b923]">Partially Enabled</span>
                    </div>
                    <p className="text-[11px] text-[#9a9ba1]">
                      Connect to Zoom account for more reliable recording.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => alert("Zoom connection simulated!")}
                  className="px-3 py-1.5 rounded-lg bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238] text-xs text-[#00b2ea] font-semibold transition-colors cursor-pointer"
                >
                  Connect 🔗
                </button>
              </div>

              {/* Sub-options */}
              <div className="pl-11 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#9a9ba1]">
                  <span>Auto-capture unscheduled Zoom meetings</span>
                  <div
                    onClick={() => setAutoCaptureZoom(!autoCaptureZoom)}
                    className={`w-7 h-4 rounded-full transition-colors relative flex items-center cursor-pointer ${
                      autoCaptureZoom ? "bg-[#00b2ea]" : "bg-[#2f3238]"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white transition-transform ${
                        autoCaptureZoom ? "translate-x-3.5" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[#9a9ba1]">
                  <span className="flex items-center gap-1">
                    <span>Disable &ldquo;Recording in progress&rdquo; audio notification</span>
                    <span className="text-[10px] text-[#555861]">ⓘ</span>
                  </span>
                  <button
                    onClick={() => alert("Redirecting to Zoom settings...")}
                    className="text-[11px] text-[#00b2ea] hover:underline flex items-center gap-1"
                  >
                    <span>Update in Zoom Settings</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Google Meet */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1e2024] border border-[#2f3238] flex items-center justify-center text-sm">
                    📹
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Google Meet:</span>
                      <span className="text-xs font-semibold text-[#e8b923]">Partially Enabled</span>
                    </div>
                    <p className="text-[11px] text-[#9a9ba1]">
                      Usage limited to scheduled calls joined via desktop app. Install Chrome extension to use on any meeting.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => alert("Chrome extension install simulated!")}
                  className="px-3 py-1.5 rounded-lg bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238] text-xs text-[#00b2ea] font-semibold transition-colors cursor-pointer"
                >
                  Install Chrome Extension ⬇
                </button>
              </div>

              <div className="pl-11 flex items-center justify-between text-xs text-[#9a9ba1]">
                <span>Auto-capture unscheduled Google Meet meetings</span>
                <div
                  onClick={() => setAutoCaptureMeet(!autoCaptureMeet)}
                  className={`w-7 h-4 rounded-full transition-colors relative flex items-center cursor-pointer ${
                    autoCaptureMeet ? "bg-[#00b2ea]" : "bg-[#2f3238]"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      autoCaptureMeet ? "translate-x-3.5" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Microsoft Teams */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#464eb8] flex items-center justify-center text-white text-xs font-bold">
                  T
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Microsoft Teams:</span>
                    <span className="text-xs font-semibold text-[#3dbb6b]">Fully Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: PREMIUM FEATURES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold text-[#9a9ba1] uppercase tracking-wider">
              PREMIUM FEATURES
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-[#e8b923]">
              <span>🎁</span>
              <span className="font-semibold">30 DAYS LEFT IN FREE PREVIEW:</span>
              <span className="font-bold underline cursor-pointer">UPGRADE NOW</span>
              <span>-</span>
              <span className="underline cursor-pointer">LEARN MORE</span>
            </div>
          </div>

          <div className="bg-[#161719] border border-[#26282d] rounded-xl overflow-hidden divide-y divide-[#26282d]">
            {/* Bot Name */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1e2024] border border-[#2f3238] flex items-center justify-center text-sm">
                  🤖
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Bot Name:</span>
                    <span className="text-xs text-[#d1d5db] font-medium">{botName}</span>
                  </div>
                  <p className="text-[11px] text-[#9a9ba1]">
                    The name your Fathom notetaker will go by when it joins meetings.
                  </p>
                </div>
              </div>

              {isEditingBotName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue={botName}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveBotName((e.target as HTMLInputElement).value);
                    }}
                    className="h-8 px-2.5 bg-[#1e2024] border border-[#00b2ea] rounded-md text-xs text-white outline-none"
                    autoFocus
                  />
                  <button
                    onClick={(e) => {
                      const input = (e.currentTarget.previousSibling as HTMLInputElement);
                      handleSaveBotName(input.value);
                    }}
                    className="px-2.5 py-1 rounded bg-[#00b2ea] text-black font-semibold text-xs"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingBotName(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238] text-xs text-[#00b2ea] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Edit</span>
                  <Edit2 className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Auto-Generate Action Items */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1e2024] border border-[#2f3238] flex items-center justify-center text-sm text-[#00b2ea]">
                  ✨
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Auto-Generate Action Items</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#1e2024] text-[#9a9ba1] text-[9px] font-bold uppercase tracking-wider">
                      RECOMMENDED
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9a9ba1]">
                    Fathom AI will automatically extract any action items discussed on your meetings
                  </p>
                </div>
              </div>

              <div
                onClick={() => setAutoActionItems(!autoActionItems)}
                className={`w-7 h-4 rounded-full transition-colors relative flex items-center cursor-pointer ${
                  autoActionItems ? "bg-[#00b2ea]" : "bg-[#2f3238]"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white transition-transform ${
                    autoActionItems ? "translate-x-3.5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </div>

            {/* Default Summary Template */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1e2024] border border-[#2f3238] flex items-center justify-center text-sm text-[#e8b923]">
                  ✦
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Default Meeting Summary Template
                  </span>
                  <p className="text-[11px] text-[#9a9ba1]">
                    External meetings only. Attendees always see the Enhanced template if you share.
                  </p>
                </div>
              </div>

              <div className="relative">
                <select
                  value={defaultTemplate}
                  onChange={(e) => setDefaultTemplate(e.target.value)}
                  className="h-8 pl-3 pr-7 bg-[#1e2024] hover:bg-[#26282d] border border-[#2f3238] focus:border-[#00b2ea] rounded-lg text-xs font-semibold text-white outline-none cursor-pointer appearance-none"
                >
                  <option value="Enhanced">Enhanced</option>
                  <option value="General">General</option>
                  <option value="Sales Discovery">Sales Discovery</option>
                  <option value="Customer Success">Customer Success</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#9a9ba1] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Recording Notification Banner */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1e2024] border border-[#2f3238] flex items-center justify-center text-sm text-[#9a9ba1]">
                  🖼️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Recording Notification Banner</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#1e2024] text-[#9a9ba1] text-[9px] font-bold uppercase tracking-wider">
                      PREVIEW
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9a9ba1] max-w-lg">
                    WARNING: If you disable this you&apos;re required to collect recording consent according to the laws of you and your attendees jurisdictions
                  </p>
                </div>
              </div>

              <div
                onClick={() => setNotificationBanner(!notificationBanner)}
                className={`w-7 h-4 rounded-full transition-colors relative flex items-center cursor-pointer ${
                  notificationBanner ? "bg-[#00b2ea]" : "bg-[#2f3238]"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white transition-transform ${
                    notificationBanner ? "translate-x-3.5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: INTEGRATIONS */}
        <div className="space-y-3">
          <h2 className="text-[11px] font-bold text-[#9a9ba1] uppercase tracking-wider">
            INTEGRATIONS
          </h2>

          <div className="bg-[#161719] border border-[#26282d] rounded-xl overflow-hidden divide-y divide-[#26282d]">
            {/* Claude */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#d97706]/20 border border-[#d97706]/40 flex items-center justify-center text-sm text-[#d97706]">
                  ✴
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Claude</span>
                  <p className="text-[11px] text-[#9a9ba1]">
                    Ask anything about your meetings
                  </p>
                </div>
              </div>

              <button
                onClick={() => alert("Claude integration simulated!")}
                className="px-3 py-1.5 rounded-lg bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238] text-xs text-[#00b2ea] font-semibold transition-colors cursor-pointer"
              >
                Connect 🔗
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
