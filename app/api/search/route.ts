import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { searchMeetings } from "@/lib/search";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ meetings: [], transcripts: [], totalMatches: 0 });
    }

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // 1. Search segments using PostgreSQL Full-Text Search (GIN indexed)
      const { data: segmentResults } = await supabase
        .from("segments")
        .select("id, meeting_id, speaker, start_ms, end_ms, text, meetings(title)")
        .textSearch("tsv", query.trim(), { type: "websearch" })
        .limit(10);

      // 2. Search meetings by title
      const { data: meetingResults } = await supabase
        .from("meetings")
        .select("id, title, duration_sec, is_external, participants(name)")
        .ilike("title", `%${query.trim()}%`)
        .limit(5);

      if ((segmentResults && segmentResults.length > 0) || (meetingResults && meetingResults.length > 0)) {
        const formattedMeetings = (meetingResults || []).map((m) => {
          const parts = m.participants as Array<{ name: string }> | null;
          return {
            id: m.id,
            title: m.title,
            duration_sec: m.duration_sec,
            participantCount: parts ? parts.length : 1,
            is_external: m.is_external || false,
          };
        });

        const formattedTranscripts = (segmentResults || []).map((s) => {
          const meetingObj = s.meetings as unknown as { title: string } | null;
          const min = Math.floor(s.start_ms / 60000);
          const sec = Math.floor((s.start_ms % 60000) / 1000);
          return {
            meetingId: s.meeting_id,
            meetingTitle: meetingObj?.title || "Meeting Call",
            speaker: s.speaker || "Participant",
            text: s.text,
            start_ms: s.start_ms,
            timestampLabel: `${min}:${sec < 10 ? "0" : ""}${sec}`,
          };
        });

        return NextResponse.json({
          meetings: formattedMeetings,
          transcripts: formattedTranscripts,
          totalMatches: formattedMeetings.length + formattedTranscripts.length,
        });
      }
    }

    // Fallback to local search
    const localResults = searchMeetings(query);
    return NextResponse.json(localResults);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Search error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
