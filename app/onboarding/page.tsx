"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo, FathomSwoosh } from "@/components/brand/Logo";
import {
  Calendar,
  Check,
  ChevronRight,
  Users,
  Shield,
  ArrowRight,
  Bookmark,
  Sparkles,
  Loader2,
  Video,
  Radio,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Calendar
  const [isConnectingCalendar, setIsConnectingCalendar] = useState<"google" | "outlook" | null>(null);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  // Step 2: Role / Use Case
  const [selectedRole, setSelectedRole] = useState<string>("Product & Engineering");
  const [selectedPlatform, setSelectedPlatform] = useState<"zoom" | "meet" | "teams">("zoom");

  // Step 3: Test Call State
  const [testCallState, setTestCallState] = useState<
    "pending_permission" | "recording" | "processing" | "completed"
  >("pending_permission");
  const [testSeconds, setTestSeconds] = useState(0);
  const [highlightsCreated, setHighlightsCreated] = useState<string[]>([]);
  const [simulatedTranscripts, setSimulatedTranscripts] = useState<
    Array<{ speaker: string; text: string; time: string }>
  >([]);
  const [processingStep, setProcessingStep] = useState(0);

  // Calendar connect handler
  const handleConnectCalendar = (provider: "google" | "outlook") => {
    setIsConnectingCalendar(provider);
    setTimeout(() => {
      setIsConnectingCalendar(null);
      setCalendarConnected(true);
      setConnectedAccount(
        provider === "google" ? "mohib@fathom.video" : "mohib@outlook.com"
      );
    }, 1000);
  };

  // Test call ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 3 && testCallState === "recording") {
      interval = setInterval(() => {
        setTestSeconds((prev) => {
          const next = prev + 1;
          // Trigger live transcripts at specific seconds
          if (next === 2) {
            setSimulatedTranscripts((t) => [
              ...t,
              { speaker: "You (Host)", text: "Hey! Starting our quick 2-minute test call to see how Fathom works.", time: "00:02" },
            ]);
          } else if (next === 6) {
            setSimulatedTranscripts((t) => [
              ...t,
              { speaker: "Emmily Bowman", text: "Welcome! Fathom has joined the meeting. You don't have to take a single note.", time: "00:06" },
            ]);
          } else if (next === 12) {
            setSimulatedTranscripts((t) => [
              ...t,
              { speaker: "You (Host)", text: "That's awesome. Let's make sure the engineering review is scheduled for Thursday.", time: "00:12" },
            ]);
          } else if (next === 18) {
            setSimulatedTranscripts((t) => [
              ...t,
              { speaker: "Fathom AI", text: "⚡ Action item detected: Schedule engineering review for Thursday.", time: "00:18" },
            ]);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, testCallState]);

  // Process and redirect to call page
  useEffect(() => {
    if (testCallState === "processing") {
      const t1 = setTimeout(() => setProcessingStep(1), 500);
      const t2 = setTimeout(() => setProcessingStep(2), 1100);
      const t3 = setTimeout(() => setProcessingStep(3), 1700);
      const t4 = setTimeout(() => {
        setTestCallState("completed");
        router.push("/calls/829997322");
      }, 2300);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [testCallState, router]);

  const handleApproveRecording = () => {
    setTestCallState("recording");
  };

  const handleBookmarkHighlight = () => {
    const timeStr = `00:${testSeconds.toString().padStart(2, "0")}`;
    setHighlightsCreated((prev) => [...prev, `Highlight at ${timeStr}`]);
  };

  const handleFinishTestCall = () => {
    setTestCallState("processing");
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-white flex flex-col select-none">
      {/* Top Header */}
      <header className="h-16 border-b border-[#26282d]/70 px-8 flex items-center justify-between bg-[#0d0e12]/90 backdrop-blur-md">
        <Logo href="/" />
        <div className="flex items-center gap-3 text-xs text-[#9a9ba1]">
          <span className={step >= 1 ? "text-[#00b2ea] font-semibold" : ""}>
            1. Connect Calendar
          </span>
          <span>→</span>
          <span className={step >= 2 ? "text-[#00b2ea] font-semibold" : ""}>
            2. Setup
          </span>
          <span>→</span>
          <span className={step >= 3 ? "text-[#00b2ea] font-semibold" : ""}>
            3. Record 2-Min Test Call
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6">
        {/* STEP 1: CALENDAR CONNECT */}
        {step === 1 && (
          <div className="max-w-md w-full bg-[#13151c] border border-[#262934] rounded-2xl p-8 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#00b2ea]/15 border border-[#00b2ea]/30 flex items-center justify-center text-[#00b2ea] mx-auto">
              <Calendar className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-2">Connect your calendar</h2>
              <p className="text-xs text-[#9a9ba1] leading-relaxed">
                Fathom connects to your calendar so the notetaker automatically knows when to join your Zoom, Google Meet, or Microsoft Teams meetings.
              </p>
            </div>

            {!calendarConnected ? (
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => handleConnectCalendar("google")}
                  disabled={isConnectingCalendar !== null}
                  className="w-full h-12 px-4 rounded-xl bg-[#1a1c24] hover:bg-[#222530] border border-[#2c303e] flex items-center justify-between text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📅</span>
                    <span>Connect Google Calendar</span>
                  </div>
                  {isConnectingCalendar === "google" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#00b2ea]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#9a9ba1]" />
                  )}
                </button>

                <button
                  onClick={() => handleConnectCalendar("outlook")}
                  disabled={isConnectingCalendar !== null}
                  className="w-full h-12 px-4 rounded-xl bg-[#1a1c24] hover:bg-[#222530] border border-[#2c303e] flex items-center justify-between text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📆</span>
                    <span>Connect Microsoft Outlook</span>
                  </div>
                  {isConnectingCalendar === "outlook" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#00b2ea]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#9a9ba1]" />
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-[#162923] border border-[#3dbb6b]/40 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3dbb6b] flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Calendar Connected
                    </span>
                    <span className="text-[11px] text-[#9a9ba1]">{connectedAccount}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0e1b17] border border-[#3dbb6b]/20 text-[11px] text-[#d1d5db]">
                    <p className="font-semibold text-white">Upcoming Meeting Detected:</p>
                    <p className="text-[#9a9ba1] mt-0.5">
                      &ldquo;Test call with yourself&rdquo; • Starting in 1 min on {selectedPlatform.toUpperCase()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full h-11 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#00b2ea]/20"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="pt-2 text-[11px] text-[#9a9ba1] flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#3dbb6b]" />
              <span>SOC 2 Type II certified • Read-only calendar metadata</span>
            </div>
          </div>
        )}

        {/* STEP 2: USE CASE & PLATFORM */}
        {step === 2 && (
          <div className="max-w-md w-full bg-[#13151c] border border-[#262934] rounded-2xl p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#00b2ea]/15 border border-[#00b2ea]/30 flex items-center justify-center text-[#00b2ea] mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Select your focus</h2>
              <p className="text-xs text-[#9a9ba1]">
                Fathom personalizes your AI summary templates and action item detection.
              </p>
            </div>

            {/* Roles */}
            <div className="space-y-2">
              {[
                { title: "Product & Engineering", desc: "Roadmaps, sprint standups, technical design reviews" },
                { title: "Sales & Account Management", desc: "Discovery calls, demos, CRM sync, deal reviews" },
                { title: "Founders & Executives", desc: "Board meetings, 1-on-1s, strategic planning" },
                { title: "Recruiting & HR", desc: "Candidate interviews, feedback scorecards, team syncs" },
              ].map((role) => (
                <div
                  key={role.title}
                  onClick={() => setSelectedRole(role.title)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedRole === role.title
                      ? "bg-[#1c1f2a] border-[#00b2ea] text-white shadow-md shadow-[#00b2ea]/10"
                      : "bg-[#151720] hover:bg-[#1a1d28] border-[#262934] text-[#9a9ba1]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{role.title}</span>
                    {selectedRole === role.title && (
                      <Check className="w-4 h-4 text-[#00b2ea]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#9a9ba1] mt-0.5">{role.desc}</p>
                </div>
              ))}
            </div>

            {/* Video Platform Choice */}
            <div className="pt-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#6e717b] mb-2">
                Preferred Meeting Platform
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "zoom", label: "Zoom" },
                  { id: "meet", label: "Google Meet" },
                  { id: "teams", label: "Teams" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlatform(p.id as typeof selectedPlatform)}
                    className={`h-9 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      selectedPlatform === p.id
                        ? "bg-[#00b2ea]/15 border-[#00b2ea] text-[#00b2ea]"
                        : "bg-[#181a24] border-[#2a2d3b] text-[#9a9ba1] hover:text-white"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full h-11 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#00b2ea]/20"
            >
              <span>Launch 2-Min Test Call</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: REAL IN-MEETING NOTETAKER & RECORDING */}
        {step === 3 && (
          <div className="max-w-2xl w-full bg-[#13151c] border border-[#262934] rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Top Bar of Simulated Meeting */}
            <div className="h-11 bg-[#0f1015] border-b border-[#262934] px-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#00b2ea]" />
                <span className="font-semibold text-white">
                  {selectedPlatform.toUpperCase()} Meeting: Test Call with Yourself
                </span>
              </div>

              <div className="flex items-center gap-3">
                {testCallState === "recording" && (
                  <div className="flex items-center gap-1.5 text-[#ef4444] font-bold text-xs">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>REC (Fathom Notetaker)</span>
                  </div>
                )}
                <span className="font-mono text-xs text-[#9a9ba1]">
                  00:{testSeconds.toString().padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Video Stage / Bot Container */}
            <div className="p-6 bg-[#08090c] flex-1 min-h-[380px] flex flex-col items-center justify-center relative">
              {/* Permission Modal */}
              {testCallState === "pending_permission" && (
                <div className="max-w-md w-full bg-[#181a24] border border-[#2c303e] rounded-2xl p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-[#00b2ea]/15 border border-[#00b2ea]/30 flex items-center justify-center mx-auto">
                    <FathomSwoosh className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      Fathom Notetaker is requesting to record this meeting
                    </h3>
                    <p className="text-xs text-[#9a9ba1] leading-relaxed">
                      As the host, approve to let Fathom transcribe the audio, detect action items, and synthesize an AI summary.
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleApproveRecording}
                      className="w-full py-2.5 rounded-xl bg-[#00b2ea] hover:bg-[#00c5ff] text-xs font-bold text-black transition-all cursor-pointer shadow-lg shadow-[#00b2ea]/20"
                    >
                      Approve & Start Recording
                    </button>
                  </div>
                </div>
              )}

              {/* Active Recording State */}
              {testCallState === "recording" && (
                <div className="w-full h-full flex flex-col justify-between space-y-4">
                  {/* Two participant video tiles */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-video bg-[#151720] rounded-xl border border-[#262934] flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="w-12 h-12 rounded-full bg-[#00b2ea] text-white font-bold flex items-center justify-center text-sm shadow-md">
                        Host
                      </div>
                      <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-white font-medium">
                        You (Host)
                      </span>
                    </div>

                    <div className="aspect-video bg-[#151720] rounded-xl border-2 border-[#3dbb6b] flex flex-col items-center justify-center relative shadow-lg shadow-[#3dbb6b]/10 overflow-hidden">
                      <div className="w-12 h-12 rounded-full bg-[#0f1117] border border-[#2a2d3b] flex items-center justify-center">
                        <FathomSwoosh className="w-6 h-6" />
                      </div>
                      <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-white font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3dbb6b]" />
                        Fathom Notetaker
                      </span>
                    </div>
                  </div>

                  {/* Real-time Fathom In-Call Controls */}
                  <div className="p-3 rounded-xl bg-[#14161f] border border-[#262934] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleBookmarkHighlight}
                        className="px-3 py-1.5 rounded-lg bg-[#242116] hover:bg-[#332e1d] border border-[#e8b923]/40 text-[#e8b923] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Bookmark Highlight</span>
                      </button>
                      {highlightsCreated.length > 0 && (
                        <span className="text-[11px] text-[#e8b923] font-mono">
                          {highlightsCreated.length} marked
                        </span>
                      )}
                    </div>

                    <button
                      onClick={handleFinishTestCall}
                      className="px-4 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-md"
                    >
                      End Call & View Recording
                    </button>
                  </div>

                  {/* Live transcript stream */}
                  <div className="bg-[#12141a] border border-[#232630] rounded-xl p-3 space-y-2 max-h-32 overflow-y-auto">
                    <div className="text-[10px] uppercase font-bold text-[#00b2ea] tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Live Transcript Stream</span>
                    </div>
                    {simulatedTranscripts.length === 0 ? (
                      <p className="text-xs text-[#9a9ba1] italic">Listening for conversation...</p>
                    ) : (
                      simulatedTranscripts.map((t, idx) => (
                        <div key={idx} className="text-xs leading-relaxed flex items-start gap-2">
                          <span className="text-[#9a9ba1] font-mono text-[10px] shrink-0 mt-0.5">
                            [{t.time}]
                          </span>
                          <span className="font-semibold text-white shrink-0">{t.speaker}:</span>
                          <span className="text-[#d1d5db]">{t.text}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Processing State with Step Indicators */}
              {testCallState === "processing" && (
                <div className="text-center space-y-5 py-8 max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 rounded-full bg-[#00b2ea]/15 border border-[#00b2ea]/30 flex items-center justify-center text-[#00b2ea] mx-auto shadow-lg">
                    <Loader2 className="w-7 h-7 animate-spin" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Processing meeting recording...
                    </h3>
                    <p className="text-xs text-[#9a9ba1]">
                      Delivering playback, transcript, and AI summary
                    </p>
                  </div>

                  {/* Processing Steps Checklist */}
                  <div className="bg-[#12141a] border border-[#232630] rounded-xl p-4 text-left space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#3dbb6b]" />
                      <span className="text-white">Audio & video recording captured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {processingStep >= 1 ? (
                        <Check className="w-4 h-4 text-[#3dbb6b]" />
                      ) : (
                        <Loader2 className="w-4 h-4 animate-spin text-[#00b2ea]" />
                      )}
                      <span className={processingStep >= 1 ? "text-white" : "text-[#9a9ba1]"}>
                        Transcribing audio with sub-second sync
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {processingStep >= 2 ? (
                        <Check className="w-4 h-4 text-[#3dbb6b]" />
                      ) : (
                        <span className="w-4 h-4 text-[#4b5160] flex items-center justify-center">○</span>
                      )}
                      <span className={processingStep >= 2 ? "text-white" : "text-[#9a9ba1]"}>
                        Extracting action items and owner assignments
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {processingStep >= 3 ? (
                        <Check className="w-4 h-4 text-[#3dbb6b]" />
                      ) : (
                        <span className="w-4 h-4 text-[#4b5160] flex items-center justify-center">○</span>
                      )}
                      <span className={processingStep >= 3 ? "text-white" : "text-[#9a9ba1]"}>
                        Synthesizing AI summary with Gemini
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Completed State Fallback Link */}
              {testCallState === "completed" && (
                <div className="text-center space-y-4 py-8">
                  <div className="w-14 h-14 rounded-full bg-[#3dbb6b]/15 border border-[#3dbb6b]/30 flex items-center justify-center text-[#3dbb6b] mx-auto text-xl">
                    ✓
                  </div>
                  <h3 className="text-lg font-bold text-white">Opening your recording...</h3>
                  <Link
                    href="/calls/829997322"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#00b2ea] text-black font-bold text-xs hover:bg-[#00c5ff] transition-all"
                  >
                    <span>Click here if not redirected</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
