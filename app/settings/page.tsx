"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Video,
  Bot,
  Check,
  Save,
  CheckSquare,
  Square,
  AlertCircle
} from "lucide-react";

export default function SettingsPage() {
  const [autoRecordPolicy, setAutoRecordPolicy] = useState("manual_approval");
  const [chatNoticeEnabled, setChatNoticeEnabled] = useState(true);
  const [chatNoticeText, setChatNoticeText] = useState(
    "🎙️ Fathom AI has joined to record notes & action items. Type /stop at any time to opt-out or pause recording."
  );
  const [audioConsentChime, setAudioConsentChime] = useState(true);
  const [allowOptOutCommand, setAllowOptOutCommand] = useState(true);

  // Bot & Summary Settings
  const [botName, setBotName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fathom_bot_name") || "Alex's Notetaker";
    }
    return "Alex's Notetaker";
  });
  const [isEditingBotName, setIsEditingBotName] = useState(false);
  const [tempBotName, setTempBotName] = useState(botName);
  const [defaultTemplate, setDefaultTemplate] = useState("Enhanced");
  const [autoActionItems, setAutoActionItems] = useState(true);

  // Integration States
  const [zoomConnected, setZoomConnected] = useState(true);
  const [meetConnected, setMeetConnected] = useState(true);
  const [teamsConnected, setTeamsConnected] = useState(false);

  // Save Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveBotName = () => {
    setBotName(tempBotName);
    if (typeof window !== "undefined") {
      localStorage.setItem("fathom_bot_name", tempBotName);
    }
    setIsEditingBotName(false);
    showToast("Notetaker name updated successfully.");
  };

  return (
    <div className="min-h-screen bg-[#1C1E22] text-[#EDEBE6] font-sans antialiased selection:bg-[#C98A3E]/30 selection:text-[#EDEBE6]">
      {/* ========================================================================= */}
      {/* 1. MINIMAL GRAPHITE HEADER                                                */}
      {/* ========================================================================= */}
      <header className="border-b border-[#282B31] bg-[#17191C]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-serif-heading text-[18px] font-medium tracking-tight text-[#EDEBE6] hover:text-[#EDEBE6]/90 transition-colors"
            >
              Fathom
            </Link>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E929B] hidden sm:inline">
              Workspace Settings
            </span>
          </div>

          <nav className="flex items-center gap-5 text-[12px] font-mono">
            <Link
              href="/home"
              className="text-[#8E929B] hover:text-[#EDEBE6] transition-colors"
            >
              Workspace
            </Link>
            <Link
              href="/settings"
              className="text-[#EDEBE6] font-medium transition-colors"
            >
              Settings
            </Link>
            <Link
              href="/home"
              className="px-3 py-1.5 rounded-[4px] border border-[#282B31] hover:border-[#EDEBE6] text-[#EDEBE6] transition-colors cursor-pointer"
            >
              Launch App
            </Link>
          </nav>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. SETTINGS MAIN CONTENT (LEFT-ALIGNED, NO SHADOWS, 1PX STRUCTURAL BORDERS)*/}
      {/* ========================================================================= */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10 text-left">
        {/* Page Title */}
        <div className="border-b border-[#282B31] pb-6 space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="font-serif-heading text-[26px] sm:text-[28px] font-medium text-[#EDEBE6]">
              Workspace &amp; Notetaker Settings
            </h1>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-[4px] border border-[#282B31] bg-[#17191C] text-[#8E929B]">
              Pro Tier
            </span>
          </div>
          <p className="text-[13px] text-[#8E929B] max-w-2xl leading-relaxed">
            Configure bot capture policies, attendee consent transparency, AI summary templates,
            and conference platform integrations.
          </p>
        </div>

        {/* SECTION 1: RECORDING TRANSPARENCY & CONSENT GOVERNANCE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#282B31] pb-2">
            <h2 className="font-serif-heading text-[18px] font-medium text-[#EDEBE6] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C98A3E]" />
              <span>Recording Transparency &amp; Attendee Consent</span>
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#C98A3E]">
              Consent Guard Active
            </span>
          </div>

          <div className="border border-[#282B31] rounded-[4px] bg-[#17191C] p-5 space-y-6">
            {/* Auto-Record Policy Radio Group */}
            <div className="space-y-3">
              <label className="font-mono text-[11px] uppercase tracking-wider text-[#8E929B] block">
                Auto-Record Policy &amp; Admission Guard
              </label>

              <div className="space-y-2">
                {[
                  {
                    id: "manual_approval",
                    title: "Manual Approval Only (Recommended for Trust)",
                    desc: "Notetaker bot waits in the waiting room/lobby until explicitly admitted by the meeting host. Never records unannounced.",
                  },
                  {
                    id: "scheduled_only",
                    title: "Scheduled Calendar Invites Only",
                    desc: "Only joins calls that were added to your calendar at least 15 minutes in advance. Ignores spontaneous or ad-hoc links.",
                  },
                  {
                    id: "all",
                    title: "Automatic for All Calendar Meetings",
                    desc: "Automatically attempts to join every calendar meeting where a video link is detected.",
                  },
                ].map((policy) => {
                  const isSelected = autoRecordPolicy === policy.id;
                  return (
                    <button
                      key={policy.id}
                      type="button"
                      onClick={() => {
                        setAutoRecordPolicy(policy.id);
                        showToast(`Policy updated: ${policy.title.split(" (")[0]}`);
                      }}
                      className={`w-full text-left p-3.5 rounded-[4px] border transition-colors cursor-pointer block ${
                        isSelected
                          ? "bg-[#22252B] border-[#EDEBE6]"
                          : "bg-[#141619] border-[#282B31] hover:border-[#383C45]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif-heading text-[13px] font-medium text-[#EDEBE6]">
                          {policy.title}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#C98A3E]" />
                        )}
                      </div>
                      <p className="text-[12px] text-[#8E929B] leading-relaxed">
                        {policy.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* In-Meeting Chat Notice */}
            <div className="pt-4 border-t border-[#282B31] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-medium text-[#EDEBE6]">
                    In-Meeting Chat Transparency Notice
                  </div>
                  <p className="text-[12px] text-[#8E929B] mt-0.5">
                    Broadcasts a written notice in the Zoom/Meet in-meeting chat upon arrival so all attendees have recorded consent.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setChatNoticeEnabled(!chatNoticeEnabled)}
                  className="cursor-pointer text-[#8E929B] hover:text-[#EDEBE6]"
                >
                  {chatNoticeEnabled ? (
                    <CheckSquare className="w-4 h-4 text-[#EDEBE6]" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </div>

              {chatNoticeEnabled && (
                <div className="space-y-1.5 pt-1">
                  <label className="font-mono text-[10px] uppercase text-[#8E929B]">
                    Broadcast Message Content:
                  </label>
                  <textarea
                    value={chatNoticeText}
                    onChange={(e) => setChatNoticeText(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 bg-[#141619] border border-[#282B31] rounded-[4px] text-[12px] text-[#EDEBE6] font-mono outline-none focus:border-[#EDEBE6] leading-relaxed"
                  />
                </div>
              )}
            </div>

            {/* Audio Consent Chime */}
            <div className="pt-4 border-t border-[#282B31] flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium text-[#EDEBE6]">
                  Audible Recording Chime
                </div>
                <p className="text-[12px] text-[#8E929B] mt-0.5">
                  Plays a subtle acoustic chime into the audio channel when recording begins or resumes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAudioConsentChime(!audioConsentChime);
                  showToast(`Audio chime ${!audioConsentChime ? "enabled" : "disabled"}`);
                }}
                className="cursor-pointer text-[#8E929B] hover:text-[#EDEBE6]"
              >
                {audioConsentChime ? (
                  <CheckSquare className="w-4 h-4 text-[#EDEBE6]" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* In-Meeting /stop command */}
            <div className="pt-4 border-t border-[#282B31] flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium text-[#EDEBE6]">
                  Allow Attendee &ldquo;/stop&rdquo; Command
                </div>
                <p className="text-[12px] text-[#8E929B] mt-0.5">
                  Any meeting participant can type &ldquo;/stop&rdquo; in chat to immediately pause recording and delete the current section.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAllowOptOutCommand(!allowOptOutCommand);
                  showToast(`Opt-out command ${!allowOptOutCommand ? "enabled" : "disabled"}`);
                }}
                className="cursor-pointer text-[#8E929B] hover:text-[#EDEBE6]"
              >
                {allowOptOutCommand ? (
                  <CheckSquare className="w-4 h-4 text-[#EDEBE6]" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2: NOTETAKER BOT IDENTITY & DEFAULTS */}
        <section className="space-y-4">
          <div className="border-b border-[#282B31] pb-2">
            <h2 className="font-serif-heading text-[18px] font-medium text-[#EDEBE6] flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#EDEBE6]" />
              <span>Notetaker Identity &amp; AI Defaults</span>
            </h2>
          </div>

          <div className="border border-[#282B31] rounded-[4px] bg-[#17191C] p-5 space-y-6">
            {/* Display Name */}
            <div className="space-y-2">
              <label className="font-mono text-[11px] uppercase tracking-wider text-[#8E929B] block">
                Notetaker Participant Display Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={isEditingBotName ? tempBotName : botName}
                  onChange={(e) => setTempBotName(e.target.value)}
                  disabled={!isEditingBotName}
                  className="flex-1 h-9 px-3 bg-[#141619] border border-[#282B31] rounded-[4px] text-[13px] text-[#EDEBE6] outline-none focus:border-[#EDEBE6] disabled:opacity-70"
                />
                {isEditingBotName ? (
                  <button
                    onClick={handleSaveBotName}
                    className="bg-[#C98A3E] text-[#1C1E22] font-semibold text-[12px] px-4 rounded-[4px] hover:bg-[#d8974a] transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setTempBotName(botName);
                      setIsEditingBotName(true);
                    }}
                    className="border border-[#282B31] bg-[#141619] hover:bg-[#22252B] text-[#EDEBE6] text-[12px] font-mono px-3 rounded-[4px] transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            {/* Default Summary Template */}
            <div className="pt-4 border-t border-[#282B31] space-y-2">
              <label className="font-mono text-[11px] uppercase tracking-wider text-[#8E929B] block">
                Default Synthesis Template
              </label>
              <select
                value={defaultTemplate}
                onChange={(e) => {
                  setDefaultTemplate(e.target.value);
                  showToast(`Default template changed to: ${e.target.value}`);
                }}
                className="w-full h-9 px-3 bg-[#141619] border border-[#282B31] rounded-[4px] text-[13px] text-[#EDEBE6] outline-none focus:border-[#EDEBE6]"
              >
                <option value="Enhanced">Executive Brief (Default — Purpose, Strategic Decisions, Action Items)</option>
                <option value="General">General Summary (Chronological overview &amp; key moments)</option>
                <option value="Sales">Sales &amp; Client Discovery (Pain points, budget, next steps)</option>
                <option value="OneOnOne">1:1 Coaching Sync (Wins, blockers, development commitments)</option>
              </select>
            </div>

            {/* Auto Action Items */}
            <div className="pt-4 border-t border-[#282B31] flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium text-[#EDEBE6]">
                  Automatic Action Item Extraction
                </div>
                <p className="text-[12px] text-[#8E929B] mt-0.5">
                  Detects verbal commitments during calls and compiles an interactive task checklist with owners.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAutoActionItems(!autoActionItems);
                  showToast(`Action item extraction ${!autoActionItems ? "enabled" : "disabled"}`);
                }}
                className="cursor-pointer text-[#8E929B] hover:text-[#EDEBE6]"
              >
                {autoActionItems ? (
                  <CheckSquare className="w-4 h-4 text-[#EDEBE6]" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 3: VIDEO PLATFORM INTEGRATIONS */}
        <section className="space-y-4">
          <div className="border-b border-[#282B31] pb-2">
            <h2 className="font-serif-heading text-[18px] font-medium text-[#EDEBE6] flex items-center gap-2">
              <Video className="w-4 h-4 text-[#EDEBE6]" />
              <span>Video Platform Integrations</span>
            </h2>
          </div>

          <div className="border border-[#282B31] rounded-[4px] bg-[#17191C] divide-y divide-[#282B31]">
            {/* Zoom */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium text-[#EDEBE6]">Zoom Video Communications</div>
                <div className="text-[11px] font-mono text-[#8E929B] mt-0.5">
                  Status: {zoomConnected ? "Connected (OAuth 2.0 active)" : "Disconnected"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setZoomConnected(!zoomConnected);
                  showToast(`Zoom integration ${!zoomConnected ? "connected" : "disconnected"}`);
                }}
                className={`font-mono text-[11px] px-3 py-1.5 rounded-[4px] border transition-colors cursor-pointer ${
                  zoomConnected
                    ? "border-[#282B31] text-[#8E929B] hover:text-[#EDEBE6] hover:bg-[#141619]"
                    : "border-[#EDEBE6] text-[#EDEBE6] hover:bg-[#22252B]"
                }`}
              >
                {zoomConnected ? "Disconnect" : "Connect"}
              </button>
            </div>

            {/* Google Meet */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium text-[#EDEBE6]">Google Meet</div>
                <div className="text-[11px] font-mono text-[#8E929B] mt-0.5">
                  Status: {meetConnected ? "Connected (Google Workspace token active)" : "Disconnected"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMeetConnected(!meetConnected);
                  showToast(`Google Meet integration ${!meetConnected ? "connected" : "disconnected"}`);
                }}
                className={`font-mono text-[11px] px-3 py-1.5 rounded-[4px] border transition-colors cursor-pointer ${
                  meetConnected
                    ? "border-[#282B31] text-[#8E929B] hover:text-[#EDEBE6] hover:bg-[#141619]"
                    : "border-[#EDEBE6] text-[#EDEBE6] hover:bg-[#22252B]"
                }`}
              >
                {meetConnected ? "Disconnect" : "Connect"}
              </button>
            </div>

            {/* Microsoft Teams */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium text-[#EDEBE6]">Microsoft Teams</div>
                <div className="text-[11px] font-mono text-[#8E929B] mt-0.5">
                  Status: {teamsConnected ? "Connected (Azure AD tenant active)" : "Ready to connect"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTeamsConnected(!teamsConnected);
                  showToast(`Microsoft Teams integration ${!teamsConnected ? "connected" : "disconnected"}`);
                }}
                className={`font-mono text-[11px] px-3 py-1.5 rounded-[4px] border transition-colors cursor-pointer ${
                  teamsConnected
                    ? "border-[#282B31] text-[#8E929B] hover:text-[#EDEBE6] hover:bg-[#141619]"
                    : "border-[#EDEBE6] text-[#EDEBE6] hover:bg-[#22252B]"
                }`}
              >
                {teamsConnected ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        </section>

        {/* Global Save Notice Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 p-3 px-4 rounded-[4px] border border-[#282B31] bg-[#17191C] text-[#EDEBE6] font-mono text-[12px] flex items-center gap-2 z-50">
            <Check className="w-3.5 h-3.5 text-[#C98A3E]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
  );
}
