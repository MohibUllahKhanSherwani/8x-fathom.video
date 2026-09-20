"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Play,
  Lock,
  ChevronDown,
  X,
  Mic,
  Plus,
  Send,
  CheckCircle2,
  Users2,
  UserCheck,
} from "lucide-react";
import { Logo, FathomSwoosh } from "@/components/brand/Logo";

export default function RootLandingPage() {
  const [showBanner, setShowBanner] = useState(true);
  const [audienceTab, setAudienceTab] = useState<"teams" | "individuals">("teams");
  const [clarityTab, setClarityTab] = useState<"clarity" | "momentum" | "ease">("clarity");

  return (
    <div className="min-h-screen bg-[#07080a] text-white flex flex-col selection:bg-[#00b2ea]/30 selection:text-white font-sans overflow-x-hidden">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      {showBanner && (
        <div className="bg-[#ffffff] text-[#111214] text-xs font-semibold py-2 px-4 flex items-center justify-between z-40 border-b border-[#e2e8f0]">
          <div className="flex-1 text-center flex items-center justify-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#111214] text-white font-black text-[10px]">
              A+
            </span>
            <span className="tracking-wide">FATHOM IS NOW PART OF SUPERHUMAN.</span>
            <a
              href="https://fathom.video"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-[#00b2ea] transition-colors ml-1 font-bold inline-flex items-center gap-1"
            >
              LEARN MORE <ArrowRight className="w-3 h-3 inline" />
            </a>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-[#64748b] hover:text-[#111214] transition-colors p-1"
            aria-label="Close banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. NAVIGATION HEADER */}
      <header className="h-16 border-b border-[#1f232b]/80 px-6 lg:px-12 flex items-center justify-between sticky top-0 bg-[#07080a]/90 backdrop-blur-md z-30">
        <div className="flex items-center gap-10">
          <Logo href="/" size="lg" />

          <nav className="hidden lg:flex items-center gap-1 bg-[#13151b] border border-[#252834] rounded-full px-4 py-1.5 text-xs text-[#9a9ba1] font-medium shadow-inner">
            <Link href="/" className="px-3 py-1 text-white font-semibold">
              Overview
            </Link>
            <span className="px-3 py-1 hover:text-white transition-colors cursor-pointer flex items-center gap-1">
              Solutions <ChevronDown className="w-3 h-3" />
            </span>
            <span className="px-3 py-1 hover:text-white transition-colors cursor-pointer flex items-center gap-1">
              Integrations <ChevronDown className="w-3 h-3" />
            </span>
            <span className="px-3 py-1 hover:text-white transition-colors cursor-pointer flex items-center gap-1">
              Resources <ChevronDown className="w-3 h-3" />
            </span>
            <Link href="/pricing" className="px-3 py-1 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://fathomvideo.typeform.com/to/AYeoqHBS"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:block text-xs font-semibold text-[#d1d5db] hover:text-white transition-colors"
          >
            Book a Demo
          </a>
          <Link
            href="/login"
            className="text-xs font-semibold text-[#d1d5db] hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/demo"
            className="h-9 px-5 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-bold text-xs rounded-full flex items-center gap-1.5 transition-all shadow-md shadow-[#00b2ea]/20 cursor-pointer"
          >
            SIGN UP FREE
          </Link>
        </div>
      </header>

      {/* 3. HERO SECTION (Screenshot 1) */}
      <section className="relative min-h-[680px] lg:min-h-[740px] px-6 lg:px-12 pt-16 pb-20 flex flex-col justify-center overflow-hidden">
        {/* Starfield & Glow Background */}
        <div className="absolute inset-0 bg-[#050608] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[500px] bg-[#00b2ea]/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-[#a855f7]/10 rounded-full blur-[160px]" />
        </div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              AI notetaking that is <br />
              <span className="text-white">out of this world</span>
            </h1>

            <p className="text-base sm:text-lg text-[#9a9ba1] max-w-xl leading-relaxed font-normal">
              Fathom summarizes your meetings so you can focus on the conversation.{" "}
              <strong className="text-white font-semibold">Now available bot-free.</strong>
            </p>

            <div className="pt-2">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center h-12 px-8 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-extrabold text-xs tracking-wider uppercase rounded-full transition-all shadow-xl shadow-[#00b2ea]/25 hover:scale-[1.02] cursor-pointer"
              >
                GET STARTED - FREE FOREVER
              </Link>
            </div>

            {/* Compliance Badge */}
            <div className="pt-4 flex items-center gap-2 text-[11px] text-[#6b7280]">
              <Lock className="w-3.5 h-3.5 text-[#00b2ea]" />
              <span>SOC 2 Type II | GDPR | HIPAA Compliant | SSO / SCIM</span>
            </div>
          </div>

          {/* Right Column: Floating Astronaut & UI Cards Composition */}
          <div className="lg:col-span-6 relative h-[480px] sm:h-[540px] flex items-center justify-center">
            {/* Astronaut Image with Floating Animation */}
            <div className="relative w-[340px] sm:w-[380px] h-[340px] sm:h-[380px] rounded-3xl overflow-hidden border border-[#232733] shadow-2xl z-10 bg-gradient-to-br from-[#12141a] to-[#0a0b0e]">
              <Image
                src="/astronaut.jpg"
                alt="Floating astronaut taking notes with laptop"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Floating Card 1: Bot-Free Mode Selector (Top Right) */}
            <div className="absolute -top-4 right-0 sm:right-4 z-20 w-64 bg-[#14161d]/95 backdrop-blur-md rounded-2xl border border-[#2b2f3d] p-3.5 shadow-2xl space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#232733]">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#3b82f6] border border-[#14161d] text-[9px] font-bold flex items-center justify-center">
                      L
                    </span>
                    <span className="w-5 h-5 rounded-full bg-[#10b981] border border-[#14161d] text-[9px] font-bold flex items-center justify-center">
                      J
                    </span>
                    <span className="w-5 h-5 rounded-full bg-[#f59e0b] border border-[#14161d] text-[9px] font-bold flex items-center justify-center">
                      M
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-white">Project check-in</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="px-2.5 py-1.5 rounded-lg text-[#9a9ba1] flex items-center justify-between">
                  <span>🎧 Audio & video</span>
                </div>
                <div className="px-2.5 py-1.5 rounded-lg bg-[#222633] text-white font-semibold flex items-center justify-between border border-[#00b2ea]/40">
                  <span>🎧 Audio</span>
                  <span className="text-[9px] font-bold uppercase bg-[#00b2ea]/20 text-[#00b2ea] px-1.5 py-0.5 rounded">
                    BOT-FREE
                  </span>
                </div>
                <div className="px-2.5 py-1.5 rounded-lg text-[#9a9ba1] flex items-center justify-between">
                  <span>📝 Transcript only</span>
                  <span className="text-[9px] font-bold uppercase bg-[#2b2f3d] text-[#9a9ba1] px-1.5 py-0.5 rounded">
                    BOT-FREE
                  </span>
                </div>
                <div className="px-2.5 py-1.5 rounded-lg text-[#ef4444] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                  <span>Capture off</span>
                </div>
              </div>
            </div>

            {/* Floating Card 2: Ask Fathom Pill (Far Right Center) */}
            <div className="absolute top-1/2 -right-2 sm:right-2 -translate-y-12 z-20 bg-[#161922] border border-[#2e3344] rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-2 text-xs font-bold text-white tracking-wider">
              <Sparkles className="w-4 h-4 text-[#00b2ea]" />
              <span>ASK FATHOM</span>
            </div>

            {/* Floating Card 3: Chat Query Prompt (Bottom Right) */}
            <div className="absolute -bottom-8 right-2 sm:right-6 z-20 w-72 bg-[#12141a]/95 backdrop-blur-md rounded-2xl border border-[#2b2f3e] p-3.5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#6b7280]">AI ASSISTANT</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#10a37f] text-white text-[9px] font-black flex items-center justify-center">
                    G
                  </span>
                  <span className="w-4 h-4 rounded-full bg-[#d97706] text-white text-[9px] font-black flex items-center justify-center">
                    C
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#e2e8f0] font-medium leading-snug">
                &ldquo;Fathom, what follow-ups did I commit to in my meetings this week?&rdquo;
              </p>

              <div className="pt-2 border-t border-[#232733] flex items-center justify-between text-[#9a9ba1]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#1e222e] flex items-center justify-center text-white">
                    <Plus className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10px] font-semibold text-[#00b2ea] bg-[#00b2ea]/10 px-2 py-0.5 rounded">
                    ▶ Fathom
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mic className="w-3.5 h-3.5 text-[#9a9ba1]" />
                  <span className="w-6 h-6 rounded-full bg-[#00b2ea] text-black flex items-center justify-center">
                    <Send className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            {/* Glowing Moon / Blue Planet Sphere */}
            <div className="absolute -bottom-6 -left-6 z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-[#0284c7] via-[#38bdf8] to-[#bae6fd] shadow-2xl shadow-[#38bdf8]/40 border-2 border-[#bae6fd]/30 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#0369a1_2px,transparent_2px)] [background-size:8px_8px] opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOCIAL PROOF & LOGOS SECTION (Screenshot 2) */}
      <section className="py-16 px-6 lg:px-12 border-t border-[#181b22] bg-[#090b0f] text-center relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* G2 Rating & Used at 300K+ */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#ff492c] text-white font-black text-sm flex items-center justify-center shadow-md">
                G²
              </span>
              <div className="text-left">
                <div className="flex items-center gap-1 text-[#f59e0b]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                  <span className="text-xs font-bold text-white ml-1">5.0 / 5.0</span>
                </div>
                <p className="text-[11px] text-[#9a9ba1]">#1 rated • 6,500+ reviews</p>
              </div>
            </div>

            <div className="h-8 w-px bg-[#262934] hidden sm:block" />

            <div className="text-left">
              <p className="text-lg font-extrabold text-white">Used at 300K+ companies</p>
              <p className="text-[11px] text-[#9a9ba1]">from hypergrowth startups to Fortune 500s</p>
            </div>
          </div>

          {/* Company Logos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {["HubSpot", "Adobe", "_zapier", "GRUBHUB", "EA", "Calendly"].map((company, idx) => (
              <div
                key={idx}
                className="h-14 rounded-xl bg-[#13151c] border border-[#202430] flex items-center justify-center font-bold text-sm text-[#cbd5e1] hover:text-white hover:border-[#333847] transition-all"
              >
                {company}
              </div>
            ))}
          </div>

          {/* Section Heading & Subheading */}
          <div className="max-w-3xl mx-auto space-y-3 pt-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Capture notes your way – bot or no bot – <br />
              so you can stay focused on the meeting
            </h2>
            <p className="text-sm text-[#9a9ba1]">
              AI summaries instantly available after your call
            </p>
          </div>

          {/* Dual Visual Showcase Preview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left max-w-6xl mx-auto">
            {/* Left Card: Video Call & Meeting View */}
            <div className="lg:col-span-6 rounded-2xl bg-[#12141a] border border-[#232733] p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Q3 Strategy + Planning</h3>
                <div className="flex -space-x-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#3b82f6] text-[10px] font-bold flex items-center justify-center border border-[#12141a]">
                    L
                  </span>
                  <span className="w-6 h-6 rounded-full bg-[#10b981] text-[10px] font-bold flex items-center justify-center border border-[#12141a]">
                    J
                  </span>
                </div>
              </div>

              {/* Video Call Simulation Box */}
              <div className="grid grid-cols-2 gap-3 aspect-video bg-[#1a1d26] rounded-xl p-2 border border-[#2a2e3d] overflow-hidden">
                <div className="relative rounded-lg bg-[#272b38] flex flex-col justify-between p-2">
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#9a9ba1]">
                    Lily (Speaker)
                  </div>
                  <span className="text-[10px] font-semibold bg-black/60 px-2 py-0.5 rounded text-white self-start">
                    Lily
                  </span>
                </div>
                <div className="relative rounded-lg bg-[#272b38] flex flex-col justify-between p-2">
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#9a9ba1]">
                    Jordan (Listener)
                  </div>
                  <span className="text-[10px] font-semibold bg-black/60 px-2 py-0.5 rounded text-white self-start">
                    Jordan
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card: Summary with Highlighted Action Items */}
            <div className="lg:col-span-6 rounded-2xl bg-[#12141a] border border-[#232733] p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-4 border-b border-[#202430] pb-3">
                <button className="text-xs font-bold text-[#00b2ea] flex items-center gap-1 border-b-2 border-[#00b2ea] pb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Summary
                </button>
                <button className="text-xs font-semibold text-[#9a9ba1] hover:text-white pb-1">
                  Scratchpad
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#cbd5e1] leading-relaxed">
                <p>• Lily outlined top Q3 priorities, focusing on growth targets and key initiatives.</p>
                <p>• Jordan raised concerns around resourcing and timeline feasibility.</p>
                <div className="p-3 rounded-xl bg-[#00b2ea]/10 border border-[#00b2ea]/30 text-white">
                  <span className="text-[#00b2ea] font-bold">@Lily</span> to follow-up with Jordan
                  about additional outside resources.
                </div>
                <p>• Jordan suggested reallocating budget to support higher-impact projects.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MOVE WORK FORWARD FASTER WITH ROCKET (Screenshot 3) */}
      <section className="py-20 px-6 lg:px-12 bg-[#060709] relative overflow-hidden text-center">
        <div className="max-w-6xl mx-auto relative z-10 space-y-8">
          {/* Header with Rocket Illustration */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Move work
            </h2>
            <div className="relative w-36 h-20 md:w-48 md:h-24 shrink-0 hover:scale-110 transition-transform duration-300">
              <Image
                src="/rocket.jpg"
                alt="Retro-futuristic rocket illustration"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#f97316] tracking-tight">
              forward faster
            </h2>
          </div>

          <p className="text-base sm:text-lg text-[#9a9ba1] max-w-2xl mx-auto">
            Whether you’re a team of 1 or 1,000, Fathom’s got your back
          </p>

          {/* Interactive Card with Tabs */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-[#151720] to-[#0d0e14] border border-[#252834] p-8 shadow-2xl text-left">
            {/* Tabs Header */}
            <div className="flex items-center gap-8 border-b border-[#252834] pb-4 mb-6">
              <button
                onClick={() => setAudienceTab("teams")}
                className={`text-sm font-bold pb-2 transition-colors relative cursor-pointer ${
                  audienceTab === "teams"
                    ? "text-[#fbbf24]"
                    : "text-[#9a9ba1] hover:text-white"
                }`}
              >
                <span>Fathom for teams</span>
                {audienceTab === "teams" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fbbf24]" />
                )}
              </button>

              <button
                onClick={() => setAudienceTab("individuals")}
                className={`text-sm font-bold pb-2 transition-colors relative cursor-pointer ${
                  audienceTab === "individuals"
                    ? "text-[#00b2ea]"
                    : "text-[#9a9ba1] hover:text-white"
                }`}
              >
                <span>Fathom for individuals</span>
                {audienceTab === "individuals" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b2ea]" />
                )}
              </button>
            </div>

            {/* Tab Contents */}
            {audienceTab === "teams" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white font-bold text-lg">
                    <Users2 className="w-5 h-5 text-[#fbbf24]" />
                    <span>Shared visibility. Smarter execution.</span>
                  </div>
                  <p className="text-xs text-[#9a9ba1] leading-relaxed">
                    Keep your entire revenue, product, and engineering team aligned. Fathom automatically routes meeting summaries to Slack, syncs CRM deal fields, and lets anyone search across all company calls.
                  </p>
                  <ul className="space-y-2 text-xs text-[#cbd5e1]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#fbbf24]" />
                      <span>Centralized team repository with custom folders</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#fbbf24]" />
                      <span>Deal View pipeline intelligence & risk detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#fbbf24]" />
                      <span>Keyword alerts for competitors, churn risk, & pricing</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl bg-[#1a1d27] border border-[#2b2f3d] p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#9a9ba1]">
                    <span>Team Activity</span>
                    <span className="text-[#fbbf24] font-bold">14 Calls Analyzed</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#232734] text-xs text-white space-y-1">
                    <p className="font-semibold">Enterprise Deal Review</p>
                    <p className="text-[#9a9ba1] text-[11px]">Synced to Salesforce • 3 Action Items assigned</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#232734] text-xs text-white space-y-1">
                    <p className="font-semibold">Weekly Engineering Sync</p>
                    <p className="text-[#9a9ba1] text-[11px]">Auto-posted to #eng-recap on Slack</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white font-bold text-lg">
                    <UserCheck className="w-5 h-5 text-[#00b2ea]" />
                    <span>100% Present in Every Meeting</span>
                  </div>
                  <p className="text-xs text-[#9a9ba1] leading-relaxed">
                    Never worry about scribbling notes while listening to a client or manager. Fathom listens, captures key moments, highlights quotes, and generates crisp action items sent straight to your inbox.
                  </p>
                  <ul className="space-y-2 text-xs text-[#cbd5e1]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b2ea]" />
                      <span>Unlimited free recordings & instant summaries</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b2ea]" />
                      <span>Natural conversational assistant with Ask Fathom</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b2ea]" />
                      <span>One-click clip trimming & custom share links</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl bg-[#1a1d27] border border-[#2b2f3d] p-5 space-y-3">
                  <div className="text-xs font-bold text-[#00b2ea]">Your Meeting Highlights</div>
                  <p className="text-xs text-[#cbd5e1] leading-relaxed">
                    &ldquo;Lily, let&apos;s schedule the follow-up for Tuesday 2 PM with the updated design tokens.&rdquo;
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-[10px] font-bold bg-[#00b2ea]/20 text-[#00b2ea] px-2 py-0.5 rounded">
                      Action Item Extracted
                    </span>
                    <span className="text-[10px] text-[#9a9ba1]">Due Tuesday</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. CLARITY SECTION WITH CIRCULAR GRADIENT PORTAL (Screenshot 4) */}
      <section className="py-24 px-6 lg:px-12 bg-[#07080a] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Clarity Nav, Text & CTA */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-2">
              <h2
                onClick={() => setClarityTab("clarity")}
                className={`text-5xl sm:text-6xl font-extrabold cursor-pointer transition-colors ${
                  clarityTab === "clarity" ? "text-white" : "text-[#3a3f4d] hover:text-white"
                }`}
              >
                Clarity
              </h2>
              <h3
                onClick={() => setClarityTab("momentum")}
                className={`text-4xl sm:text-5xl font-extrabold cursor-pointer transition-colors ${
                  clarityTab === "momentum" ? "text-white" : "text-[#2e3340] hover:text-white"
                }`}
              >
                Momentum
              </h3>
              <h3
                onClick={() => setClarityTab("ease")}
                className={`text-4xl sm:text-5xl font-extrabold cursor-pointer transition-colors ${
                  clarityTab === "ease" ? "text-white" : "text-[#222630] hover:text-white"
                }`}
              >
                Ease
              </h3>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00b2ea] tracking-wide">
              <span>✦</span>
              <span>Unforgettable meetings...quite literally</span>
            </div>

            <p className="text-sm text-[#9a9ba1] leading-relaxed">
              Shockingly accurate transcripts, instant summaries, and action items with consistent quality across every call – delivered straight to your inbox, like magic.
            </p>

            <div className="pt-2">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center h-12 px-8 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-extrabold text-xs tracking-wider uppercase rounded-full transition-all shadow-xl shadow-[#00b2ea]/25 cursor-pointer"
              >
                GET STARTED. IT&apos;S FREE.
              </Link>
            </div>
          </div>

          {/* Right Column: Circular Neon Gradient Portal & Summary Card */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            {/* Glowing Neon Circular Orb / Portal */}
            <div className="w-[440px] sm:w-[540px] h-[440px] sm:h-[540px] rounded-full p-[18px] bg-gradient-to-tr from-[#00b2ea] via-[#a855f7] to-[#ec4899] shadow-[0_0_90px_rgba(0,178,234,0.35)] flex items-center justify-center relative">
              <div className="w-full h-full rounded-full bg-[#090b10] p-6 flex items-center justify-center relative overflow-hidden">
                {/* Embedded Summary Card */}
                <div className="w-full max-w-md bg-[#13151c]/95 border border-[#2b2f3d] rounded-2xl p-6 shadow-2xl space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-[#232733] pb-3">
                    <h4 className="text-sm font-bold text-white">Summary</h4>
                    <span className="text-[11px] text-[#00b2ea] font-semibold hover:underline cursor-pointer">
                      Change Template
                    </span>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed">
                    <div>
                      <p className="font-bold text-white mb-1">Meeting Purpose</p>
                      <p className="text-[#9a9ba1]">• Quarterly sales performance review of ThinkBionics</p>
                    </div>

                    <div>
                      <p className="font-bold text-white mb-1">Topics:</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-[#00b2ea]">New Feature Launch Impact:</p>
                        <div className="p-2.5 rounded-lg bg-[#00b2ea]/15 border border-[#00b2ea]/40 text-white flex items-start gap-2">
                          <Play className="w-3.5 h-3.5 fill-[#00b2ea] text-[#00b2ea] shrink-0 mt-0.5" />
                          <span>
                            The recent release of the AI-driven analytics module positively impacted user engagement and retention.
                          </span>
                        </div>
                        <p className="text-[#9a9ba1]">
                          • Several users provided positive feedback regarding the ease of use and the added value this feature brings to their operations.
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-white">Customer Feedback Insights:</p>
                      <p className="text-[#9a9ba1]">
                        • A summary of user feedback revealed a consistent demand for enhanced mobile compatibility.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#232733]">
                      <p className="font-bold text-white">Action Items</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FATHOM TEAMS WORK SMARTER (Screenshot 5) */}
      <section className="py-24 px-6 lg:px-12 bg-[#090b10] relative overflow-hidden text-center border-t border-[#181b24]">
        {/* Subtle Pink Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:40px_40px] opacity-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Fathom teams <br />
            work smarter
          </h2>

          {/* 3 Vertical Pillar Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-4xl mx-auto">
            {/* Pillar 1: 95% of users (Orange) */}
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] p-6 flex flex-col items-center justify-center text-center shadow-2xl shadow-[#f97316]/30 hover:scale-105 transition-transform duration-300">
                <span className="text-2xl font-black text-white">95% of users</span>
                <p className="text-[11px] text-white/90 mt-2 font-medium leading-snug">
                  say Fathom helps them stay fully present in meetings
                </p>
              </div>
              <div className="w-32 h-24 bg-gradient-to-b from-[#f97316]/20 to-transparent rounded-b-2xl" />
            </div>

            {/* Pillar 2: 6+ hours saved (Pink) */}
            <div className="flex flex-col items-center">
              <div className="w-52 h-52 rounded-full bg-gradient-to-br from-[#f472b6] to-[#ec4899] p-6 flex flex-col items-center justify-center text-center shadow-2xl shadow-[#ec4899]/30 hover:scale-105 transition-transform duration-300">
                <span className="text-3xl font-black text-white">6+ hours saved</span>
                <p className="text-[11px] text-white/90 mt-2 font-medium leading-snug">
                  per team member every week on follow-up work
                </p>
              </div>
              <div className="w-36 h-36 bg-gradient-to-b from-[#ec4899]/20 to-transparent rounded-b-2xl" />
            </div>

            {/* Pillar 3: 3X Faster (Cyan) */}
            <div className="flex flex-col items-center">
              <div className="w-56 h-56 rounded-full bg-gradient-to-br from-[#00b2ea] to-[#0284c7] p-6 flex flex-col items-center justify-center text-center shadow-2xl shadow-[#00b2ea]/30 hover:scale-105 transition-transform duration-300">
                <span className="text-3xl font-black text-white">3X Faster</span>
                <p className="text-[11px] text-white/90 mt-2 font-medium leading-snug">
                  from meeting insights to actionable next steps
                </p>
              </div>
              <div className="w-40 h-48 bg-gradient-to-b from-[#00b2ea]/20 to-transparent rounded-b-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-[#1a1d26] bg-[#050608] py-14 px-8 text-xs text-[#9a9ba1]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <FathomSwoosh className="w-5 h-5" />
            <span className="font-semibold text-white">Fathom © 2026</span>
            <span className="text-[#374151]">•</span>
            <span>All Rights Reserved</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">
              Overview
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/demo" className="hover:text-white transition-colors">
              Workspace
            </Link>
            <Link href="/calls/829997321" className="hover:text-white transition-colors">
              Featured Meeting
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Log In
            </Link>
            <a
              href="https://fathom.video"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Live Fathom Reference
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
