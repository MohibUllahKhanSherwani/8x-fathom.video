import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Sign in to Fathom",
  description: "Sign in or explore Fathom as a demo user",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#1C1E22] text-[#EDEBE6] flex flex-col items-center justify-center p-6 antialiased selection:bg-[#C98A3E]/30 selection:text-[#EDEBE6]">
      {/* Login Box */}
      <div className="w-full max-w-sm border border-[#282B31] rounded-[4px] bg-[#17191C] p-8 space-y-6 text-left">
        <div className="space-y-2 border-b border-[#282B31] pb-4">
          <Link
            href="/"
            className="font-serif-heading text-[20px] font-medium tracking-tight text-[#EDEBE6] block"
          >
            Fathom
          </Link>
          <h1 className="font-serif-heading text-[22px] font-medium text-[#EDEBE6]">
            Sign in to Workspace
          </h1>
          <p className="text-[12px] text-[#8E929B] leading-relaxed">
            Access meeting recordings, verifiable summaries, and team action items.
          </p>
        </div>

        <div className="space-y-3">
          {/* Primary CTA using amber accent */}
          <Link
            href="/demo"
            className="w-full h-10 flex items-center justify-center gap-2 bg-[#C98A3E] hover:bg-[#d8974a] text-[#1C1E22] font-semibold text-[13px] rounded-[4px] transition-colors cursor-pointer"
          >
            <span>Continue as Reviewer / Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Secondary Google Sign-In */}
          <Link
            href="/demo"
            className="w-full h-10 flex items-center justify-center gap-2.5 bg-[#141619] hover:bg-[#22252B] border border-[#282B31] text-[#EDEBE6] font-mono text-[12px] rounded-[4px] transition-colors cursor-pointer"
          >
            <span>Continue with Google</span>
          </Link>
        </div>

        <div className="pt-2 border-t border-[#282B31] text-[11px] font-mono text-[#5A5E67] text-center">
          Instant reviewer access via &ldquo;/demo&rdquo;
        </div>
      </div>
    </div>
  );
}
