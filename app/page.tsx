import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Play,
  FileText,
  Search,
  Share2,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import { Logo, FathomSwoosh } from "@/components/brand/Logo";

export default function RootLandingPage() {
  return (
    <div className="min-h-screen bg-[#111214] text-white flex flex-col select-none">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-[#26282d] px-6 lg:px-12 flex items-center justify-between sticky top-0 bg-[#111214]/90 backdrop-blur-md z-30">
        <div className="flex items-center gap-10">
          <Logo href="/" size="lg" />
          <nav className="hidden md:flex items-center gap-6 text-xs text-[#9a9ba1] font-medium">
            <span className="hover:text-white transition-colors cursor-pointer">Product</span>
            <span className="hover:text-white transition-colors cursor-pointer">Security</span>
            <span className="hover:text-white transition-colors cursor-pointer">Integrations</span>
            <span className="hover:text-white transition-colors cursor-pointer">Pricing</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-[#9a9ba1] hover:text-white transition-colors px-2 py-1"
          >
            Log In
          </Link>
          <Link
            href="/demo"
            className="h-9 px-4 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-semibold text-xs rounded-full flex items-center gap-1.5 transition-all shadow-md shadow-[#00b2ea]/20 cursor-pointer"
          >
            <span>Try Live Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center text-center px-6 py-16 lg:py-24 relative overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#00b2ea]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl relative z-10 mx-auto">
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00b2ea]/30 bg-[#00b2ea]/10 text-xs text-[#00b2ea] font-medium mb-8 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The #1 Rated AI Notetaker on G2</span>
            <span className="text-[#9a9ba1]">•</span>
            <span className="text-[#e8b923] flex items-center gap-0.5 font-bold">
              <Star className="w-3 h-3 fill-[#e8b923]" /> 4.9 / 5 (3,000+ reviews)
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Never take notes <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f0f4f8] to-[#00b2ea]">
              on a call again.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#9a9ba1] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Fathom records, transcribes, highlights, and summarizes your meetings with sub-second playback sync and citation-backed AI intelligence.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/demo"
              className="w-full sm:w-auto h-12 px-8 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-bold text-sm rounded-full flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#00b2ea]/25 cursor-pointer"
            >
              <span>Explore Demo Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/calls/829997322"
              className="w-full sm:w-auto h-12 px-6 bg-[#1e2024] hover:bg-[#26292f] border border-[#2f3238] hover:border-[#00b2ea]/50 text-white font-semibold text-xs rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Watch Star 8-Person Call</span>
            </Link>
          </div>

          {/* Trust Badges Bar */}
          <div className="mt-16 pt-10 border-t border-[#26282d]/80 flex flex-wrap items-center justify-center gap-8 text-xs text-[#9a9ba1]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3dbb6b]" />
              <span className="font-medium text-white">SOC 2 Type II Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3dbb6b]" />
              <span className="font-medium text-white">HIPAA & GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00b2ea]" />
              <span className="font-medium text-white">Works with Zoom, Meet & Teams</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <section className="max-w-6xl w-full mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left relative z-10">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-[#161719] border border-[#26282d] hover:border-[#00b2ea]/40 transition-all shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#00b2ea]/15 border border-[#00b2ea]/30 flex items-center justify-center text-[#00b2ea]">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Instant, Multi-Template Summaries</h3>
            <p className="text-xs text-[#9a9ba1] leading-relaxed">
              Switch between Enhanced, General, Sales, and 1-on-1 summary templates with automatically extracted action items and owners.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-[#161719] border border-[#26282d] hover:border-[#00b2ea]/40 transition-all shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8b923]/15 border border-[#e8b923]/30 flex items-center justify-center text-[#e8b923]">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Ask Fathom with Citations</h3>
            <p className="text-xs text-[#9a9ba1] leading-relaxed">
              Ask anything about a single call or across your entire meeting history. Every answer includes clickable timestamps that seek to the exact moment.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-[#161719] border border-[#26282d] hover:border-[#00b2ea]/40 transition-all shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#3dbb6b]/15 border border-[#3dbb6b]/30 flex items-center justify-center text-[#3dbb6b]">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Clips & Granular Sharing</h3>
            <p className="text-xs text-[#9a9ba1] leading-relaxed">
              Highlight spoken quotes and generate standalone clip links, or share full calls with customized permissions for summaries and recordings.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-16 border-t border-[#26282d] px-8 flex items-center justify-between text-xs text-[#9a9ba1]">
        <div className="flex items-center gap-3">
          <FathomSwoosh className="w-4 h-4" />
          <span>Fathom Clone • 8x Software Engineer Assignment</span>
        </div>
        <div className="flex items-center gap-6">
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
            className="hover:text-white transition-colors"
          >
            Live Fathom Reference
          </a>
        </div>
      </footer>
    </div>
  );
}

