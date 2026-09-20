"use client";

import React, { useState } from "react";
import { Link2, Copy, Check, X, Eye, FileText, List, Video } from "lucide-react";

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
  shareToken = "xMwPV7XSwvNge4Fh-3BXRWGoz_QSykHx",
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareEnabled, setShareEnabled] = useState(true);
  const [parts, setParts] = useState({
    summary: true,
    transcript: true,
    recording: true,
  });

  if (!isOpen) return null;

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/share/${shareToken}`
    : `https://fathom.video/share/${shareToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-[#1e2024] border border-[#2f3238] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Link2 className="w-4 h-4 text-[#00b2ea]" />
            <span>Share Call Recording & Summary</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#2a2c32] text-[#9a9ba1] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Share Link Row */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-[#9a9ba1] uppercase tracking-wider">
            Public Share Link
          </label>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 h-9 px-3 bg-[#161719] border border-[#2f3238] rounded-lg text-xs text-[#d1d5db] font-mono outline-none select-all"
            />
            <button
              onClick={handleCopy}
              className="h-9 px-3.5 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Access Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#161719] border border-[#26282d]">
          <div className="flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-[#00b2ea]" />
            <div>
              <p className="text-xs font-semibold text-white">Anyone with the link can view</p>
              <p className="text-[11px] text-[#9a9ba1]">No sign in required to watch</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={shareEnabled}
            onChange={(e) => setShareEnabled(e.target.checked)}
            className="w-4 h-4 accent-[#00b2ea] rounded cursor-pointer"
          />
        </div>

        {/* Shared Parts Options */}
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-semibold text-[#9a9ba1] uppercase tracking-wider">
            Included in this share:
          </p>

          <div className="space-y-2">
            <label className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#25282e] transition-colors cursor-pointer text-xs">
              <div className="flex items-center gap-2 text-white">
                <FileText className="w-3.5 h-3.5 text-[#00b2ea]" />
                <span>AI Meeting Summary</span>
              </div>
              <input
                type="checkbox"
                checked={parts.summary}
                onChange={(e) => setParts({ ...parts, summary: e.target.checked })}
                className="w-4 h-4 accent-[#00b2ea] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#25282e] transition-colors cursor-pointer text-xs">
              <div className="flex items-center gap-2 text-white">
                <List className="w-3.5 h-3.5 text-[#00b2ea]" />
                <span>Full Timestamped Transcript</span>
              </div>
              <input
                type="checkbox"
                checked={parts.transcript}
                onChange={(e) => setParts({ ...parts, transcript: e.target.checked })}
                className="w-4 h-4 accent-[#00b2ea] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#25282e] transition-colors cursor-pointer text-xs">
              <div className="flex items-center gap-2 text-white">
                <Video className="w-3.5 h-3.5 text-[#00b2ea]" />
                <span>Audio Playback & Speaker Stage</span>
              </div>
              <input
                type="checkbox"
                checked={parts.recording}
                onChange={(e) => setParts({ ...parts, recording: e.target.checked })}
                className="w-4 h-4 accent-[#00b2ea] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full py-2 bg-[#2a2c32] hover:bg-[#32363f] text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}
