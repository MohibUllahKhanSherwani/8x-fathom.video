import { NextRequest, NextResponse } from "next/server";
import * as chrono from "chrono-node";
import { SEED_MEETINGS, Meeting } from "@/lib/seed-meetings";

interface AskRequestBody {
  query: string;
  meetingId?: string;
  scope?: "my" | "team" | "all";
}

interface Citation {
  label: string;
  ms: number;
  meetingId: string;
  meetingTitle: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AskRequestBody;
    const { query, meetingId, scope = "my" } = body;

    if (!query || !query.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Check if user has provided GEMINI_API_KEY
    const apiKey = process.env.GEMINI_API_KEY;

    // Single-meeting or account-level target meetings
    let targetMeetings: Meeting[] = [];
    if (meetingId) {
      const single = SEED_MEETINGS.find((m) => m.id === meetingId);
      if (single) targetMeetings = [single];
    } else {
      // Account-level: filter by scope
      targetMeetings = SEED_MEETINGS.filter((m) => {
        if (scope === "team") return m.visibility === "team";
        return true;
      });

      // Date phrase parsing using chrono-node
      chrono.parse(query);
    }

    // Require GEMINI_API_KEY for live AI responses (Fail Loudly)
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is missing from environment. Live AI responses require a valid Gemini API key.",
        },
        { status: 500 }
      );
    }

    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });
    const modelName = process.env.GEMINI_MODEL || "gemini-3.6-flash";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    let context = "";

    if (supabaseUrl && supabaseAnonKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      if (meetingId) {
        // Fetch meeting and segments from Supabase
        const [{ data: meeting }, { data: segments }] = await Promise.all([
          supabase.from("meetings").select("id, title").eq("id", meetingId).single(),
          supabase.from("segments").select("speaker, start_ms, text").eq("meeting_id", meetingId).order("start_ms", { ascending: true }),
        ]);

        if (meeting && segments && segments.length > 0) {
          const transcriptSnippet = segments
            .map((s) => `[${Math.floor(s.start_ms / 60000)}:${Math.floor((s.start_ms % 60000) / 1000).toString().padStart(2, "0")}] ${s.speaker || "Speaker"}: ${s.text}`)
            .join("\n");
          context = `Meeting: "${meeting.title}" (ID: ${meeting.id})\nTranscript:\n${transcriptSnippet}`;
        }
      } else {
        // Account-level: search top relevant segments using Postgres FTS
        const { data: matchedSegments } = await supabase
          .from("segments")
          .select("meeting_id, speaker, start_ms, text, meetings(title)")
          .textSearch("tsv", query.trim(), { type: "websearch" })
          .limit(30);

        if (matchedSegments && matchedSegments.length > 0) {
          context = matchedSegments
            .map((s) => {
              const meetingObj = s.meetings as unknown as { title: string } | null;
              const min = Math.floor(s.start_ms / 60000);
              const sec = Math.floor((s.start_ms % 60000) / 1000).toString().padStart(2, "0");
              return `[${meetingObj?.title || "Meeting"}] [${min}:${sec}] ${s.speaker || "Speaker"}: ${s.text}`;
            })
            .join("\n");
        }
      }
    }

    // Fallback context from seed meetings if Supabase returns empty
    if (!context) {
      context = targetMeetings
        .map((m) => {
          const transcriptSnippet = m.segments
            .map((s) => `[${Math.floor(s.start_ms / 60000)}:${Math.floor((s.start_ms % 60000) / 1000).toString().padStart(2, "0")}] ${s.speaker}: ${s.text}`)
            .join("\n");
          return `Meeting: "${m.title}" (ID: ${m.id})\nTakeaways:\n${m.summary.Enhanced?.key_takeaways.join("\n")}\n\nTranscript:\n${transcriptSnippet}`;
        })
        .join("\n\n---\n\n");
    }

    const prompt = `You are Fathom AI, an intelligent meeting assistant.
Answer the user's question directly, concisely, and accurately based on the meeting context provided below.
When quoting or referencing a specific moment from a meeting, include the exact timestamp in brackets like [MM:SS] (e.g. [24:30]).

Context:
${context}

User Question: ${query}`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    const text = response.text || "No response generated from Gemini.";

    return NextResponse.json({
      text,
      citations: extractCitationsFromText(text, targetMeetings[0]?.id || "829997322"),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}


function extractCitationsFromText(text: string, defaultMeetingId: string): Citation[] {
  const citations: Citation[] = [];
  const regex = /\[(\d{1,2}):(\d{2})\]/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    const ms = (minutes * 60 + seconds) * 1000;
    citations.push({
      label: `${match[1].padStart(2, "0")}:${match[2]}`,
      ms,
      meetingId: defaultMeetingId,
      meetingTitle: "Meeting Call",
    });
  }
  return citations;
}
