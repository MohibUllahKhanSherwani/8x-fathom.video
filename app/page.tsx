import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export default function RootLandingPage() {
  return (
    <div className="min-h-screen bg-[#111214] text-white flex flex-col select-none">
      {/* Top Navigation */}
      <header className="h-16 border-b border-[#26282d] px-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-8">
          <Logo href="/" size="lg" />
          <nav className="hidden md:flex items-center gap-6 text-xs text-[#9a9ba1]">
            <span className="hover:text-white transition-colors cursor-pointer">Overview</span>
            <span className="hover:text-white transition-colors cursor-pointer">Solutions</span>
            <span className="hover:text-white transition-colors cursor-pointer">Integrations</span>
            <span className="hover:text-white transition-colors cursor-pointer">Pricing</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-[#9a9ba1] hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/demo"
            className="h-9 px-4 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-semibold text-xs rounded-full flex items-center gap-1.5 transition-all shadow-md shadow-[#00b2ea]/20 cursor-pointer"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00b2ea]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#00b2ea]/30 bg-[#00b2ea]/10 text-xs text-[#00b2ea] font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fathom Clone (8x Assignment)</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Meeting intelligence <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#00b2ea]">
              built around you.
            </span>
          </h1>

          <p className="text-sm md:text-base text-[#9a9ba1] max-w-xl mx-auto mb-8 leading-relaxed">
            Never take notes again. Fathom records, transcribes, summarizes, and answers questions about your calls with instant citation-backed intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="w-full sm:w-auto h-11 px-7 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-bold text-sm rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00b2ea]/25"
            >
              <span>Continue as Demo User</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto h-11 px-6 bg-[#1e2024] hover:bg-[#26292f] border border-[#2f3238] text-white font-medium text-xs rounded-full flex items-center justify-center transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-14 pt-8 border-t border-[#26282d]/60 flex flex-wrap items-center justify-center gap-6 text-xs text-[#9a9ba1]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3dbb6b]" />
              <span>SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3dbb6b]" />
              <span>GDPR & HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3dbb6b]" />
              <span>Used by 300,000+ companies</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
