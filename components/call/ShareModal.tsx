"use client";

import React, { useState } from "react";
import { Link2, Copy, Check, X, Eye, FileText, List, Video, ShieldCheck } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
  shareToken?: string;
}

export function ShareModal({
  isOpen,
  onClose,
  meetingId,
  shareToken,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareEnabled, setShareEnabled] = useState(true);
  const [parts, setParts] = useState({
    summary: true,
    transcript: true,
    recording: true,
  });

  if (!isOpen) return null;

  const effectiveToken = shareToken || meetingId;
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/share/${effectiveToken}`
    : `https://fathom.video/share/${effectiveToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-[#121622] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-white font-bold text-sm">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Link2 className="w-4 h-4" />
            </div>
            <span>Share Meeting Intelligence</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Share Link Row */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Public Share Link
          </label>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 h-10 px-3.5 bg-[#0d101a] border border-white/8 rounded-xl text-xs text-slate-300 font-mono outline-none select-all"
            />
            <button
              onClick={handleCopy}
              className="h-10 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Link"}</span>
            </button>
          </div>
        </div>

        {/* Access Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/2 border border-white/6">
          <div className="flex items-center gap-3">
            <Eye className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-xs font-semibold text-white">Publicly accessible</p>
              <p className="text-[11px] text-slate-400">Reviewers can view without authentication</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={shareEnabled}
            onChange={(e) => setShareEnabled(e.target.checked)}
            className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
          />
        </div>

        {/* Shared Parts Options */}
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Included components:
          </p>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/2 border border-white/4 cursor-pointer hover:bg-white/4 transition-colors">
              <span className="flex items-center gap-2 text-slate-200">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Executive Summary & Takeaways</span>
              </span>
              <input
                type="checkbox"
                checked={parts.summary}
                onChange={(e) => setParts({ ...parts, summary: e.target.checked })}
                className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/2 border border-white/4 cursor-pointer hover:bg-white/4 transition-colors">
              <span className="flex items-center gap-2 text-slate-200">
                <List className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interactive Transcript</span>
              </span>
              <input
                type="checkbox"
                checked={parts.transcript}
                onChange={(e) => setParts({ ...parts, transcript: e.target.checked })}
                className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/2 border border-white/4 cursor-pointer hover:bg-white/4 transition-colors">
              <span className="flex items-center gap-2 text-slate-200">
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span>Audio Playback & Speaker Stage</span>
              </span>
              <input
                type="checkbox"
                checked={parts.recording}
                onChange={(e) => setParts({ ...parts, recording: e.target.checked })}
                className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted & sandbox isolated</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
