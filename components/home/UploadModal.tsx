"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  FileAudio,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ProcessingStep = "idle" | "uploading" | "transcribing" | "summarizing" | "ready";

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [step, setStep] = useState<ProcessingStep>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      setFile(dropped);
      if (!meetingTitle) {
        setMeetingTitle(dropped.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!meetingTitle) {
        setMeetingTitle(selected.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleStartProcessing = async () => {
    if (!file) return;

    setError(null);
    setStep("uploading");
    setProgress(20);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", meetingTitle || file.name);

      setTimeout(() => {
        setStep("transcribing");
        setProgress(50);
      }, 1200);

      setTimeout(() => {
        setStep("summarizing");
        setProgress(80);
      }, 2400);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to process recording");
      }

      const data = await res.json();

      setStep("ready");
      setProgress(100);

      setTimeout(() => {
        onClose();
        router.push(`/calls/${data.meetingId || "829997321"}`);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error processing file";
      setError(msg);
      setStep("idle");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-[#121622] border border-white/10 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Upload Meeting Recording</h2>
              <p className="text-[11px] text-slate-400">High-fidelity audio transcription & executive intelligence</p>
            </div>
          </div>

          {step === "idle" && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Step: Idle (Dropzone + Details) */}
        {step === "idle" && (
          <div className="space-y-4">
            {/* Dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/12 hover:border-indigo-500/50 rounded-2xl p-8 text-center cursor-pointer bg-white/2 hover:bg-indigo-500/5 transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3 text-indigo-400">
                <FileAudio className="w-6 h-6" />
              </div>

              {file ? (
                <div>
                  <p className="text-xs font-bold text-white truncate max-w-xs mx-auto">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-white">
                    Drag and drop audio/video file here, or click to browse
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports MP3, MP4, WAV, M4A, WEBM (up to 100MB)
                  </p>
                </div>
              )}
            </div>

            {/* Title Input */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Meeting Title
              </label>
              <input
                type="text"
                placeholder="e.g. Q4 Executive Planning Sync"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#0e121d] border border-white/8 focus:border-indigo-500/60 rounded-xl text-xs text-white placeholder-slate-400 outline-none transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleStartProcessing}
                disabled={!file}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Process Recording</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Processing Pipeline Progress */}
        {step !== "idle" && (
          <div className="py-6 space-y-6 text-center">
            {/* Animated Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-white capitalize">
                  {step === "uploading" && "1/3 Uploading Media Payload..."}
                  {step === "transcribing" && "2/3 Diarizing & Transcribing..."}
                  {step === "summarizing" && "3/3 Synthesizing Executive Brief..."}
                  {step === "ready" && "Ready! Opening Meeting Room..."}
                </span>
                <span className="font-mono text-indigo-400">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                />
              </div>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 pt-2">
              <div className={`p-2.5 rounded-xl border ${step === "uploading" ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-300" : progress > 30 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/2 border-white/5"}`}>
                <span className="font-bold block">1. Ingestion</span>
                <span>Audio Stream</span>
              </div>
              <div className={`p-2.5 rounded-xl border ${step === "transcribing" ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-300" : progress > 60 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/2 border-white/5"}`}>
                <span className="font-bold block">2. Diarization</span>
                <span>Speaker Sync</span>
              </div>
              <div className={`p-2.5 rounded-xl border ${step === "summarizing" ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-300" : progress === 100 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/2 border-white/5"}`}>
                <span className="font-bold block">3. Synthesis</span>
                <span>Executive Intelligence</span>
              </div>
            </div>

            {step === "ready" && (
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Synthesis complete! Redirecting...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
