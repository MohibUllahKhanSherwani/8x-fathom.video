"use client";

import React, { use } from "react";
import { MeetingWorkspace } from "@/components/workspace/MeetingWorkspace";

interface SharePageProps {
  params: Promise<{ token: string }>;
}

export default function PublicSharePage({ params }: SharePageProps) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const targetId = token === "star" || token === "demo" ? "829997321" : token;

  return <MeetingWorkspace initialMeetingId={targetId} />;
}
