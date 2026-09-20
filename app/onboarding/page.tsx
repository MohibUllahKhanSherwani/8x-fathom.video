"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Camera,
  CameraOff,
  Mic,
  MicOff,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Calendar
  const [isConnectingCalendar, setIsConnectingCalendar] = useState<"google" | "outlook" | null>(null);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  // Step 2: Role / Platform
  const [selectedRole, setSelectedRole] = useState<string>("Product & Engineering");
  const [selectedPlatform, setSelectedPlatform] = useState<"zoom" | "meet" | "teams">("zoom");
  const [captureMode, setCaptureMode] = useState<"webrtc" | "simulated">("webrtc");

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
  const [createdMeetingId, setCreatedMeetingId] = useState<string>("829997322");

  // Real Camera & Mic State
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

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

  // Setup real camera & microphone if in webrtc mode
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startMedia() {
      if (step === 3 && captureMode === "webrtc") {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err: unknown) {
          console.warn("Camera/Mic access not granted or not available:", err);
          setCameraError("Camera or microphone permission not granted. Falling back to simulated video.");
          setCaptureMode("simulated");
        }
      }
    }

    startMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [step, captureMode]);

  // Test call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 3 && testCallState === "recording") {
      interval = setInterval(() => {
        setTestSeconds((prev) => {
          const next = prev + 1;
          if (next === 2) {
            setSimulatedTranscripts((t) => [
              ...t,
              { speaker: "You (Host)", text: "Starting our live test call with Fathom.", time: "00:02" },
            ]);
          } else if (next === 6) {
            setSimulatedTranscripts((t) => [
              ...t,
              { speaker: "Fathom AI", text: "Fathom Notetaker joined. Capturing real-time audio and speech diarization.", time: "00:06" },
            ]);
          } else if (next === 12) {
            setSimulatedTranscripts((t) => [
              ...t,
              { speaker: "You (Host)", text: "Let's make sure the engineering review is scheduled for Thursday.", time: "00:12" },
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

  // Start real recording
  const handleApproveRecording = () => {
    setTestCallState("recording");

    if (captureMode === "webrtc" && mediaStreamRef.current) {
      try {
        recordedChunksRef.current = [];
        const recorder = new MediaRecorder(mediaStreamRef.current, {
          mimeType: MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : "audio/webm",
        });
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };
        recorder.start(500); // chunk every 500ms
        mediaRecorderRef.current = recorder;
      } catch (e) {
        console.warn("MediaRecorder start failed:", e);
      }
    }
  };

  const handleBookmarkHighlight = () => {
    const timeStr = `00:${testSeconds.toString().padStart(2, "0")}`;
    setHighlightsCreated((prev) => [...prev, `Highlight at ${timeStr}`]);
  };

  // End call & upload
  const handleFinishTestCall = async () => {
    setTestCallState("processing");

    // Stop camera/mic tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Stop recorder if active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    // Upload recording blob
    setTimeout(async () => {
      setProcessingStep(1);
      try {
        const blob = recordedChunksRef.current.length > 0
          ? new Blob(recordedChunksRef.current, { type: "video/webm" })
          : new Blob(["dummy audio"], { type: "audio/webm" });

        const formData = new FormData();
        formData.append("file", blob, "my-test-call.webm");
        formData.append("title", "My 2-Minute Test Call");
        formData.append("platform", selectedPlatform);
        formData.append("role", selectedRole);

        setProcessingStep(2);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        setProcessingStep(3);
        if (res.ok) {
          const data = await res.json();
          if (data.meetingId) {
            setCreatedMeetingId(data.meetingId);
          }
        }
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setTimeout(() => {
          setTestCallState("completed");
          router.push(`/calls/${createdMeetingId}`);
        }, 800);
      }
    }, 600);
  };

  const toggleCamera = () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicEnabled(audioTrack.enabled);
      }
    }
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
            3. Record 2-Min Call
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

        {/* STEP 2: USE CASE & CAPTURE MODE */}
        {step === 2 && (
          <div className="max-w-md w-full bg-[#13151c] border border-[#262934] rounded-2xl p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#00b2ea]/15 border border-[#00b2ea]/30 flex items-center justify-center text-[#00b2ea] mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Setup your test call</h2>
              <p className="text-xs text-[#9a9ba1]">
                Choose how you want to record your 2-minute test meeting.
              </p>
            </div>

            {/* Mode Selection: Real Camera/Mic vs Simulated */}
            <div className="space-y-2">
              <div
                onClick={() => setCaptureMode("webrtc")}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  captureMode === "webrtc"
                    ? "bg-[#1c1f2a] border-[#00b2ea] text-white shadow-md shadow-[#00b2ea]/10"
                    : "bg-[#151720] hover:bg-[#1a1d28] border-[#262934] text-[#9a9ba1]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#00b2ea]" />
                    <span>Real Camera &amp; Microphone (Recommended)</span>
                  </span>
                  {captureMode === "webrtc" && <Check className="w-4 h-4 text-[#00b2ea]" />}
                </div>
                <p className="text-[11px] text-[#9a9ba1] mt-1">
                  Speak into your mic and let Gemini transcribe your real voice and generate a live summary.
                </p>
              </div>

              <div
                onClick={() => setCaptureMode("simulated")}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  captureMode === "simulated"
                    ? "bg-[#1c1f2a] border-[#00b2ea] text-white shadow-md shadow-[#00b2ea]/10"
                    : "bg-[#151720] hover:bg-[#1a1d28] border-[#262934] text-[#9a9ba1]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-[#3dbb6b]" />
                    <span>Simulated Meeting (Instant)</span>
                  </span>
                  {captureMode === "simulated" && <Check className="w-4 h-4 text-[#00b2ea]" />}
                </div>
                <p className="text-[11px] text-[#9a9ba1] mt-1">
                  Instant 2-minute test meeting with Emmily Bowman and Fathom Notetaker without camera access.
                </p>
              </div>
            </div>

            {/* Role Selection */}
            <div className="pt-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#6e717b] mb-2">
                Your Role
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Product & Engineering",
                  "Sales & CS",
                  "Founders & Execs",
                  "Recruiting & HR",
                ].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`h-8 px-2.5 rounded-lg border text-[11px] font-medium transition-all cursor-pointer truncate ${
                      selectedRole === role
                        ? "bg-[#00b2ea]/15 border-[#00b2ea] text-[#00b2ea]"
                        : "bg-[#181a24] border-[#2a2d3b] text-[#9a9ba1] hover:text-white"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Platform Choice */}
            <div className="pt-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#6e717b] mb-2">
                Meeting Platform
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
              <span>Launch 2-Min Call</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: REAL CAMERA/MIC IN-MEETING NOTETAKER */}
        {step === 3 && (
          <div className="max-w-3xl w-full bg-[#13151c] border border-[#262934] rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Top Bar */}
            <div className="h-11 bg-[#0f1015] border-b border-[#262934] px-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#00b2ea]" />
                <span className="font-semibold text-white">
                  {selectedPlatform.toUpperCase()}: 2-Minute Call with Yourself
                </span>
                {captureMode === "webrtc" && (
                  <span className="text-[10px] font-bold bg-[#3dbb6b]/20 text-[#3dbb6b] px-2 py-0.5 rounded">
                    LIVE CAMERA
                  </span>
                )}
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

            {/* Video Stage Container */}
            <div className="p-6 bg-[#08090c] flex-1 min-h-[400px] flex flex-col items-center justify-center relative">
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
                      {captureMode === "webrtc"
                        ? "Your camera and microphone will be recorded live. Speak for a moment, and Fathom will generate your real transcript and summary."
                        : "Fathom will record the test meeting and generate an AI summary with action items."}
                    </p>
                    {cameraError && (
                      <p className="text-[11px] text-[#f59e0b] mt-2 bg-[#2a2415] border border-[#f59e0b]/30 p-2 rounded-lg">
                        {cameraError}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleApproveRecording}
                      className="w-full py-2.5 rounded-xl bg-[#00b2ea] hover:bg-[#00c5ff] text-xs font-bold text-black transition-all cursor-pointer shadow-lg shadow-[#00b2ea]/20"
                    >
                      Approve &amp; Start Recording
                    </button>
                  </div>
                </div>
              )}

              {/* Active Recording Stage */}
              {testCallState === "recording" && (
                <div className="w-full h-full flex flex-col justify-between space-y-4">
                  {/* Two participant video tiles */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* User Tile: Real Webcam or Avatar */}
                    <div className="aspect-video bg-[#151720] rounded-xl border border-[#262934] flex flex-col items-center justify-center relative overflow-hidden">
                      {captureMode === "webrtc" ? (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover mirror"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#00b2ea] text-white font-bold flex items-center justify-center text-sm shadow-md">
                          Host
                        </div>
                      )}

                      <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded text-white font-medium flex items-center gap-1.5 z-10">
                        <span className="w-2 h-2 rounded-full bg-[#3dbb6b]" />
                        <span>You (Host)</span>
                      </span>

                      {/* Video Controls overlay */}
                      {captureMode === "webrtc" && (
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                          <button
                            onClick={toggleMic}
                            className={`p-1.5 rounded-lg text-white transition-colors ${
                              micEnabled ? "bg-black/60 hover:bg-black/80" : "bg-[#ef4444]"
                            }`}
                            title={micEnabled ? "Mute mic" : "Unmute mic"}
                          >
                            {micEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={toggleCamera}
                            className={`p-1.5 rounded-lg text-white transition-colors ${
                              cameraEnabled ? "bg-black/60 hover:bg-black/80" : "bg-[#ef4444]"
                            }`}
                            title={cameraEnabled ? "Turn off camera" : "Turn on camera"}
                          >
                            {cameraEnabled ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Fathom Notetaker Tile */}
                    <div className="aspect-video bg-[#151720] rounded-xl border-2 border-[#3dbb6b] flex flex-col items-center justify-center relative shadow-lg shadow-[#3dbb6b]/10 overflow-hidden">
                      <div className="w-12 h-12 rounded-full bg-[#0f1117] border border-[#2a2d3b] flex items-center justify-center">
                        <FathomSwoosh className="w-6 h-6" />
                      </div>
                      <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded text-white font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3dbb6b]" />
                        <span>Fathom Notetaker</span>
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
                      End Call &amp; View Summary
                    </button>
                  </div>

                  {/* Live transcript stream */}
                  <div className="bg-[#12141a] border border-[#232630] rounded-xl p-3 space-y-2 max-h-28 overflow-y-auto">
                    <div className="text-[10px] uppercase font-bold text-[#00b2ea] tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Live Speech Detection</span>
                    </div>
                    {simulatedTranscripts.length === 0 ? (
                      <p className="text-xs text-[#9a9ba1] italic">Listening for speech...</p>
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

              {/* Processing Animation */}
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
                      Transcribing with Gemini &amp; synthesizing summary
                    </p>
                  </div>

                  {/* Processing Steps Checklist */}
                  <div className="bg-[#12141a] border border-[#232630] rounded-xl p-4 text-left space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#3dbb6b]" />
                      <span className="text-white">Camera &amp; audio stream captured</span>
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
                        Extracting action items and owners
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
                    href={`/calls/${createdMeetingId}`}
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
