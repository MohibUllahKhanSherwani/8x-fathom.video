import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-3.6-flash";

export async function POST(req: NextRequest) {
  try {
    const { meetingId, template = "Enhanced", language = "en" } = await req.json();

    if (!meetingId) {
      return NextResponse.json({ error: "meetingId is required" }, { status: 400 });
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 1. Check if summary already exists in database
    const { data: existingSummary } = await supabase
      .from("summaries")
      .select("content")
      .eq("meeting_id", meetingId)
      .eq("template", template)
      .maybeSingle();

    if (existingSummary && existingSummary.content) {
      return NextResponse.json({ summary: existingSummary.content, cached: true });
    }

    // 2. If not cached, verify Gemini API key
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY missing from environment. Real AI summary requires Gemini API key." },
        { status: 500 }
      );
    }

    // 3. Fetch meeting details and transcript segments from Supabase
    const [{ data: meeting }, { data: segments }] = await Promise.all([
      supabase.from("meetings").select("title").eq("id", meetingId).single(),
      supabase.from("segments").select("speaker, start_ms, text").eq("meeting_id", meetingId).order("start_ms", { ascending: true }),
    ]);

    if (!segments || segments.length === 0) {
      return NextResponse.json({ error: "No transcript segments found for this meeting in database." }, { status: 404 });
    }

    const transcriptSnippet = segments
      .map((s) => `[${Math.floor(s.start_ms / 60000)}:${Math.floor((s.start_ms % 60000) / 1000).toString().padStart(2, "0")}] ${s.speaker || "Speaker"}: ${s.text}`)
      .join("\n");

    const prompt = `You are Fathom AI, an intelligent meeting notetaker.
Generate a structured meeting summary for the following meeting using the "${template}" template style.
Language: ${language}.

Meeting Title: "${meeting?.title || "Meeting"}"
Transcript:
${transcriptSnippet}

You MUST return a strictly valid JSON object (and nothing else, no markdown codeblock wrapping) matching this TypeScript interface:
{
  "meeting_purpose": "1-2 sentence high-level purpose of the call",
  "key_takeaways": [
    "takeaway 1",
    "takeaway 2",
    "takeaway 3"
  ],
  "topics": [
    {
      "title": "Topic Title",
      "start_ms": 0,
      "bullets": [
        "bullet 1",
        "bullet 2"
      ]
    }
  ],
  "next_steps": [
    "step 1",
    "step 2"
  ]
}`;

    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    let rawText = response.text || "{}";
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    let summaryContent;
    try {
      summaryContent = JSON.parse(rawText);
    } catch {
      return NextResponse.json({ error: "Failed to parse LLM summary output as JSON", raw: rawText }, { status: 500 });
    }

    // 4. Save generated summary directly into Supabase summaries table
    await supabase.from("summaries").upsert(
      {
        meeting_id: meetingId,
        template,
        language,
        content: summaryContent,
        model: modelName,
      },
      { onConflict: "meeting_id,template,language" }
    );

    return NextResponse.json({ summary: summaryContent, cached: false });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error generating summary";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
