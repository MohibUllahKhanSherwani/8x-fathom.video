"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Logo, FathomSwoosh } from "@/components/brand/Logo";
import {
  Calendar,
  Check,
  ChevronRight,
  Users,
  Star,
  Shield,
  ArrowRight,
} from "lucide-react";

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Calendar
  const [calendarConnected, setCalendarConnected] = useState(false);

  // Step 2: Role
  const [selectedRole, setSelectedRole] = useState<string>("Product & Engineering");

  // Step 3: Simulated Test Call State
  const [testCallState, setTestCallState] = useState<"pending_permission" | "recording" | "completed">("pending_permission");
  const [testSeconds, setTestSeconds] = useState(0);
  const [simulatedTranscripts, setSimulatedTranscripts] = useState<Array<{ speaker: string; text: string; time: string }>>([]);

  // Test call ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 3 && testCallState === "recording") {
      interval = setInterval(() => {
        setTestSeconds((prev) => {
          const next = prev + 1;
          // Trigger live transcripts at specific seconds
          if (next === 3) {
            setSimulatedTranscripts((t) => [
              ...t,
              { speaker: "You (Host)", text: "Welcome to our quick onboarding test call!", time: "00:03" },
            ]);
          } else if (next === 8) {
            setSimulatedTranscripts((t) => [
              ...t,
              { speaker: "Fathom AI", text: "Fathom Notetaker joined. Capturing audio and generating live transcript.", time: "00:08" },
            ]);
          } else if (next === 15) {
            setSimulatedTranscripts((t) => [
              ...t,
              { speaker: "You (Host)", text: "We need to ensure that the Q4 launch is set for November 18th.", time: "00:15" },
            ]);
          } else if (next === 22) {
            setSimulatedTranscripts((t) => [
              ...t,
              { speaker: "Fathom AI", text: "Action item detected: Finalize launch timeline for Nov 18.", time: "00:22" },
            ]);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, testCallState]);

  const handleConnectCalendar = () => {
    setCalendarConnected(true);
    setTimeout(() => setStep(2), 800);
  };

  const handleSelectRoleAndContinue = () => {
    setStep(3);
  };

  const handleApproveRecording = () => {
    setTestCallState("recording");
  };

  const handleFinishTestCall = () => {
    setTestCallState("completed");
  };

  return (
    <div className="min-h-screen bg-[#111214] text-white flex flex-col select-none">
      {/* Top Header */}
      <header className="h-16 border-b border-[#26282d] px-8 flex items-center justify-between">
        <Logo href="/" />
        <div className="flex items-center gap-2 text-xs text-[#9a9ba1]">
          <span className={step >= 1 ? "text-[#00b2ea] font-semibold" : ""}>1. Connect</span>
          <span>→</span>
          <span className={step >= 2 ? "text-[#00b2ea] font-semibold" : ""}>2. Use Case</span>
          <span>→</span>
          <span className={step >= 3 ? "text-[#00b2ea] font-semibold" : ""}>3. Test Call</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6">
        {/* STEP 1: CALENDAR CONNECT */}
        {step === 1 && (
          <div className="max-w-md w-full bg-[#161719] border border-[#26282d] rounded-2xl p-8 shadow-2xl space-y-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#00b2ea]/15 border border-[#00b2ea]/30 flex items-center justify-center text-[#00b2ea] mx-auto">
              <Calendar className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-2">Connect your calendar</h2>
              <p className="text-xs text-[#9a9ba1] leading-relaxed">
                Fathom looks at your calendar to automatically know when to join your Zoom, Google Meet, and Microsoft Teams meetings.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleConnectCalendar}
                className="w-full h-11 px-4 rounded-xl bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238] flex items-center justify-between text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📅</span>
                  <span>Connect Google Calendar</span>
                </div>
                {calendarConnected ? (
                  <Check className="w-4 h-4 text-[#3dbb6b]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#9a9ba1]" />
                )}
              </button>

              <button
                onClick={handleConnectCalendar}
                className="w-full h-11 px-4 rounded-xl bg-[#1e2024] hover:bg-[#25282e] border border-[#2f3238] flex items-center justify-between text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📆</span>
                  <span>Connect Microsoft Outlook</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9a9ba1]" />
              </button>
            </div>

            <div className="pt-2 text-[11px] text-[#9a9ba1] flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#3dbb6b]" />
              <span>SOC 2 Type II certified • Read-only calendar metadata</span>
            </div>
          </div>
        )}

        {/* STEP 2: ROLE / USE CASE */}
        {step === 2 && (
          <div className="max-w-md w-full bg-[#161719] border border-[#26282d] rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#00b2ea]/15 border border-[#00b2ea]/30 flex items-center justify-center text-[#00b2ea] mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">How will you use Fathom?</h2>
              <p className="text-xs text-[#9a9ba1]">
                We tailor your summary templates and default highlights based on your primary focus.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { title: "Product & Engineering", desc: "Roadmaps, sprint standups, technical design reviews" },
                { title: "Sales & Account Management", desc: "Discovery calls, demos, CRM sync, deal reviews" },
                { title: "Founders & Executives", desc: "Board meetings, 1-on-1s, strategic planning" },
                { title: "Recruiting & HR", desc: "Candidate interviews, feedback scorecards, team syncs" },
              ].map((role) => (
                <div
                  key={role.title}
                  onClick={() => setSelectedRole(role.title)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedRole === role.title
                      ? "bg-[#1e2024] border-[#00b2ea] text-white shadow-md shadow-[#00b2ea]/10"
                      : "bg-[#161719] hover:bg-[#1e2024] border-[#26282d] text-[#9a9ba1]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{role.title}</span>
                    {selectedRole === role.title && (
                      <Check className="w-4 h-4 text-[#00b2ea]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#9a9ba1] mt-1">{role.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleSelectRoleAndContinue}
              className="w-full h-11 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#00b2ea]/20"
            >
              <span>Continue to Test Call</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: SIMULATED TEST CALL */}
        {step === 3 && (
          <div className="max-w-2xl w-full bg-[#161719] border border-[#26282d] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Top Bar of Simulated Meeting */}
            <div className="h-11 bg-[#111214] border-b border-[#26282d] px-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {testCallState === "recording" ? (
                  <div className="flex items-center gap-1.5 text-[#ff4d4f] font-bold text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff4d4f] animate-pulse" />
                    <span>REC (Fathom Notetaker)</span>
                  </div>
                ) : (
                  <span className="text-[#9a9ba1]">Fathom Simulated Test Meeting</span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#9a9ba1]">
                <span>00:{testSeconds.toString().padStart(2, "0")}</span>
              </div>
            </div>

            {/* Video Stage / Bot Container */}
            <div className="p-6 bg-black flex-1 min-h-[340px] flex flex-col items-center justify-center relative">
              {testCallState === "pending_permission" && (
                /* Native Zoom-Style Permission Modal */
                <div className="max-w-md w-full bg-[#1e2024] border border-[#2f3238] rounded-xl p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-[#00b2ea]/15 border border-[#00b2ea]/30 flex items-center justify-center mx-auto">
                    <FathomSwoosh className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      Fathom Notetaker is requesting to record this meeting
                    </h3>
                    <p className="text-xs text-[#9a9ba1] leading-relaxed">
                      As the host, you can approve or decline this request. Attendees will be notified that recording has started.
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => alert("Simulated: You must approve to complete the test call!")}
                      className="flex-1 py-2 rounded-lg bg-[#2a2c32] hover:bg-[#34373e] text-xs font-semibold text-[#9a9ba1] transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={handleApproveRecording}
                      className="flex-1 py-2 rounded-lg bg-[#00b2ea] hover:bg-[#00c5ff] text-xs font-bold text-black transition-colors cursor-pointer shadow-md"
                    >
                      Approve & Record
                    </button>
                  </div>
                </div>
              )}

              {testCallState === "recording" && (
                <div className="w-full h-full flex flex-col justify-between space-y-4">
                  {/* Two participant tiles */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-video bg-[#1e2024] rounded-xl border border-[#2f3238] flex flex-col items-center justify-center relative">
                      <div className="w-12 h-12 rounded-full bg-[#00b2ea] text-white font-bold flex items-center justify-center text-sm shadow-md">
                        A
                      </div>
                      <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-2 py-0.5 rounded text-white font-medium">
                        Alex Rivera (Host)
                      </span>
                    </div>

                    <div className="aspect-video bg-[#1e2024] rounded-xl border-2 border-[#3dbb6b] flex flex-col items-center justify-center relative shadow-lg shadow-[#3dbb6b]/10">
                      <div className="w-12 h-12 rounded-full bg-[#111214] border border-[#2f3238] flex items-center justify-center">
                        <FathomSwoosh className="w-6 h-6" />
                      </div>
                      <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-2 py-0.5 rounded text-white font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3dbb6b]" />
                        Fathom Notetaker
                      </span>
                    </div>
                  </div>

                  {/* Live transcript stream simulation */}
                  <div className="bg-[#161719] border border-[#26282d] rounded-xl p-3 space-y-2 max-h-36 overflow-y-auto">
                    <div className="text-[10px] uppercase font-bold text-[#00b2ea] tracking-wider">
                      Live Transcript Stream
                    </div>
                    {simulatedTranscripts.length === 0 ? (
                      <p className="text-xs text-[#9a9ba1] italic">Listening for speech...</p>
                    ) : (
                      simulatedTranscripts.map((t, idx) => (
                        <div key={idx} className="text-xs leading-relaxed flex items-start gap-2">
                          <span className="text-[#9a9ba1] font-mono text-[10px] shrink-0 mt-0.5">[{t.time}]</span>
                          <span className="font-semibold text-white shrink-0">{t.speaker}:</span>
                          <span className="text-[#d1d5db]">{t.text}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleFinishTestCall}
                      className="px-5 py-2 bg-[#ff4d4f] hover:bg-[#ff6163] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      End Test Call & View Summary
                    </button>
                  </div>
                </div>
              )}

              {testCallState === "completed" && (
                <div className="text-center space-y-4 py-8 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-[#3dbb6b]/15 border border-[#3dbb6b]/30 flex items-center justify-center text-[#3dbb6b] mx-auto text-2xl shadow-xl">
                    🎉
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      Test call completed successfully!
                    </h3>
                    <p className="text-xs text-[#9a9ba1] max-w-sm mx-auto leading-relaxed">
                      You just earned <span className="text-[#e8b923] font-bold">+5 points</span>! Fathom has generated your summary and action items.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#242116] border border-[#e8b923]/40 text-[#e8b923] text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#e8b923]" />
                    <span>Total Balance: 30 Points</span>
                  </div>

                  <div className="pt-4">
                    <Link
                      href="/home"
                      className="inline-flex items-center justify-center px-8 py-2.5 bg-[#00b2ea] hover:bg-[#00c5ff] text-black font-bold text-xs rounded-full transition-all shadow-lg shadow-[#00b2ea]/25 cursor-pointer"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
