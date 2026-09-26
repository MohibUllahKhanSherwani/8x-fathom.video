"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");

  return (
    <div className="min-h-screen bg-[#1C1E22] text-[#EDEBE6] font-sans antialiased selection:bg-[#C98A3E]/30 selection:text-[#EDEBE6]">
      {/* Header */}
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
              Pricing &amp; Plans
            </span>
          </div>

          <nav className="flex items-center gap-5 text-[12px] font-mono">
            <Link href="/home" className="text-[#8E929B] hover:text-[#EDEBE6] transition-colors">
              Workspace
            </Link>
            <Link href="/settings" className="text-[#8E929B] hover:text-[#EDEBE6] transition-colors">
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12 text-left">
        {/* Title */}
        <div className="space-y-3 max-w-2xl border-b border-[#282B31] pb-8">
          <h1 className="font-serif-heading text-[32px] sm:text-[36px] font-medium text-[#EDEBE6] leading-tight">
            Transparent pricing for individual focus and team clarity.
          </h1>
          <p className="text-[14px] text-[#8E929B] leading-relaxed">
            Unlimited recording remains free for individuals. Upgrade to Pro for cross-meeting
            intelligence, team sharing, and compliance governance.
          </p>

          {/* Billing Switcher */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => setBillingCycle("annual")}
              className={`font-mono text-[11px] px-3 py-1.5 rounded-[4px] border transition-colors cursor-pointer ${
                billingCycle === "annual"
                  ? "bg-[#22252B] border-[#EDEBE6] text-[#EDEBE6] font-semibold"
                  : "border-transparent text-[#8E929B] hover:text-[#EDEBE6]"
              }`}
            >
              Annual Billing (Save 20%)
            </button>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`font-mono text-[11px] px-3 py-1.5 rounded-[4px] border transition-colors cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[#22252B] border-[#EDEBE6] text-[#EDEBE6] font-semibold"
                  : "border-transparent text-[#8E929B] hover:text-[#EDEBE6]"
              }`}
            >
              Monthly Billing
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Free Tier */}
          <div className="border border-[#282B31] rounded-[4px] bg-[#17191C] p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E929B] block">
                  Individual Tier
                </span>
                <h2 className="font-serif-heading text-[22px] font-medium text-[#EDEBE6] mt-1">
                  Free Forever
                </h2>
                <div className="font-mono text-[28px] font-semibold text-[#EDEBE6] mt-2">
                  $0
                </div>
                <div className="text-[11px] font-mono text-[#8E929B]">No credit card required</div>
              </div>

              <p className="text-[13px] text-[#8E929B] leading-relaxed border-t border-[#282B31] pt-3">
                Full meeting transcription, verifiable timestamp links, and automated action item extraction.
              </p>

              <ul className="space-y-2 text-[13px] text-[#EDEBE6]">
                {[
                  "Unlimited Zoom, Meet & Teams calls",
                  "Synchronized verbatim transcripts",
                  "Clickable timestamp jump chips",
                  "Automated action item detection",
                  "Export to Markdown & Slack",
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#8E929B] flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/demo"
              className="w-full text-center py-2.5 rounded-[4px] border border-[#282B31] hover:border-[#EDEBE6] bg-[#141619] hover:bg-[#22252B] text-[#EDEBE6] text-[13px] font-medium transition-colors block"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier (Singular CTA in Amber) */}
          <div className="border-2 border-[#C98A3E] rounded-[4px] bg-[#1C1E22] p-6 flex flex-col justify-between space-y-6 relative">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#C98A3E] block">
                    Team Intelligence
                  </span>
                  <h2 className="font-serif-heading text-[22px] font-medium text-[#EDEBE6] mt-1">
                    Pro Plan
                  </h2>
                  <div className="font-mono text-[28px] font-semibold text-[#EDEBE6] mt-2">
                    {billingCycle === "annual" ? "$19" : "$24"}
                    <span className="text-[12px] font-normal text-[#8E929B] ml-1.5">
                      / user / month
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#8E929B]">
                    {billingCycle === "annual" ? "Billed annually" : "Billed monthly"}
                  </div>
                </div>

                <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-[#25221B] border border-[#C98A3E] text-[#C98A3E]">
                  Recommended
                </span>
              </div>

              <p className="text-[13px] text-[#8E929B] leading-relaxed border-t border-[#282B31] pt-3">
                Cross-meeting intelligence query bar, centralized transcript search index, and enterprise governance.
              </p>

              <ul className="space-y-2 text-[13px] text-[#EDEBE6]">
                {[
                  "Everything in Free, plus:",
                  "Ask Fathom cross-meeting neural query",
                  "4 switchable executive summary templates",
                  "PostgreSQL Full-Text Search across all calls",
                  "Recording consent governance & chat notice",
                  "SOC 2 Type II audit compliance ready",
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#C98A3E] flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The single primary CTA button in amber */}
            <Link
              href="/demo"
              className="w-full text-center py-2.5 rounded-[4px] bg-[#C98A3E] hover:bg-[#d8974a] text-[#1C1E22] text-[13px] font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>Start Free Team Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Enterprise Governance Note */}
        <div className="border border-[#282B31] rounded-[4px] bg-[#17191C] p-5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[13px] font-medium text-[#EDEBE6] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8E929B]" />
              <span>Enterprise Compliance &amp; Custom SSO</span>
            </div>
            <p className="text-[12px] text-[#8E929B]">
              Need custom data retention, dedicated VPC deployment, or SAML SSO?
            </p>
          </div>
          <Link
            href="/demo"
            className="font-mono text-[11px] px-3 py-1.5 rounded-[4px] border border-[#282B31] hover:border-[#EDEBE6] text-[#EDEBE6] transition-colors whitespace-nowrap"
          >
            Contact Sales
          </Link>
        </div>
      </main>
    </div>
  );
}
