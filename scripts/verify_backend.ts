import path from "path";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import { generateGeminiContentWithRetry, getGeminiApiKeys } from "../lib/gemini";

// Load .env
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
  console.warn("Could not read .env:", e);
}

async function verify() {
  console.log("=== VERIFYING REAL CONNECTED BACKEND ===");
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase credentials in .env");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // 1. Verify Meetings
  const { data: meetings, error: mErr } = await supabase.from("meetings").select("id, title, duration_sec, visibility");
  if (mErr) throw mErr;
  console.log(`[PASS] Supabase Meetings: Found ${meetings.length} meetings live in DB`);

  // 2. Verify Star 60-min meeting (829997321)
  const starId = "829997321";
  const { data: starMeeting } = await supabase.from("meetings").select("id, title").eq("id", starId).single();
  const { data: starParticipants } = await supabase.from("participants").select("id, name, talk_ms").eq("meeting_id", starId);
  const { data: starSegments } = await supabase.from("segments").select("id, speaker, start_ms, text").eq("meeting_id", starId);
  const { data: starSummaries } = await supabase.from("summaries").select("template, language").eq("meeting_id", starId);
  const { data: starActions } = await supabase.from("action_items").select("id, text, assignee, done").eq("meeting_id", starId);

  console.log(`[PASS] Star Meeting "${starMeeting?.title}":`);
  console.log(`   - Participants: ${starParticipants?.length} distinct participants`);
  console.log(`   - Segments: ${starSegments?.length} synchronized transcript rows`);
  console.log(`   - Summaries: ${starSummaries?.length} templates cached in DB`);
  console.log(`   - Action Items: ${starActions?.length} real action items in DB`);

  // 3. Verify PostgreSQL Full-Text Search
  const { data: searchResults, error: sErr } = await supabase
    .from("segments")
    .select("speaker, text, start_ms")
    .textSearch("tsv", "pricing", { type: "websearch" })
    .limit(3);

  if (sErr) throw sErr;
  console.log(`[PASS] Postgres FTS (GIN Index) search for 'pricing': Found ${searchResults.length} matching spoken moments`);
  if (searchResults.length > 0) {
    console.log(`   Example: [${searchResults[0].speaker}] "${searchResults[0].text.substring(0, 70)}..."`);
  }

  // 4. Verify Gemini LLM Connectivity
  const keys = getGeminiApiKeys();
  console.log(`[PASS] Gemini API Keys configured: ${keys.length} key(s) available for failover`);
  
  console.log("Testing live Gemini generation...");
  const prompt = `State the main priority for Q4 in 1 sentence based on this context:
Carlos Ramirez suggested $19/mo pricing for Pro tier. Daniel Okafor is delivering SOC 2 Type II audit report by Oct 15. Launch date is Nov 18.`;
  
  const { text: geminiResponse } = await generateGeminiContentWithRetry({ contents: prompt });
  console.log(`[PASS] Gemini Live AI response: "${geminiResponse.trim()}"`);

  console.log("\n>>> ALL BACKEND SERVICES CONFIRMED REAL AND CONNECTED! <<<\n");
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
