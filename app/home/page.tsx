"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MeetingWorkspace } from "@/components/workspace/MeetingWorkspace";

function HomeContent() {
  const searchParams = useSearchParams();
  const meetingId = searchParams.get("meeting") || "829997321";

  return <MeetingWorkspace initialMeetingId={meetingId} />;
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#1C1E22] flex items-center justify-center text-[#8E929B] font-mono text-xs">
          Loading workspace...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
