"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Gift, Settings, HelpCircle, Star, LogOut, ChevronDown } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { DEMO_USER } from "@/lib/constants";

interface TopBarProps {
  isPublic?: boolean;
  onSearchFocus?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function TopBar({
  isPublic = false,
  onSearchFocus,
  searchQuery = "",
  onSearchChange,
}: TopBarProps) {
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showReferModal, setShowReferModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  if (isPublic) {
    return (
      <header className="h-14 border-b border-[#26282d] bg-[#111214] px-6 flex items-center justify-between select-none z-30">
        <div className="flex items-center gap-4">
          <Logo href="/" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e8b923]/40 bg-[#e8b923]/10 text-xs text-[#e8b923] font-medium">
            <span>Get your own free AI Notetaker</span>
            <span>🔥</span>
          </div>
        </div>
        <div>
          <Link
            href="/login"
            className="px-4 py-1.5 text-sm font-semibold text-white hover:text-[#00b2ea] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="h-14 border-b border-[#26282d] bg-[#111214] px-5 flex items-center justify-between select-none relative z-30">
      {/* Left: Logo + Search */}
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        <Logo href="/home" />

        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#9a9ba1] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Call Recordings..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onFocus={onSearchFocus}
            className="w-full h-9 pl-9 pr-8 bg-[#1e2024] hover:bg-[#25282e] focus:bg-[#25282e] border border-[#2f3238] focus:border-[#00b2ea] rounded-full text-xs text-white placeholder-[#9a9ba1] outline-none transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#9a9ba1] bg-[#2a2c32] px-1.5 py-0.5 rounded border border-[#3a3d45]">
            /
          </span>
        </div>
      </div>

      {/* Right: Actions & User */}
      <div className="flex items-center gap-5 text-xs text-[#9a9ba1]">
        <button
          onClick={() => setShowReferModal(true)}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          <Gift className="w-4 h-4 text-[#9a9ba1]" />
          <span>Refer</span>
        </button>

        <Link
          href="/settings"
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <Settings className="w-4 h-4 text-[#9a9ba1]" />
          <span>Settings</span>
        </Link>

        <button
          onClick={() => setShowHelpModal(true)}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-[#9a9ba1]" />
          <span>Help & Feedback</span>
        </button>

        {/* Gold Points Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#242116] border border-[#e8b923]/40 text-[#e8b923] font-semibold text-xs">
          <Star className="w-3.5 h-3.5 fill-[#e8b923]" />
          <span>{DEMO_USER.points}</span>
        </div>

        {/* User Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
            className="w-8 h-8 rounded-full bg-[#00b2ea] text-white font-bold text-xs flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#00b2ea]/50 transition-all"
            title={DEMO_USER.name}
          >
            {DEMO_USER.avatar}
          </button>

          {showAvatarMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1e2024] border border-[#2f3238] rounded-lg shadow-2xl py-1 z-50 text-xs text-white">
              <div className="px-3 py-2 border-b border-[#2f3238]">
                <p className="font-semibold text-white">{DEMO_USER.name}</p>
                <p className="text-[11px] text-[#9a9ba1] truncate">{DEMO_USER.email}</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setShowAvatarMenu(false)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[#2a2c32] transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-[#9a9ba1]" />
                <span>Settings</span>
              </Link>
              <Link
                href="/login"
                onClick={() => setShowAvatarMenu(false)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[#2a2c32] text-[#ff4d4f] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Refer Modal */}
      {showReferModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e2024] border border-[#2f3238] rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-[#e8b923] mb-2 font-semibold">
              <Gift className="w-5 h-5" />
              <span>Refer & Earn Points</span>
            </div>
            <p className="text-xs text-[#9a9ba1] mb-4 leading-relaxed">
              Share Fathom with teammates. When they record their first call, you both earn 25 points!
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value="https://fathom.video/invite/demo-alex"
                className="flex-1 bg-[#161719] border border-[#2f3238] rounded px-3 py-1.5 text-xs text-white"
              />
              <button
                onClick={() => setShowReferModal(false)}
                className="px-3 py-1.5 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-semibold text-xs rounded transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e2024] border border-[#2f3238] rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-white mb-2 font-semibold text-sm">
              <HelpCircle className="w-5 h-5 text-[#00b2ea]" />
              <span>Help & Feedback</span>
            </div>
            <p className="text-xs text-[#9a9ba1] mb-4 leading-relaxed">
              Have questions or feedback about Fathom? Check our guides or reach out to support.
            </p>
            <div className="space-y-2 text-xs">
              <a
                href="#tutorial"
                onClick={(e) => { e.preventDefault(); setShowHelpModal(false); }}
                className="block p-2 rounded bg-[#161719] hover:bg-[#25282e] text-white transition-colors"
              >
                📖 Getting Started Tutorial (1 min)
              </a>
              <a
                href="#feedback"
                onClick={(e) => { e.preventDefault(); setShowHelpModal(false); }}
                className="block p-2 rounded bg-[#161719] hover:bg-[#25282e] text-white transition-colors"
              >
                💬 Send Product Feedback
              </a>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-4 w-full py-1.5 bg-[#2a2c32] hover:bg-[#34373e] text-white font-medium text-xs rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
