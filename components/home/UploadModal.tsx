"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  FileAudio,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Loader2,
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

      // Simulate realistic step transitions
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
        router.push(`/calls/${data.meetingId || "829997322"}`);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error processing file";
      setError(msg);
      setStep("idle");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-[#161719] border border-[#26282d] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Upload className="w-5 h-5 text-[#00b2ea]" />
            <span>Upload Meeting Recording</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#25282e] text-[#9a9ba1] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === "idle" ? (
          <div className="space-y-4">
            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white block">Meeting Title</label>
              <input
                type="text"
                placeholder="e.g. Q4 Strategy Review"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#1e2024] border border-[#2f3238] focus:border-[#00b2ea] rounded-xl text-xs text-white outline-none transition-all"
              />
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#2f3238] hover:border-[#00b2ea]/60 bg-[#1e2024]/50 hover:bg-[#1e2024] rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/*,.mp3,.mp4,.m4a,.wav"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-full bg-[#00b2ea]/15 border border-[#00b2ea]/30 flex items-center justify-center text-[#00b2ea] mx-auto">
                <FileAudio className="w-6 h-6" />
              </div>

              <div>
                <p className="text-xs font-bold text-white">
                  {file ? file.name : "Click to browse or drag and drop"}
                </p>
                <p className="text-[11px] text-[#9a9ba1] mt-1">
                  Supports MP3, M4A, WAV, or MP4 up to 500MB
                </p>
              </div>

              {file && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00b2ea]/15 text-[#00b2ea] text-xs font-mono">
                  <span>{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                  <span>•</span>
                  <span>Ready</span>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-[#ff4d4f]/10 border border-[#ff4d4f]/30 rounded-xl flex items-center gap-2 text-xs text-[#ff4d4f]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#1e2024] hover:bg-[#25282e] text-xs font-semibold text-[#9a9ba1] hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleStartProcessing}
                disabled={!file}
                className="px-6 py-2 bg-[#00b2ea] hover:bg-[#00c5ff] disabled:opacity-40 text-black font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#00b2ea]/20"
              >
                <span>Upload & Process</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Processing State View */
          <div className="py-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#00b2ea]/15 border border-[#00b2ea]/30 flex items-center justify-center text-[#00b2ea] mx-auto animate-pulse">
              <Sparkles className="w-8 h-8 text-[#00b2ea]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white">
                {step === "uploading" && "Uploading media..."}
                {step === "transcribing" && "Transcribing with Gemini AI..."}
                {step === "summarizing" && "Generating summaries & action items..."}
                {step === "ready" && "Processing complete!"}
              </h3>
              <p className="text-xs text-[#9a9ba1]">
                {step === "uploading" && "Direct upload to storage..."}
                {step === "transcribing" && "Detecting speakers, timestamps & words..."}
                {step === "summarizing" && "Structuring Enhanced & General templates..."}
                {step === "ready" && "Redirecting to your new call page..."}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#1e2024] h-2 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="bg-[#00b2ea] h-full rounded-full transition-all duration-500"
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#9a9ba1]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00b2ea]" />
              <span>Please do not close this window</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
