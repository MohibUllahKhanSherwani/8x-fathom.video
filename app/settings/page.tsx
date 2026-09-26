"use client";

import React, { useState } from "react";
import { TopBar } from "@/components/shell/TopBar";
import {
  ChevronDown,
  Edit2,
  ExternalLink,
  ShieldCheck,
  Video,
  Bot,
  Sparkles,
  Zap,
} from "lucide-react";

export default function SettingsPage() {
  const [autoRecordScope, setAutoRecordScope] = useState("all");
  const [autoShareScope, setAutoShareScope] = useState("summary_recording");
  const [botName, setBotName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fathom_bot_name") || "Mohib's Fathom Notetaker";
    }
    return "Mohib's Fathom Notetaker";
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
    <div className="min-h-screen bg-[#090a0f] flex flex-col select-none text-slate-100">
      <TopBar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 space-y-8">
        {/* Page Header */}
        <div className="border-b border-white/6 pb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>Workspace & Notetaker Settings</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-normal">
              PRO ACCOUNT
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure bot capture policies, default AI summary templates, and video conference integrations.
          </p>
        </div>

        {/* Global Auto-Record Scope Bar */}
        <div className="p-4 rounded-2xl bg-[#111522] border border-white/6 flex flex-wrap items-center gap-2.5 text-xs text-slate-300">
          <span className="font-semibold text-white">Default Policy:</span>
          <span>Auto-record</span>
          <div className="relative inline-block">
            <select
              value={autoRecordScope}
              onChange={(e) => setAutoRecordScope(e.target.value)}
              className="h-8 pl-3 pr-7 bg-[#161c2c] border border-white/8 focus:border-indigo-500/60 rounded-lg text-xs font-semibold text-white outline-none cursor-pointer appearance-none"
            >
              <option value="all">All meetings</option>
              <option value="external">External meetings only</option>
              <option value="internal">Internal meetings only</option>
              <option value="none">Manual join only</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span>and automatically share</span>
          <div className="relative inline-block">
            <select
              value={autoShareScope}
              onChange={(e) => setAutoShareScope(e.target.value)}
              className="h-8 pl-3 pr-7 bg-[#161c2c] border border-white/8 focus:border-indigo-500/60 rounded-lg text-xs font-semibold text-white outline-none cursor-pointer appearance-none"
            >
              <option value="summary_recording">Summary & recording</option>
              <option value="summary_only">Summary only</option>
              <option value="none">Do not share automatically</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <span>with participants.</span>
        </div>

        {/* SECTION: VIDEO CONFERENCING */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Video className="w-3.5 h-3.5 text-indigo-400" />
            <span>Platform Connectors</span>
          </h2>

          <div className="bg-[#111522] border border-white/6 rounded-2xl overflow-hidden divide-y divide-white/6">
            {/* Zoom */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#2d8cff]/20 border border-[#2d8cff]/40 flex items-center justify-center text-[#2d8cff] text-xs font-bold">
                    ZM
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Zoom Video:</span>
                      <span className="text-[11px] font-semibold text-amber-400">Connected</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Enables simulated automatic bot join and recording consent detection.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => alert("Zoom connection re-verified!")}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-xs text-indigo-300 font-semibold transition-colors cursor-pointer"
                >
                  Configure
                </button>
              </div>

              {/* Sub-options */}
              <div className="pl-12 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Auto-capture unscheduled Zoom calls</span>
                  <div
                    onClick={() => setAutoCaptureZoom(!autoCaptureZoom)}
                    className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center cursor-pointer ${
                      autoCaptureZoom ? "bg-indigo-600" : "bg-white/10"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                        autoCaptureZoom ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Google Meet */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-bold">
                  GM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Google Meet:</span>
                    <span className="text-[11px] font-semibold text-emerald-400">Active</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Syncs scheduled Google Calendar meetings directly into dashboard.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setAutoCaptureMeet(!autoCaptureMeet)}
                className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center cursor-pointer ${
                  autoCaptureMeet ? "bg-indigo-600" : "bg-white/10"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    autoCaptureMeet ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: AI INTELLIGENCE & NOTETAKER */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Copilot & Summary Preferences</span>
          </h2>

          <div className="bg-[#111522] border border-white/6 rounded-2xl overflow-hidden divide-y divide-white/6">
            {/* Bot Name */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Notetaker Bot Display Name:</span>
                    <span className="text-xs text-indigo-300 font-semibold">{botName}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    The name displayed when Fathom enters video conference waiting rooms.
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
                    className="h-8 px-3 bg-[#161c2c] border border-indigo-500 rounded-lg text-xs text-white outline-none"
                    autoFocus
                  />
                  <button
                    onClick={(e) => {
                      const input = (e.currentTarget.previousSibling as HTMLInputElement);
                      handleSaveBotName(input.value);
                    }}
                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold text-xs"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingBotName(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-xs text-indigo-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Edit</span>
                  <Edit2 className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Auto-Extract Action Items */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Automated Task Extraction</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-wider border border-emerald-500/20">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Automatically extracts assigned action items, due dates, and owners directly to Supabase.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setAutoActionItems(!autoActionItems)}
                className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center cursor-pointer ${
                  autoActionItems ? "bg-indigo-600" : "bg-white/10"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    autoActionItems ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </div>
            </div>

            {/* Default Summary Template */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Default Synthesis Template
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Determines structure for immediate post-call executive briefing generation.
                  </p>
                </div>
              </div>

              <div className="relative">
                <select
                  value={defaultTemplate}
                  onChange={(e) => setDefaultTemplate(e.target.value)}
                  className="h-8.5 pl-3.5 pr-8 bg-[#161c2c] border border-white/8 focus:border-indigo-500/60 rounded-xl text-xs font-semibold text-white outline-none cursor-pointer appearance-none"
                >
                  <option value="Enhanced">Enhanced Executive Brief</option>
                  <option value="General">General Summary</option>
                  <option value="Sales Discovery">Sales & Client Discovery</option>
                  <option value="1-on-1">1:1 Coaching Sync</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Status Verification Footer */}
        <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Database synchronized with Supabase project 8x-fathom.video</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">v2.4.0-bespoke</span>
        </div>
      </main>
    </div>
  );
}
