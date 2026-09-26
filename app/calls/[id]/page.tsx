"use client";

import React, { use } from "react";
import { MeetingWorkspace } from "@/components/workspace/MeetingWorkspace";

interface CallPageProps {
  params: Promise<{ id: string }>;
}

export default function CallPage({ params }: CallPageProps) {
  const resolvedParams = use(params);
  const meetingId = resolvedParams.id;

  return <MeetingWorkspace initialMeetingId={meetingId} />;
}
