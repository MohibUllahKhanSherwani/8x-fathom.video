import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export const metadata = {
  title: "Sign in to Fathom",
  description: "Sign in or explore Fathom as a demo user",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#111214] flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00b2ea]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md bg-[#1e2024] border border-[#2f3238] rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Logo href="/" size="lg" className="mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Welcome to Fathom</h1>
          <p className="text-xs text-[#9a9ba1] max-w-xs leading-relaxed">
            The AI meeting notetaker that transcribes, summarizes, and pulls action items automatically.
          </p>
        </div>

        <div className="space-y-3">
          {/* Primary: Continue to Workspace */}
          <Link
            href="/demo"
            className="w-full h-11 flex items-center justify-center gap-2 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-semibold text-sm rounded-lg transition-all shadow-lg shadow-[#00b2ea]/20 group"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>Continue to Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Secondary: Google Sign In */}
          <Link
            href="/demo"
            className="w-full h-11 flex items-center justify-center gap-3 bg-[#161719] hover:bg-[#25282e] border border-[#2f3238] text-white font-medium text-xs rounded-lg transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-[#26282d] text-center">
          <p className="text-[11px] text-[#9a9ba1]">
            Sign in to access your recorded meetings, AI summaries, and team workspace.
          </p>
        </div>
      </div>
    </div>
  );
}
