import { SEED_MEETINGS } from "./seed-meetings";

export interface SearchMeetingResult {
  id: string;
  title: string;
  duration_sec: number;
  dateLabel: string;
  owner_name: string;
  participantCount: number;
  snippet?: string;
}

export interface SearchTranscriptResult {
  meetingId: string;
  meetingTitle: string;
  speaker: string;
  start_ms: number;
  end_ms: number;
  timestampLabel: string;
  text: string;
}

export interface GlobalSearchResults {
  meetings: SearchMeetingResult[];
  transcripts: SearchTranscriptResult[];
  totalMatches: number;
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function searchMeetings(query: string): GlobalSearchResults {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return { meetings: [], transcripts: [], totalMatches: 0 };
  }

  const matchedMeetings: SearchMeetingResult[] = [];
  const matchedTranscripts: SearchTranscriptResult[] = [];

  for (const meeting of SEED_MEETINGS) {
    let meetingMatched = false;
    let snippet: string | undefined = undefined;

    // Check title
    if (meeting.title.toLowerCase().includes(cleanQuery)) {
      meetingMatched = true;
    }

    // Check participants
    const matchingParticipant = meeting.participants.find((p) =>
      p.name.toLowerCase().includes(cleanQuery)
    );
    if (matchingParticipant) {
      meetingMatched = true;
      snippet = `Participant: ${matchingParticipant.name} (${matchingParticipant.role || "Team"})`;
    }

    // Check summary takeaways
    const summaryTakeaways = meeting.summary.Enhanced?.key_takeaways || [];
    const matchingTakeaway = summaryTakeaways.find((t) =>
      t.toLowerCase().includes(cleanQuery)
    );
    if (matchingTakeaway) {
      meetingMatched = true;
      if (!snippet) snippet = matchingTakeaway;
    }

    if (meetingMatched) {
      matchedMeetings.push({
        id: meeting.id,
        title: meeting.title,
        duration_sec: meeting.duration_sec,
        dateLabel: "Sep 20, 2026",
        owner_name: meeting.owner_name,
        participantCount: meeting.participants.length,
        snippet,
      });
    }

    // Check segments for transcript moments
    for (const segment of meeting.segments) {
      if (segment.text.toLowerCase().includes(cleanQuery)) {
        matchedTranscripts.push({
          meetingId: meeting.id,
          meetingTitle: meeting.title,
          speaker: segment.speaker,
          start_ms: segment.start_ms,
          end_ms: segment.end_ms,
          timestampLabel: formatTime(segment.start_ms),
          text: segment.text,
        });
      }
    }
  }

  return {
    meetings: matchedMeetings.slice(0, 5),
    transcripts: matchedTranscripts.slice(0, 10),
    totalMatches: matchedMeetings.length + matchedTranscripts.length,
  };
}
