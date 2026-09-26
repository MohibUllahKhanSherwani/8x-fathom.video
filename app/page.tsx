"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Pause,
  CheckSquare,
  Square,
  Share2,
  Lock,
  Volume2
} from "lucide-react";

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-[#1C1E22] text-[#EDEBE6] font-sans antialiased selection:bg-[#C98A3E]/30 selection:text-[#EDEBE6]">
      {/* ========================================================================= */}
      {/* 1. MINIMAL GRAPHITE HEADER                                                */}
      {/* ========================================================================= */}
      <header className="border-b border-[#282B31] bg-[#17191C]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-serif-heading text-[18px] font-medium tracking-tight text-[#EDEBE6] hover:text-[#EDEBE6]/90 transition-colors"
            >
              Fathom
            </Link>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E929B] hidden sm:inline">
              Notetaker
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
              className="text-[#8E929B] hover:text-[#EDEBE6] transition-colors"
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
      {/* 2. HERO SECTION: DIRECT HEADLINE, AMBER CTA, LIVE-FEELING MOCKUP          */}
      {/* ========================================================================= */}
      <section className="pt-16 pb-20 px-6 max-w-6xl mx-auto space-y-12">
        {/* Left-Aligned Headline & Copy */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="font-serif-heading text-[32px] sm:text-[40px] font-medium text-[#EDEBE6] leading-[1.18] tracking-tight">
            Fathom records, transcribes, and summarizes meetings with instant audio verification.
          </h1>

          <p className="text-[14px] sm:text-[15px] text-[#8E929B] leading-relaxed">
            A meeting notetaker built for teams that require visible recording consent,
            clickable timestamps on every sentence, and a quiet single-document interface.
          </p>

          {/* Singular Primary CTA using Amber Accent */}
          <div className="pt-2">
            <Link
              href="/home"
              className="inline-flex items-center gap-2 bg-[#C98A3E] text-[#1C1E22] font-semibold text-[13px] px-5 py-2.5 rounded-[4px] hover:bg-[#d8974a] transition-colors cursor-pointer"
            >
              <span>Open Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Live-Feeling Product Mockup (Exact reproduction of meeting workspace) */}
        <div className="border border-[#282B31] rounded-[4px] bg-[#17191C] overflow-hidden">
          {/* Mockup Window Chrome */}
          <div className="h-9 px-4 border-b border-[#282B31] bg-[#141619] flex items-center justify-between text-[11px] font-mono text-[#8E929B]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#282B31]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#282B31]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#282B31]" />
              <span className="ml-2 text-[#EDEBE6]">fathom.workspace/q4-roadmap-planning</span>
            </div>
            <span>60 min session</span>
          </div>

          {/* Two-Pane Workspace Layout */}
          <div className="flex flex-col md:flex-row min-h-[500px]">
            {/* Left Rail */}
            <div className="w-full md:w-64 border-r border-[#282B31] bg-[#17191C] p-3 space-y-2 text-left">
              <div className="text-[11px] font-mono text-[#8E929B] uppercase tracking-wider px-2 py-1">
                Recent Meetings
              </div>
              <div className="space-y-1">
                <div className="p-2.5 rounded-[4px] bg-[#22252B] border-l-2 border-[#EDEBE6] space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-serif-heading text-[12px] font-medium text-[#EDEBE6] truncate">
                      Q4 Roadmap Planning
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C98A3E] animate-pulse" />
                  </div>
                  <div className="text-[10px] font-mono text-[#8E929B]">60 min • Zoom • Internal</div>
                </div>

                <div className="p-2.5 rounded-[4px] hover:bg-[#1C1E22] space-y-0.5 transition-colors">
                  <div className="font-serif-heading text-[12px] font-medium text-[#EDEBE6] truncate">
                    Senior Frontend Interview
                  </div>
                  <div className="text-[10px] font-mono text-[#8E929B]">25 min • Zoom • External</div>
                </div>

                <div className="p-2.5 rounded-[4px] hover:bg-[#1C1E22] space-y-0.5 transition-colors">
                  <div className="font-serif-heading text-[12px] font-medium text-[#EDEBE6] truncate">
                    Ramp Enterprise QBR
                  </div>
                  <div className="text-[10px] font-mono text-[#8E929B]">35 min • Teams • External</div>
                </div>
              </div>
            </div>

            {/* Main Pane */}
            <div className="flex-1 p-6 md:p-8 bg-[#1C1E22] space-y-6 text-left">
              {/* Prominent Recording Banner */}
              <div className="p-3.5 rounded-[4px] bg-[#25221B] border-2 border-[#C98A3E] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#C98A3E] animate-pulse flex-shrink-0" />
                  <div>
                    <div className="font-mono text-[12px] font-bold tracking-wider uppercase text-[#C98A3E]">
                      ● RECORDING IN PROGRESS — AUDIO &amp; TRANSCRIPT ACTIVE
                    </div>
                    <div className="text-[11px] text-[#8E929B] mt-0.5">
                      All attendees acknowledged recording notice. Consent state is active and verified.
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded-[4px] border border-[#282B31] text-[#EDEBE6]">
                  Pause Capture
                </span>
              </div>

              {/* Title & Header */}
              <div className="flex items-center justify-between border-b border-[#282B31] pb-4">
                <div>
                  <h2 className="font-serif-heading text-[22px] font-medium text-[#EDEBE6]">
                    Q4 Roadmap Planning
                  </h2>
                  <div className="text-[11px] font-mono text-[#8E929B] mt-1">
                    60 minutes • 8 Participants • Host: Alex Rivera
                  </div>
                </div>
                <div className="bg-[#C98A3E] text-[#1C1E22] font-semibold text-[11px] px-3 py-1.5 rounded-[4px] flex items-center gap-1.5">
                  <Share2 className="w-3 h-3" />
                  <span>Share Summary</span>
                </div>
              </div>

              {/* Player Scrubber */}
              <div className="border border-[#282B31] rounded-[4px] bg-[#141619] p-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded-[4px] border border-[#282B31] bg-[#1C1E22] flex items-center justify-center text-[#EDEBE6]">
                  <Pause className="w-3 h-3" />
                </div>
                <div className="flex-1 h-1.5 bg-[#282B31] rounded-[2px] relative overflow-hidden">
                  <div className="h-full bg-[#EDEBE6] w-[23%]" />
                </div>
                <span className="font-mono text-[11px] text-[#EDEBE6]">14:00 / 60:00</span>
                <span className="font-mono text-[10px] text-[#8E929B]">1x</span>
              </div>

              {/* Summary Takeaways with Clickable Timestamp */}
              <div className="space-y-3 pt-2">
                <div className="font-serif-heading text-[16px] font-medium text-[#EDEBE6] border-b border-[#282B31] pb-1.5">
                  Executive Summary &amp; Key Decisions
                </div>
                <div className="space-y-2 text-[13px]">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-[4px] bg-[#C98A3E] text-[#1C1E22] font-bold border border-[#C98A3E]">
                      14:00
                    </span>
                    <span className="text-[#EDEBE6]">
                      Self-serve onboarding is Priority 1 with a target setup time under 2 minutes, featuring a 60-second simulated test call.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-[4px] text-[#8E929B] border border-[#282B31]">
                      24:30
                    </span>
                    <span className="text-[#EDEBE6]">
                      Official launch date finalized for November 18th following staging soak testing.
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Item Preview */}
              <div className="space-y-2 pt-2 border-t border-[#282B31]">
                <div className="font-serif-heading text-[15px] font-medium text-[#EDEBE6]">
                  Action Items &amp; Commitments
                </div>
                <div className="p-2.5 rounded-[4px] border border-[#282B31] bg-[#17191C] flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <Square className="w-3.5 h-3.5 text-[#8E929B]" />
                    <span className="text-[#EDEBE6]">Finalize pricing sheet and discount approval matrix</span>
                    <span className="text-[#8E929B] font-mono text-[11px]">(Carlos Ramirez)</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#8E929B] border border-[#282B31] px-1.5 py-0.5 rounded-[4px]">
                    42:00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BELOW THE FOLD: 3 PRODUCT DECISIONS AS CONCRETE PRODUCT REASONING      */}
      {/* ========================================================================= */}
      <section className="border-t border-[#282B31] py-20 px-6 max-w-6xl mx-auto space-y-20">
        {/* Decision 1: Visible Recording State */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-3">
            <h2 className="font-serif-heading text-[22px] sm:text-[24px] font-medium text-[#EDEBE6] leading-snug">
              Attendee consent requires an unmissable recording indicator.
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#8E929B] leading-relaxed">
              Standard AI notetakers join meetings quietly in the background. Participants
              often realize too late that their comments are being permanently captured,
              creating privacy issues and compliance risks.
            </p>
            <p className="text-[13px] sm:text-[14px] text-[#8E929B] leading-relaxed">
              Fathom makes the recording state the most prominent element on screen. A high-contrast
              status bar confirms active capture, verifies attendee consent, and provides instant
              pause controls at any second.
            </p>
          </div>

          <div className="md:col-span-7 border border-[#282B31] rounded-[4px] bg-[#17191C] p-5 space-y-4">
            <div className="text-[11px] font-mono uppercase text-[#8E929B] tracking-wider">
              Recording Governance States
            </div>

            {/* Active State */}
            <div className="p-3.5 rounded-[4px] bg-[#25221B] border-2 border-[#C98A3E] space-y-1">
              <div className="flex items-center gap-2 font-mono text-[12px] font-bold uppercase text-[#C98A3E]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C98A3E] animate-pulse" />
                <span>● Active Capture — Consent Verified</span>
              </div>
              <p className="text-[12px] text-[#8E929B] pl-4">
                Chat notice sent to meeting participants. In-room attendees have confirmed awareness.
              </p>
            </div>

            {/* Paused State */}
            <div className="p-3.5 rounded-[4px] bg-[#141619] border border-[#282B31] space-y-1">
              <div className="flex items-center gap-2 font-mono text-[12px] text-[#EDEBE6]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5A5E67]" />
                <span>○ Capture Idle — Audio Paused</span>
              </div>
              <p className="text-[12px] text-[#8E929B] pl-4">
                Transcription pipeline halted. Sensitive discussions remain off the record.
              </p>
            </div>
          </div>
        </div>

        {/* Decision 2: Clickable Timestamp Chips */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-[#282B31] pt-16">
          <div className="md:col-span-5 space-y-3">
            <h2 className="font-serif-heading text-[22px] sm:text-[24px] font-medium text-[#EDEBE6] leading-snug">
              Every summary sentence is linked to the exact spoken second.
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#8E929B] leading-relaxed">
              When an AI summary states that a budget was cut or a launch was delayed,
              executives need to hear the exact tone and context before making decisions.
              Generic meeting tools deliver disconnected text bullets that force you to scrub
              blindly through an hour of audio.
            </p>
            <p className="text-[13px] sm:text-[14px] text-[#8E929B] leading-relaxed">
              Every takeaway, topic outline, action item, and transcript sentence in Fathom
              is anchored to an exact millisecond. Clicking any timestamp chip jumps the player
              straight to that word.
            </p>
          </div>

          <div className="md:col-span-7 border border-[#282B31] rounded-[4px] bg-[#17191C] p-5 space-y-3">
            <div className="text-[11px] font-mono uppercase text-[#8E929B] tracking-wider">
              Direct Verifiable Traceability
            </div>

            <div className="p-3 rounded-[4px] border border-[#282B31] bg-[#141619] space-y-2">
              <div className="flex items-center gap-2 text-[12px]">
                <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-[4px] bg-[#C98A3E] text-[#1C1E22] font-bold">
                  24:30
                </span>
                <span className="text-[#EDEBE6] font-medium">Executive Takeaway:</span>
              </div>
              <p className="text-[13px] text-[#EDEBE6] leading-relaxed pl-1">
                Official launch date finalized for November 18th following staging soak testing.
              </p>
            </div>

            <div className="p-3 rounded-[4px] border border-[#282B31] bg-[#1C1E22] space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8E929B]">
                <span className="text-[#EDEBE6] font-serif-heading text-[13px]">Daniel Okafor (VP Engineering)</span>
                <span>24:30</span>
              </div>
              <p className="text-[13px] text-[#EDEBE6] leading-relaxed">
                &ldquo;November 4th is too risky for the database migration. We need two weeks of staging soak testing. November 18th is the responsible date.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Decision 3: Single-Pane Document Flow */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-[#282B31] pt-16">
          <div className="md:col-span-5 space-y-3">
            <h2 className="font-serif-heading text-[22px] sm:text-[24px] font-medium text-[#EDEBE6] leading-snug">
              All meeting intelligence in one continuous document.
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#8E929B] leading-relaxed">
              Most meeting platforms cram tabs, nested modals, CRM sync widgets, and workspace
              switchers into an overwhelming interface. Users get lost trying to find their notes.
            </p>
            <p className="text-[13px] sm:text-[14px] text-[#8E929B] leading-relaxed">
              Fathom replaces tab sprawl with a single left-aligned document. The video player,
              strategic takeaways, agenda topics, action items checklist, and verbatim speaker
              turns flow naturally on one scrollable canvas.
            </p>
          </div>

          <div className="md:col-span-7 border border-[#282B31] rounded-[4px] bg-[#17191C] p-5 space-y-3">
            <div className="text-[11px] font-mono uppercase text-[#8E929B] tracking-wider">
              Single-Document Architecture
            </div>

            <div className="space-y-2 text-[12px] font-mono">
              <div className="p-2 rounded-[4px] border border-[#282B31] bg-[#141619] flex items-center justify-between text-[#EDEBE6]">
                <span>1. Verified Recording Beacon &amp; Consent</span>
                <span className="text-[#8E929B]">Top Banner</span>
              </div>
              <div className="p-2 rounded-[4px] border border-[#282B31] bg-[#141619] flex items-center justify-between text-[#EDEBE6]">
                <span>2. Audio / Video Scrubber &amp; Controls</span>
                <span className="text-[#8E929B]">Integrated Player</span>
              </div>
              <div className="p-2 rounded-[4px] border border-[#282B31] bg-[#141619] flex items-center justify-between text-[#EDEBE6]">
                <span>3. Executive Summaries (4 Switchable Templates)</span>
                <span className="text-[#8E929B]">Key Takeaways</span>
              </div>
              <div className="p-2 rounded-[4px] border border-[#282B31] bg-[#141619] flex items-center justify-between text-[#EDEBE6]">
                <span>4. Action Items &amp; Commitments Checklist</span>
                <span className="text-[#8E929B]">Owned Tasks</span>
              </div>
              <div className="p-2 rounded-[4px] border border-[#282B31] bg-[#141619] flex items-center justify-between text-[#EDEBE6]">
                <span>5. Verbatim Transcript Turns &amp; Deep-Links</span>
                <span className="text-[#8E929B]">Speaker Dialogue</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="border-t border-[#282B31] bg-[#17191C] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-[12px] font-mono text-[#8E929B]">
          <div>
            <span className="font-serif-heading text-[15px] font-medium text-[#EDEBE6]">Fathom</span>
            <span className="ml-3 text-[#5A5E67]">Meeting Intelligence Workspace</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/home" className="hover:text-[#EDEBE6] transition-colors">
              Workspace
            </Link>
            <Link href="/settings" className="hover:text-[#EDEBE6] transition-colors">
              Settings
            </Link>
            <Link href="/demo" className="hover:text-[#EDEBE6] transition-colors">
              Demo Portal
            </Link>
            <span className="text-[#5A5E67]">© 2026 Fathom AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
