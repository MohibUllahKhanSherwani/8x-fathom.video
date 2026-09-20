"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Building,
  Mail,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookDemoModal({ isOpen, onClose }: BookDemoModalProps) {
  const [email, setEmail] = useState("");
  const [teamSize, setTeamSize] = useState("11-50");
  const [useCase, setUseCase] = useState("Sales & Revenue");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#13151c] border border-[#2a2e3d] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="h-14 border-b border-[#252834] px-6 flex items-center justify-between bg-[#0f1015]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00b2ea]/15 border border-[#00b2ea]/30 flex items-center justify-center text-[#00b2ea]">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white">Book a Live Fathom Demo</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#9a9ba1] hover:text-white p-1 rounded-lg hover:bg-[#1e212b] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <p className="text-xs text-[#9a9ba1] leading-relaxed">
                See how Fathom automates meeting summaries, syncs CRM fields, and gives your team shared intelligence.
              </p>
            </div>

            {/* Work Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#00b2ea]" />
                <span>Work Email</span>
              </label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#181a24] border border-[#2c303f] text-xs text-white placeholder-[#6e717b] outline-none focus:border-[#00b2ea] transition-colors"
              />
            </div>

            {/* Team Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#00b2ea]" />
                <span>Team Size</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["1-10", "11-50", "51-200", "200+"].map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setTeamSize(size)}
                    className={`h-9 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      teamSize === size
                        ? "bg-[#00b2ea]/15 border-[#00b2ea] text-[#00b2ea]"
                        : "bg-[#181a24] border-[#2c303f] text-[#9a9ba1] hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Use Case */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#00b2ea]" />
                <span>Primary Focus</span>
              </label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#181a24] border border-[#2c303f] text-xs text-white outline-none cursor-pointer"
              >
                <option value="Sales & Revenue">Sales & Revenue (CRM sync, Deal View)</option>
                <option value="Customer Success">Customer Success (Handovers, retention)</option>
                <option value="Product & Engineering">Product & Engineering (Standups, roadmaps)</option>
                <option value="Executive & Founders">Executive & Founders (1-on-1s, board meetings)</option>
              </select>
            </div>

            {/* Submit & Instant Demo Buttons */}
            <div className="pt-3 space-y-2.5">
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#00b2ea]/20"
              >
                <span>Schedule Live Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-[#252834] w-full" />
                <span className="bg-[#13151c] px-3 text-[11px] text-[#6e717b] uppercase tracking-wider font-semibold">
                  or
                </span>
              </div>

              <Link
                href="/demo"
                onClick={onClose}
                className="w-full h-11 rounded-xl bg-[#1c1f2a] hover:bg-[#252836] border border-[#2f3342] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00b2ea]" />
                <span>Explore Interactive Demo Workspace Now</span>
              </Link>
            </div>

            <div className="pt-1 flex items-center justify-center gap-2 text-[11px] text-[#6e717b]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3dbb6b]" />
              <span>No credit card required • Instant access</span>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-[#3dbb6b]/15 border border-[#3dbb6b]/30 flex items-center justify-center text-[#3dbb6b] mx-auto text-xl shadow-xl">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-1">Demo Request Received!</h3>
              <p className="text-xs text-[#9a9ba1] max-w-sm mx-auto leading-relaxed">
                We sent a calendar invite to <strong className="text-white">{email}</strong>. Our product specialist will walk through Fathom tailored to your {teamSize} person team.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#181a24] border border-[#2c303f] text-left text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[#00b2ea] font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Ready to explore right now?</span>
              </div>
              <p className="text-[#9a9ba1] text-[11px]">
                You can jump straight into the full demo workspace with pre-populated calls, audio sync, and AI summaries.
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-10 rounded-xl bg-[#1e2029] hover:bg-[#282c39] text-xs font-semibold text-[#9a9ba1] hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
              <Link
                href="/demo"
                onClick={onClose}
                className="flex-1 h-10 rounded-xl bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <span>Open Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
