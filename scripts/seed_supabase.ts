import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { SEED_MEETINGS, getRollingTimestamp } from "../lib/seed-meetings";

// Parse .env manually
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
} catch (e) {
  console.warn("Could not read .env file:", e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log("Starting Supabase seed...");

  for (const meeting of SEED_MEETINGS) {
    console.log(`\nSeeding meeting: ${meeting.title} (${meeting.id})`);

    // 1. Insert Meeting
    const { error: meetingErr } = await supabase.from("meetings").upsert({
      id: meeting.id,
      title: meeting.title,
      duration_sec: meeting.duration_sec,
      seed_offset_minutes: meeting.seed_offset_minutes,
      started_at: getRollingTimestamp(meeting.seed_offset_minutes),
      platform: meeting.platform,
      visibility: meeting.visibility,
      status: "ready",
      source: "seed",
      audio_url: meeting.audio_url,
      is_external: meeting.is_external,
    });

    if (meetingErr) {
      console.error(`Error inserting meeting ${meeting.id}:`, meetingErr.message);
      continue;
    }

    // 2. Insert Participants
    if (meeting.participants && meeting.participants.length > 0) {
      await supabase.from("participants").delete().eq("meeting_id", meeting.id);
      const participantRows = meeting.participants.map((p) => ({
        meeting_id: meeting.id,
        name: p.name,
        is_host: p.is_host || false,
        is_external: p.is_external || false,
        color: p.color,
        talk_ms: Math.round(((p.talk_pct || 10) / 100) * meeting.duration_sec * 1000),
      }));

      const { error: partErr } = await supabase.from("participants").insert(participantRows);
      if (partErr) console.error("Error inserting participants:", partErr.message);
      else console.log(`Inserted ${participantRows.length} participants`);
    }

    // 3. Insert Summaries
    if (meeting.summary) {
      for (const [template, content] of Object.entries(meeting.summary)) {
        const { error: sumErr } = await supabase.from("summaries").upsert(
          {
            meeting_id: meeting.id,
            template,
            language: "en",
            content,
            model: "gemini-3.6-flash",
          },
          { onConflict: "meeting_id,template,language" }
        );
        if (sumErr) console.error(`Error inserting summary ${template}:`, sumErr.message);
      }
      console.log(`Inserted summaries for meeting ${meeting.id}`);
    }

    // 4. Insert Action Items
    if (meeting.action_items && meeting.action_items.length > 0) {
      await supabase.from("action_items").delete().eq("meeting_id", meeting.id);
      const actionRows = meeting.action_items.map((a) => ({
        meeting_id: meeting.id,
        source: a.source || "ai",
        text: a.text,
        assignee: a.assignee,
        due_hint: a.due_hint,
        start_ms: a.start_ms,
      }));

      const { error: actionErr } = await supabase.from("action_items").insert(actionRows);
      if (actionErr) console.error("Error inserting action items:", actionErr.message);
      else console.log(`Inserted ${actionRows.length} action items`);
    }

    // 5. Insert Segments (in batches of 50 to avoid payload limits)
    if (meeting.segments && meeting.segments.length > 0) {
      await supabase.from("segments").delete().eq("meeting_id", meeting.id);
      const segmentRows = meeting.segments.map((s, index) => ({
        meeting_id: meeting.id,
        idx: s.id || index + 1,
        start_ms: s.start_ms,
        end_ms: s.end_ms,
        text: s.text,
        speaker: s.speaker,
      }));

      for (let i = 0; i < segmentRows.length; i += 50) {
        const chunk = segmentRows.slice(i, i + 50);
        const { error: segErr } = await supabase.from("segments").insert(chunk);
        if (segErr) {
          console.error(`Error inserting segments ${i}-${i + 50}:`, segErr.message);
          break;
        }
      }
      console.log(`Inserted ${segmentRows.length} transcript segments`);
    }
  }

  console.log("\nSupabase database seed completed successfully!");
}

seed().catch(console.error);
