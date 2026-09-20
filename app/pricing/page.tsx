"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Logo, FathomSwoosh } from "@/components/brand/Logo";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      badge: "Free Forever",
      priceAnnual: "$0",
      priceMonthly: "$0",
      cadence: "forever",
      description: "Unlimited recordings, instant call summaries, integrations with LLMs & more.",
      ctaText: "Sign Up. Free Forever.",
      ctaHref: "/demo",
      primary: false,
      features: [
        "Unlimited meetings captured & instant AI summaries",
        "AI generated action items",
        "Conversational meeting assistant",
        "Playlists of highlights from meetings",
        "Choice of bot-free or bot capture",
        "Clips, playlists + search across calls",
        "Integration with Zoom, Google Meet & Microsoft Teams",
      ],
    },
    {
      id: "team",
      name: "Team",
      badge: "Most Popular",
      priceAnnual: "$19",
      priceMonthly: "$24",
      cadence: "per user / month",
      description: "Everything in Free plus shared visibility, team folders, and keyword alerts.",
      ctaText: "Start Free Team Trial",
      ctaHref: "/demo",
      primary: true,
      features: [
        "Everything from Free",
        "Team recordings view & shared repository",
        "Global search across all team calls",
        "Team folders & permissions",
        "Comments & @mentions on transcripts",
        "Keyword alerts for competitors & customer pain points",
        "Team playlists of clips & highlights",
        "Slack integration for automated call recap sharing",
      ],
    },
    {
      id: "business",
      name: "Business",
      badge: "For Revenue Teams",
      priceAnnual: "$29",
      priceMonthly: "$39",
      cadence: "per user / month",
      description: "For sales and CS teams needing CRM sync, Deal View, coaching metrics, and custom AI templates.",
      ctaText: "Start Free Business Trial",
      ctaHref: "/demo",
      primary: false,
      features: [
        "Everything from Team",
        "CRM field sync (Salesforce, HubSpot, Close)",
        "Deal View summarizing deal health & pipeline insights",
        "Coaching metrics & AI scorecards",
        "Advanced & custom call summaries",
        "Custom meeting bot name & branding",
        "AI search alerts for leadership",
        "Customer View aggregated account timeline",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      badge: "Custom Scale",
      priceAnnual: "Custom",
      priceMonthly: "Custom",
      cadence: "tailored to your org",
      description: "Organization-wide security controls, SSO, SCIM, custom data retention, and dedicated SLAs.",
      ctaText: "Contact Sales",
      ctaHref: "https://fathomvideo.typeform.com/to/AYeoqHBS",
      primary: false,
      features: [
        "Everything from Business",
        "Launch Assist Onboarding Program",
        "Organization-wide security controls",
        "Single sign-on (SSO) & Okta SCIM provisioning",
        "Custom data retention policies",
        "Dedicated Customer Success Manager & priority SLAs",
        "HIPAA compliance with signed BAA",
        "Increased cybersecurity insurance coverage & custom contracts",
      ],
    },
  ];

  const comparisonCategories = [
    {
      name: "Capturing & Managing Content",
      features: [
        {
          name: "Choice of bot-free and bot capture",
          free: true,
          team: true,
          business: true,
          enterprise: true,
          note: "Bot-free available for Zoom, Meet, Teams",
        },
        {
          name: "Recordings & call storage",
          free: "Unlimited",
          team: "Unlimited",
          business: "Unlimited",
          enterprise: "Unlimited",
        },
        {
          name: "Transcription length",
          free: "Unlimited",
          team: "Unlimited",
          business: "Unlimited",
          enterprise: "Unlimited",
        },
        {
          name: "Call downloads and clips",
          free: "Unlimited",
          team: "Unlimited",
          business: "Unlimited",
          enterprise: "Unlimited",
        },
        {
          name: "Playlists of clips & highlights",
          free: "Personal",
          team: "Team-wide",
          business: "Team-wide",
          enterprise: "Team-wide",
        },
      ],
    },
    {
      name: "Insights & Intelligence",
      features: [
        {
          name: "Automated summaries",
          free: true,
          team: true,
          business: true,
          enterprise: true,
        },
        {
          name: "AI-generated action items",
          free: true,
          team: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Ask Fathom: AI within a single call",
          free: true,
          team: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Account-wide Ask Fathom across all calls",
          free: "My Calls",
          team: "Full Team",
          business: "Full Team",
          enterprise: "Full Team",
        },
        {
          name: "Custom summaries & prompt templates",
          free: false,
          team: false,
          business: true,
          enterprise: true,
        },
        {
          name: "Coaching metrics & AI scorecards",
          free: false,
          team: false,
          business: true,
          enterprise: true,
        },
      ],
    },
    {
      name: "Team Workspace & Collaboration",
      features: [
        {
          name: "Team recordings view & shared repository",
          free: false,
          team: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Team folders & permissions",
          free: false,
          team: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Comments & @mentions on transcripts",
          free: false,
          team: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Keyword & competitor alerts",
          free: false,
          team: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Deal View & pipeline intelligence",
          free: false,
          team: false,
          business: true,
          enterprise: true,
        },
      ],
    },
    {
      name: "Admin, Integrations & Security",
      features: [
        {
          name: "Claude & ChatGPT integrations",
          free: true,
          team: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Zapier, Make & webhook automation",
          free: true,
          team: true,
          business: true,
          enterprise: true,
        },
        {
          name: "Public API & MCP support",
          free: true,
          team: true,
          business: true,
          enterprise: true,
        },
        {
          name: "CRM auto-sync (Salesforce, HubSpot)",
          free: "Basic (3 users)",
          team: "Full Sync",
          business: "Field-level Sync",
          enterprise: "Field-level Sync",
        },
        {
          name: "Single Sign-On (SSO) & SCIM",
          free: false,
          team: false,
          business: false,
          enterprise: true,
        },
        {
          name: "HIPAA compliance with signed BAA",
          free: false,
          team: false,
          business: false,
          enterprise: true,
        },
      ],
    },
  ];

  const faqs = [
    {
      q: "Is Fathom really free forever?",
      a: "Yes! Fathom's Free plan has no time limits, no trial expiration, and no recording caps. You get unlimited recordings, instant AI summaries, transcription, clips, and conversational Ask Fathom for yourself.",
    },
    {
      q: "What is the difference between Bot and Bot-Free capture?",
      a: "Fathom supports both! Traditional bot capture invites a visible Fathom bot to your Zoom, Google Meet, or Microsoft Teams meeting. Bot-free capture (available for Mac and browser) captures audio and video directly without requiring an external participant in the call.",
    },
    {
      q: "Can I use Fathom with my existing CRM?",
      a: "Yes! Fathom integrates seamlessly with HubSpot, Salesforce, and Close. On our Team and Business plans, Fathom automatically creates contacts, logs meeting summaries, and updates custom deal fields after every call.",
    },
    {
      q: "Is Fathom SOC 2 and HIPAA compliant?",
      a: "Yes. Fathom is SOC 2 Type II certified, GDPR compliant, and provides HIPAA compliance with signed Business Associate Agreements (BAAs) on Enterprise plans. Your data is encrypted at rest and in transit.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0e12] text-white flex flex-col selection:bg-[#00b2ea]/30 selection:text-white">
      {/* Top Banner */}
      <div className="bg-[#ffffff] text-[#111214] text-xs font-semibold py-2 px-4 flex items-center justify-between z-40">
        <div className="flex-1 text-center flex items-center justify-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#111214] text-white font-black text-[11px]">
            ✦
          </span>
          <span>FATHOM IS NOW PART OF SUPERHUMAN.</span>
          <a
            href="https://fathom.video"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-[#00b2ea] transition-colors ml-1 font-bold inline-flex items-center gap-1"
          >
            LEARN MORE <ArrowRight className="w-3 h-3 inline" />
          </a>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="h-16 border-b border-[#26282d]/60 px-6 lg:px-12 flex items-center justify-between sticky top-0 bg-[#0d0e12]/90 backdrop-blur-md z-30">
        <div className="flex items-center gap-8">
          <Logo href="/" size="lg" />
          <nav className="hidden lg:flex items-center gap-1 bg-[#1a1c22] border border-[#2e313b] rounded-full px-4 py-1.5 text-xs text-[#9a9ba1] font-medium">
            <Link href="/" className="px-3 py-1 hover:text-white transition-colors">
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
            <Link href="/pricing" className="px-3 py-1 text-[#00b2ea] font-semibold">
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
            className="h-9 px-5 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-bold text-xs rounded-full flex items-center gap-1.5 transition-all shadow-md shadow-[#00b2ea]/20"
          >
            SIGN UP FREE
          </Link>
        </div>
      </header>

      {/* Main Pricing Hero */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 lg:py-20 flex flex-col items-center">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00b2ea]/30 bg-[#00b2ea]/10 text-xs text-[#00b2ea] font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
            Meet your brilliant <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e2e8f0] to-[#00b2ea]">
              AI meeting partner
            </span>
          </h1>
          <p className="text-base text-[#9a9ba1] max-w-xl mx-auto">
            Choose the perfect plan for individuals, growing teams, or enterprise revenue organizations.
          </p>

          {/* Billing Cycle Switch */}
          <div className="mt-8 inline-flex items-center p-1 rounded-full bg-[#181a20] border border-[#2b2e38]">
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === "annual"
                  ? "bg-[#00b2ea] text-black shadow-md"
                  : "text-[#9a9ba1] hover:text-white"
              }`}
            >
              Annual (Save 20%)
            </button>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[#00b2ea] text-black shadow-md"
                  : "text-[#9a9ba1] hover:text-white"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {plans.map((plan) => {
            const price = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-200 ${
                  plan.primary
                    ? "bg-[#16181f] border-2 border-[#00b2ea] shadow-xl shadow-[#00b2ea]/15 -translate-y-1"
                    : "bg-[#131418] border border-[#252830] hover:border-[#3a3e4b]"
                }`}
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      plan.primary
                        ? "bg-[#00b2ea] text-black"
                        : "bg-[#20222a] text-[#9a9ba1] border border-[#313542]"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>

                {/* Plan Name & Desc */}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-[#9a9ba1] min-h-[36px] mb-6 leading-relaxed">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-[#252830]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white tracking-tight">{price}</span>
                    {price !== "$0" && price !== "Custom" && (
                      <span className="text-xs text-[#9a9ba1]">/ user</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#6e717b] mt-1 font-medium">{plan.cadence}</p>
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.ctaHref}
                  className={`w-full h-11 rounded-full font-bold text-xs flex items-center justify-center gap-2 mb-8 transition-all cursor-pointer ${
                    plan.primary
                      ? "bg-[#00b2ea] hover:bg-[#00c5ff] text-black shadow-lg shadow-[#00b2ea]/25"
                      : "bg-[#1f222a] hover:bg-[#2b2f3a] text-white border border-[#313542]"
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {/* Features List */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#6e717b]">
                    What&apos;s included:
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#d1d5db] leading-snug">
                        <Check className="w-4 h-4 text-[#00b2ea] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table Section */}
        <section className="w-full max-w-6xl mx-auto mb-28">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">Compare All Plan Features</h2>
            <p className="text-xs text-[#9a9ba1]">
              Every feature, limit, and enterprise governance control detailed side-by-side.
            </p>
          </div>

          <div className="border border-[#252830] rounded-2xl overflow-hidden bg-[#131418]">
            {/* Table Header */}
            <div className="grid grid-cols-5 p-5 border-b border-[#252830] bg-[#181a20] text-xs font-bold text-white sticky top-16 z-20">
              <div className="col-span-1 text-[#9a9ba1] uppercase tracking-wider text-[11px]">Feature</div>
              <div className="text-center">Free</div>
              <div className="text-center text-[#00b2ea]">Team</div>
              <div className="text-center">Business</div>
              <div className="text-center">Enterprise</div>
            </div>

            {/* Categories & Rows */}
            {comparisonCategories.map((cat, catIdx) => (
              <div key={catIdx} className="border-b border-[#252830] last:border-b-0">
                <div className="px-5 py-3 bg-[#16181f] text-[11px] font-bold uppercase tracking-wider text-[#00b2ea]">
                  {cat.name}
                </div>
                {cat.features.map((feat, featIdx) => (
                  <div
                    key={featIdx}
                    className="grid grid-cols-5 p-4 border-t border-[#202228] text-xs items-center hover:bg-[#181a22] transition-colors"
                  >
                    <div className="col-span-1 pr-4">
                      <p className="font-medium text-white">{feat.name}</p>
                      {"note" in feat && (
                        <p className="text-[10px] text-[#6e717b] mt-0.5">{feat.note}</p>
                      )}
                    </div>

                    {/* Free */}
                    <div className="text-center flex justify-center text-[#d1d5db]">
                      {typeof feat.free === "boolean" ? (
                        feat.free ? (
                          <Check className="w-4 h-4 text-[#00b2ea]" />
                        ) : (
                          <span className="text-[#4b5160]">—</span>
                        )
                      ) : (
                        <span className="font-semibold text-[11px]">{feat.free}</span>
                      )}
                    </div>

                    {/* Team */}
                    <div className="text-center flex justify-center text-[#00b2ea]">
                      {typeof feat.team === "boolean" ? (
                        feat.team ? (
                          <Check className="w-4 h-4 text-[#00b2ea]" />
                        ) : (
                          <span className="text-[#4b5160]">—</span>
                        )
                      ) : (
                        <span className="font-semibold text-[11px]">{feat.team}</span>
                      )}
                    </div>

                    {/* Business */}
                    <div className="text-center flex justify-center text-[#d1d5db]">
                      {typeof feat.business === "boolean" ? (
                        feat.business ? (
                          <Check className="w-4 h-4 text-[#00b2ea]" />
                        ) : (
                          <span className="text-[#4b5160]">—</span>
                        )
                      ) : (
                        <span className="font-semibold text-[11px]">{feat.business}</span>
                      )}
                    </div>

                    {/* Enterprise */}
                    <div className="text-center flex justify-center text-[#d1d5db]">
                      {typeof feat.enterprise === "boolean" ? (
                        feat.enterprise ? (
                          <Check className="w-4 h-4 text-[#00b2ea]" />
                        ) : (
                          <span className="text-[#4b5160]">—</span>
                        )
                      ) : (
                        <span className="font-semibold text-[11px]">{feat.enterprise}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="w-full max-w-4xl mx-auto mb-28">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white mb-2">Frequently Asked Questions</h2>
            <p className="text-xs text-[#9a9ba1]">
              Everything you need to know about Fathom pricing and plans.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#252830] bg-[#131418] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-[#00b2ea] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#9a9ba1] transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#00b2ea]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-[#9a9ba1] leading-relaxed border-t border-[#202228]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="w-full max-w-5xl rounded-3xl bg-gradient-to-br from-[#161820] via-[#1a1d26] to-[#0f1117] border border-[#2c303c] p-10 md:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#00b2ea]/15 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Never miss what matters on a call again.
          </h2>
          <p className="text-sm text-[#9a9ba1] max-w-xl mx-auto mb-8">
            Join over 300,000 companies saving 6+ hours every week with Fathom&apos;s AI meeting assistant.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="h-12 px-8 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-bold text-sm rounded-full flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#00b2ea]/25 cursor-pointer"
            >
              <span>Get Started. It&apos;s Free.</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://fathomvideo.typeform.com/to/AYeoqHBS"
              target="_blank"
              rel="noreferrer"
              className="h-12 px-8 bg-[#20222a] hover:bg-[#2b2f3a] border border-[#353947] text-white font-semibold text-xs rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              Talk to Sales
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#26282d]/80 bg-[#090a0d] py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#9a9ba1]">
          <div className="flex items-center gap-3">
            <FathomSwoosh className="w-5 h-5" />
            <span className="font-semibold text-white">Fathom © 2026</span>
            <span className="text-[#4b5160]">•</span>
            <span>All Rights Reserved</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">
              Overview
            </Link>
            <Link href="/pricing" className="text-[#00b2ea] hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/demo" className="hover:text-white transition-colors">
              Demo
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <a
              href="https://fathom.video"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors inline-flex items-center gap-1"
            >
              Live Fathom <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
