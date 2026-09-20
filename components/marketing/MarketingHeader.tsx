"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  X,
  ArrowRight,
  TrendingUp,
  HeartHandshake,
  Cpu,
  Crown,
  Video,
  Database,
  Bot,
  Sparkles,
  PlayCircle,
  FileSpreadsheet,
  ShieldCheck,
  Zap,
  MessageSquare,
  Compass,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BookDemoModal } from "@/components/marketing/BookDemoModal";

interface MarketingHeaderProps {
  currentPath?: string;
}

export function MarketingHeader({ currentPath = "/" }: MarketingHeaderProps) {
  const [showBanner, setShowBanner] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<"solutions" | "integrations" | "resources" | null>(null);
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (menu: "solutions" | "integrations" | "resources") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const toggleDropdown = (menu: "solutions" | "integrations" | "resources") => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <>
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
            className="text-[#64748b] hover:text-[#111214] transition-colors p-1 cursor-pointer"
            aria-label="Close banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. MAIN HEADER */}
      <header className="h-16 border-b border-[#1f232b]/80 px-6 lg:px-12 flex items-center justify-between sticky top-0 bg-[#07080a]/90 backdrop-blur-md z-30">
        <div className="flex items-center gap-10">
          <Logo href="/" size="lg" />

          {/* Centered Pill Nav */}
          <nav
            ref={navRef}
            className="relative hidden lg:flex items-center gap-1 bg-[#13151b] border border-[#252834] rounded-full px-4 py-1.5 text-xs text-[#9a9ba1] font-medium shadow-inner"
            onMouseLeave={handleMouseLeave}
          >
            {/* Overview */}
            <Link
              href="/"
              className={`px-3 py-1 rounded-full transition-colors ${
                currentPath === "/" ? "text-white font-semibold" : "hover:text-white"
              }`}
            >
              Overview
            </Link>

            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("solutions")}
            >
              <button
                type="button"
                onClick={() => toggleDropdown("solutions")}
                className={`px-3 py-1 transition-colors cursor-pointer flex items-center gap-1 rounded-full ${
                  activeDropdown === "solutions" ? "text-white font-semibold" : "hover:text-white"
                }`}
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    activeDropdown === "solutions" ? "rotate-180 text-[#00b2ea]" : ""
                  }`}
                />
              </button>

              {activeDropdown === "solutions" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[540px] bg-[#111319]/95 backdrop-blur-xl border border-[#282c3c] rounded-2xl shadow-2xl p-4 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/pricing"
                      onClick={() => setActiveDropdown(null)}
                      className="p-3 rounded-xl hover:bg-[#1b1e2a] transition-all flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#00b2ea]/15 border border-[#00b2ea]/30 flex items-center justify-center text-[#00b2ea] group-hover:scale-105 transition-transform shrink-0">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-[#00b2ea] transition-colors flex items-center gap-1">
                          Sales & Revenue
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-[#8e909a] mt-0.5 leading-snug">
                          Sync deal fields to Salesforce & HubSpot, track objections, and close faster.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/demo"
                      onClick={() => setActiveDropdown(null)}
                      className="p-3 rounded-xl hover:bg-[#1b1e2a] transition-all flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#3dbb6b]/15 border border-[#3dbb6b]/30 flex items-center justify-center text-[#3dbb6b] group-hover:scale-105 transition-transform shrink-0">
                        <HeartHandshake className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-[#3dbb6b] transition-colors flex items-center gap-1">
                          Customer Success
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-[#8e909a] mt-0.5 leading-snug">
                          Client handovers, risk alerts, and shared customer timelines.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/calls/829997321"
                      onClick={() => setActiveDropdown(null)}
                      className="p-3 rounded-xl hover:bg-[#1b1e2a] transition-all flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#a855f7]/15 border border-[#a855f7]/30 flex items-center justify-center text-[#a855f7] group-hover:scale-105 transition-transform shrink-0">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-[#a855f7] transition-colors flex items-center gap-1">
                          Product & Engineering
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-[#8e909a] mt-0.5 leading-snug">
                          Roadmap calls, user research clips, and auto-generated action items.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/demo"
                      onClick={() => setActiveDropdown(null)}
                      className="p-3 rounded-xl hover:bg-[#1b1e2a] transition-all flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] group-hover:scale-105 transition-transform shrink-0">
                        <Crown className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-[#f59e0b] transition-colors flex items-center gap-1">
                          Executives & Founders
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-[#8e909a] mt-0.5 leading-snug">
                          Bot-free discreet recording for 1-on-1s, board meetings & strategy.
                        </p>
                      </div>
                    </Link>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#232734] flex items-center justify-between px-2 text-[11px]">
                    <span className="text-[#8e909a]">Looking for team workspace visibility?</span>
                    <Link
                      href="/home"
                      onClick={() => setActiveDropdown(null)}
                      className="text-[#00b2ea] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Explore Team Calls</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Integrations Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("integrations")}
            >
              <button
                type="button"
                onClick={() => toggleDropdown("integrations")}
                className={`px-3 py-1 transition-colors cursor-pointer flex items-center gap-1 rounded-full ${
                  activeDropdown === "integrations" ? "text-white font-semibold" : "hover:text-white"
                }`}
              >
                <span>Integrations</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    activeDropdown === "integrations" ? "rotate-180 text-[#00b2ea]" : ""
                  }`}
                />
              </button>

              {activeDropdown === "integrations" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[560px] bg-[#111319]/95 backdrop-blur-xl border border-[#282c3c] rounded-2xl shadow-2xl p-4 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="grid grid-cols-3 gap-3">
                    {/* Video Platforms */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold tracking-wider text-[#6b7280] uppercase px-2">
                        Meeting Platforms
                      </div>
                      <Link
                        href="/onboarding"
                        onClick={() => setActiveDropdown(null)}
                        className="p-2 rounded-lg hover:bg-[#1b1e2a] transition-colors flex items-center gap-2 text-white group"
                      >
                        <Video className="w-3.5 h-3.5 text-[#00b2ea]" />
                        <span className="group-hover:text-[#00b2ea] font-medium">Zoom</span>
                      </Link>
                      <Link
                        href="/onboarding"
                        onClick={() => setActiveDropdown(null)}
                        className="p-2 rounded-lg hover:bg-[#1b1e2a] transition-colors flex items-center gap-2 text-white group"
                      >
                        <Video className="w-3.5 h-3.5 text-[#3dbb6b]" />
                        <span className="group-hover:text-[#3dbb6b] font-medium">Google Meet</span>
                      </Link>
                      <Link
                        href="/onboarding"
                        onClick={() => setActiveDropdown(null)}
                        className="p-2 rounded-lg hover:bg-[#1b1e2a] transition-colors flex items-center gap-2 text-white group"
                      >
                        <Video className="w-3.5 h-3.5 text-[#818cf8]" />
                        <span className="group-hover:text-[#818cf8] font-medium">Microsoft Teams</span>
                      </Link>
                    </div>

                    {/* CRM & Workspace */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold tracking-wider text-[#6b7280] uppercase px-2">
                        CRM & Workspace
                      </div>
                      <Link
                        href="/pricing"
                        onClick={() => setActiveDropdown(null)}
                        className="p-2 rounded-lg hover:bg-[#1b1e2a] transition-colors flex items-center gap-2 text-white group"
                      >
                        <Database className="w-3.5 h-3.5 text-[#38bdf8]" />
                        <span className="group-hover:text-[#38bdf8] font-medium">Salesforce</span>
                      </Link>
                      <Link
                        href="/pricing"
                        onClick={() => setActiveDropdown(null)}
                        className="p-2 rounded-lg hover:bg-[#1b1e2a] transition-colors flex items-center gap-2 text-white group"
                      >
                        <Database className="w-3.5 h-3.5 text-[#fb923c]" />
                        <span className="group-hover:text-[#fb923c] font-medium">HubSpot</span>
                      </Link>
                      <Link
                        href="/pricing"
                        onClick={() => setActiveDropdown(null)}
                        className="p-2 rounded-lg hover:bg-[#1b1e2a] transition-colors flex items-center gap-2 text-white group"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#e879f9]" />
                        <span className="group-hover:text-[#e879f9] font-medium">Slack</span>
                      </Link>
                    </div>

                    {/* AI & Automation */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold tracking-wider text-[#6b7280] uppercase px-2">
                        AI & Automation
                      </div>
                      <Link
                        href="/demo"
                        onClick={() => setActiveDropdown(null)}
                        className="p-2 rounded-lg hover:bg-[#1b1e2a] transition-colors flex items-center gap-2 text-white group"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#f43f5e]" />
                        <span className="group-hover:text-[#f43f5e] font-medium">Claude & GPT</span>
                      </Link>
                      <Link
                        href="/pricing"
                        onClick={() => setActiveDropdown(null)}
                        className="p-2 rounded-lg hover:bg-[#1b1e2a] transition-colors flex items-center gap-2 text-white group"
                      >
                        <Zap className="w-3.5 h-3.5 text-[#facc15]" />
                        <span className="group-hover:text-[#facc15] font-medium">Zapier & Make</span>
                      </Link>
                      <Link
                        href="/demo"
                        onClick={() => setActiveDropdown(null)}
                        className="p-2 rounded-lg hover:bg-[#1b1e2a] transition-colors flex items-center gap-2 text-white group"
                      >
                        <Bot className="w-3.5 h-3.5 text-[#00b2ea]" />
                        <span className="group-hover:text-[#00b2ea] font-medium">MCP & API</span>
                      </Link>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#232734] flex items-center justify-between px-2 text-[11px]">
                    <span className="text-[#8e909a]">Bot-free capture available on all platforms</span>
                    <Link
                      href="/pricing"
                      onClick={() => setActiveDropdown(null)}
                      className="text-[#00b2ea] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>View All Integrations</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("resources")}
            >
              <button
                type="button"
                onClick={() => toggleDropdown("resources")}
                className={`px-3 py-1 transition-colors cursor-pointer flex items-center gap-1 rounded-full ${
                  activeDropdown === "resources" ? "text-white font-semibold" : "hover:text-white"
                }`}
              >
                <span>Resources</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    activeDropdown === "resources" ? "rotate-180 text-[#00b2ea]" : ""
                  }`}
                />
              </button>

              {activeDropdown === "resources" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[540px] bg-[#111319]/95 backdrop-blur-xl border border-[#282c3c] rounded-2xl shadow-2xl p-4 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/calls/829997321"
                      onClick={() => setActiveDropdown(null)}
                      className="p-3 rounded-xl hover:bg-[#1b1e2a] transition-all flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#00b2ea]/15 border border-[#00b2ea]/30 flex items-center justify-center text-[#00b2ea] group-hover:scale-105 transition-transform shrink-0">
                        <PlayCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-[#00b2ea] transition-colors flex items-center gap-1">
                          Star 8-Person Call (60 min)
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-[#8e909a] mt-0.5 leading-snug">
                          Full roadmap meeting with 8 speakers, audio sync, and planted facts.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/calls/829997322"
                      onClick={() => setActiveDropdown(null)}
                      className="p-3 rounded-xl hover:bg-[#1b1e2a] transition-all flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#3dbb6b]/15 border border-[#3dbb6b]/30 flex items-center justify-center text-[#3dbb6b] group-hover:scale-105 transition-transform shrink-0">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-[#3dbb6b] transition-colors flex items-center gap-1">
                          Interactive Meeting Playback
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-[#8e909a] mt-0.5 leading-snug">
                          Live meeting playback with real audio/video sync & summary.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/pricing"
                      onClick={() => setActiveDropdown(null)}
                      className="p-3 rounded-xl hover:bg-[#1b1e2a] transition-all flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#a855f7]/15 border border-[#a855f7]/30 flex items-center justify-center text-[#a855f7] group-hover:scale-105 transition-transform shrink-0">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-[#a855f7] transition-colors flex items-center gap-1">
                          Plan Comparison Matrix
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-[#8e909a] mt-0.5 leading-snug">
                          Feature-by-feature breakdown of Free, Team, Business and Enterprise.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/pricing"
                      onClick={() => setActiveDropdown(null)}
                      className="p-3 rounded-xl hover:bg-[#1b1e2a] transition-all flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#10b981] group-hover:scale-105 transition-transform shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-[#10b981] transition-colors flex items-center gap-1">
                          Security & Compliance
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-[#8e909a] mt-0.5 leading-snug">
                          SOC 2 Type II, GDPR, HIPAA BAA and end-to-end encryption specs.
                        </p>
                      </div>
                    </Link>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#232734] flex items-center justify-between px-2 text-[11px]">
                    <span className="text-[#8e909a]">Want to try the full app right now?</span>
                    <Link
                      href="/demo"
                      onClick={() => setActiveDropdown(null)}
                      className="text-[#00b2ea] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Launch Interactive Demo</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing */}
            <Link
              href="/pricing"
              className={`px-3 py-1 rounded-full transition-colors ${
                currentPath === "/pricing"
                  ? "text-[#00b2ea] font-semibold"
                  : "hover:text-white"
              }`}
            >
              Pricing
            </Link>
          </nav>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsBookDemoOpen(true)}
            className="hidden sm:block text-xs font-semibold text-[#d1d5db] hover:text-white transition-colors cursor-pointer"
          >
            Book a Demo
          </button>
          <Link
            href="/login"
            className="text-xs font-semibold text-[#d1d5db] hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/onboarding"
            className="h-9 px-5 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-bold text-xs rounded-full flex items-center gap-1.5 transition-all shadow-md shadow-[#00b2ea]/20 cursor-pointer hover:scale-[1.02]"
          >
            SIGN UP FREE
          </Link>
        </div>
      </header>

      {/* Book a Demo Instant Modal */}
      <BookDemoModal
        isOpen={isBookDemoOpen}
        onClose={() => setIsBookDemoOpen(false)}
      />
    </>
  );
}
