"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TopBar } from "@/components/shell/TopBar";
import { DEMO_USER } from "@/lib/constants";
import {
  Settings,
  Link2,
  User,
  Check,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Star,
  ExternalLink,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "integrations" | "account">("general");
  const [botName, setBotName] = useState("Fathom Notetaker");
  const [defaultTemplate, setDefaultTemplate] = useState("Enhanced");
  const [autoJoinRule, setAutoJoinRule] = useState("all");
  const [audioLanguage, setAudioLanguage] = useState("en-US");
  const [isSaved, setIsSaved] = useState(false);

  // Load from localStorage if present
  useEffect(() => {
    const savedBotName = localStorage.getItem("fathom_bot_name");
    const savedTemplate = localStorage.getItem("fathom_default_template");
    const savedAutoJoin = localStorage.getItem("fathom_auto_join");
    if (savedBotName) setBotName(savedBotName);
    if (savedTemplate) setDefaultTemplate(savedTemplate);
    if (savedAutoJoin) setAutoJoinRule(savedAutoJoin);
  }, []);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("fathom_bot_name", botName);
    localStorage.setItem("fathom_default_template", defaultTemplate);
    localStorage.setItem("fathom_auto_join", autoJoinRule);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#111214] flex flex-col select-none text-white">
      <TopBar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 space-y-8">
        {/* Header & Back Link */}
        <div>
          <Link
            href="/home"
            className="inline-flex items-center gap-1.5 text-xs text-[#9a9ba1] hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all calls</span>
          </Link>

          <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
          <p className="text-xs text-[#9a9ba1]">
            Manage your AI notetaker preferences, calendar integrations, and account details.
          </p>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-6 border-b border-[#26282d] text-xs font-semibold">
          <button
            onClick={() => setActiveTab("general")}
            className={`pb-3 transition-colors relative cursor-pointer flex items-center gap-2 ${
              activeTab === "general" ? "text-[#00b2ea]" : "text-[#9a9ba1] hover:text-white"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>General & Bot</span>
            {activeTab === "general" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b2ea]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("integrations")}
            className={`pb-3 transition-colors relative cursor-pointer flex items-center gap-2 ${
              activeTab === "integrations" ? "text-[#00b2ea]" : "text-[#9a9ba1] hover:text-white"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Integrations</span>
            {activeTab === "integrations" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b2ea]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("account")}
            className={`pb-3 transition-colors relative cursor-pointer flex items-center gap-2 ${
              activeTab === "account" ? "text-[#00b2ea]" : "text-[#9a9ba1] hover:text-white"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Account</span>
            {activeTab === "account" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b2ea]" />
            )}
          </button>
        </div>

        {/* TAB 1: GENERAL & BOT */}
        {activeTab === "general" && (
          <form onSubmit={handleSaveGeneral} className="space-y-6 max-w-xl">
            {/* Bot Display Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white block">
                Notetaker Name in Meetings
              </label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#161719] border border-[#2f3238] focus:border-[#00b2ea] rounded-xl text-xs text-white outline-none transition-all"
                placeholder="e.g. Alex's Fathom Notetaker"
              />
              <p className="text-[11px] text-[#9a9ba1]">
                This is the name attendees will see when Fathom joins Zoom, Google Meet, or Microsoft Teams.
              </p>
            </div>

            {/* Default Summary Template */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white block">
                Default Summary Template
              </label>
              <select
                value={defaultTemplate}
                onChange={(e) => setDefaultTemplate(e.target.value)}
                className="w-full h-10 px-3 bg-[#161719] border border-[#2f3238] focus:border-[#00b2ea] rounded-xl text-xs text-white outline-none transition-all cursor-pointer"
              >
                <option value="Enhanced">Enhanced (Purpose, Takeaways, Topics & Next Steps)</option>
                <option value="General">General (Overview & Key Decisions)</option>
                <option value="Sales">Sales (Pain Points, Budget, Timeline & Next Steps)</option>
                <option value="1-on-1">1-on-1 (Priorities, Feedback & Action Items)</option>
              </select>
              <p className="text-[11px] text-[#9a9ba1]">
                Your preferred structure for meeting notes. You can always toggle templates on any call.
              </p>
            </div>

            {/* Auto-Join Rules */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white block">
                Auto-Join Behavior
              </label>
              <select
                value={autoJoinRule}
                onChange={(e) => setAutoJoinRule(e.target.value)}
                className="w-full h-10 px-3 bg-[#161719] border border-[#2f3238] focus:border-[#00b2ea] rounded-xl text-xs text-white outline-none transition-all cursor-pointer"
              >
                <option value="all">All meetings on my calendar with a video link</option>
                <option value="hosted">Only meetings that I host</option>
                <option value="external">Only meetings with external attendees</option>
                <option value="never">Never auto-join (manual invite only)</option>
              </select>
            </div>

            {/* Audio Language */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white block">
                Primary Spoken Language
              </label>
              <select
                value={audioLanguage}
                onChange={(e) => setAudioLanguage(e.target.value)}
                className="w-full h-10 px-3 bg-[#161719] border border-[#2f3238] focus:border-[#00b2ea] rounded-xl text-xs text-white outline-none transition-all cursor-pointer"
              >
                <option value="en-US">English (United States)</option>
                <option value="en-GB">English (United Kingdom)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
                <option value="de-DE">German</option>
              </select>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex items-center gap-3">
              <button
                type="submit"
                className="h-10 px-6 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-[#00b2ea]/20"
              >
                Save Changes
              </button>

              {isSaved && (
                <div className="flex items-center gap-1.5 text-xs text-[#3dbb6b] font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Settings saved successfully!</span>
                </div>
              )}
            </div>
          </form>
        )}

        {/* TAB 2: INTEGRATIONS */}
        {activeTab === "integrations" && (
          <div className="space-y-4 max-w-2xl">
            {/* Google Calendar */}
            <div className="p-4 bg-[#161719] border border-[#26282d] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1e2024] border border-[#2f3238] flex items-center justify-center text-lg">
                  📅
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-white">Google Calendar</h4>
                  <p className="text-[11px] text-[#9a9ba1]">Auto-syncs upcoming meetings from alex@fathom.video</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3dbb6b]/15 border border-[#3dbb6b]/30 text-[#3dbb6b] text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>Connected</span>
              </div>
            </div>

            {/* Zoom */}
            <div className="p-4 bg-[#161719] border border-[#26282d] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1e2024] border border-[#2f3238] flex items-center justify-center text-lg">
                  📹
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-white">Zoom</h4>
                  <p className="text-[11px] text-[#9a9ba1]">Native in-meeting recording bot and permission prompts</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3dbb6b]/15 border border-[#3dbb6b]/30 text-[#3dbb6b] text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>Connected</span>
              </div>
            </div>

            {/* Salesforce CRM */}
            <div className="p-4 bg-[#161719] border border-[#26282d] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1e2024] border border-[#2f3238] flex items-center justify-center text-lg">
                  ☁️
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-white">Salesforce CRM</h4>
                  <p className="text-[11px] text-[#9a9ba1]">Automatically log call summaries into Opportunity records</p>
                </div>
              </div>
              <button
                onClick={() => alert("Salesforce connection simulated: Authenticated with demo sandbox!")}
                className="px-3.5 py-1.5 rounded-lg bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238] text-xs text-white font-medium transition-colors cursor-pointer"
              >
                Connect
              </button>
            </div>

            {/* HubSpot */}
            <div className="p-4 bg-[#161719] border border-[#26282d] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1e2024] border border-[#2f3238] flex items-center justify-center text-lg">
                  🧡
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-white">HubSpot</h4>
                  <p className="text-[11px] text-[#9a9ba1]">Sync notes and extracted action items to HubSpot Deals</p>
                </div>
              </div>
              <button
                onClick={() => alert("HubSpot connection simulated: Authenticated with demo sandbox!")}
                className="px-3.5 py-1.5 rounded-lg bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238] text-xs text-white font-medium transition-colors cursor-pointer"
              >
                Connect
              </button>
            </div>

            {/* Slack */}
            <div className="p-4 bg-[#161719] border border-[#26282d] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1e2024] border border-[#2f3238] flex items-center justify-center text-lg">
                  💬
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-white">Slack</h4>
                  <p className="text-[11px] text-[#9a9ba1]">Post instant meeting recap links to dedicated team channels</p>
                </div>
              </div>
              <button
                onClick={() => alert("Slack connection simulated: Authenticated with demo team workspace!")}
                className="px-3.5 py-1.5 rounded-lg bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238] text-xs text-white font-medium transition-colors cursor-pointer"
              >
                Connect
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: ACCOUNT */}
        {activeTab === "account" && (
          <div className="space-y-6 max-w-xl">
            <div className="p-6 bg-[#161719] border border-[#26282d] rounded-xl space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#00b2ea] text-white font-bold text-lg flex items-center justify-center shadow-lg">
                  {DEMO_USER.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{DEMO_USER.name}</h3>
                  <p className="text-xs text-[#9a9ba1]">{DEMO_USER.email}</p>
                  <p className="text-[11px] text-[#00b2ea] font-medium mt-0.5">Role: {DEMO_USER.role}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#26282d] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#e8b923] fill-[#e8b923]" />
                  <span className="text-xs font-semibold text-white">Points Balance:</span>
                  <span className="text-xs font-bold text-[#e8b923]">{DEMO_USER.points} pts</span>
                </div>
                <button
                  onClick={() => alert("Referral link copied: https://fathom.video/invite/demo-alex")}
                  className="text-xs text-[#00b2ea] hover:underline font-medium"
                >
                  Copy Referral Link
                </button>
              </div>
            </div>

            {/* Session Reset */}
            <div className="p-6 bg-[#1f1515] border border-[#3d2020] rounded-xl space-y-2">
              <h4 className="font-bold text-xs text-[#ff4d4f]">Reset Demo Session</h4>
              <p className="text-xs text-[#d1d5db] leading-relaxed">
                Clears any visitor-added notes, highlights, and action item completions, resetting your workspace to pristine seed state.
              </p>
              <button
                onClick={() => {
                  if (confirm("Reset demo session to original state?")) {
                    localStorage.clear();
                    window.location.href = "/demo";
                  }
                }}
                className="mt-2 px-4 py-2 bg-[#ff4d4f]/15 hover:bg-[#ff4d4f]/25 border border-[#ff4d4f]/40 text-[#ff4d4f] font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Reset Session State
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
