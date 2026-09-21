import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateGeminiContentWithRetry, getGeminiApiKeys } from "@/lib/gemini";

export async function GET() {
  const issues: string[] = [];

  // 1. Check Gemini
  const keys = getGeminiApiKeys();
  let geminiStatus = "not_configured";
  if (keys.length === 0) {
    issues.push("GEMINI_API_KEY is missing from environment");
  } else {
    try {
      const res = await generateGeminiContentWithRetry({
        contents: "ping",
      });
      if (res.text) {
        geminiStatus = `connected (${keys.length} keys configured, active key #${res.usedKeyIndex + 1})`;
      } else {
        issues.push("Gemini returned empty response");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      issues.push(`Gemini API Error: ${msg}`);
      geminiStatus = "error";
    }
  }

  // 2. Check Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let supabaseStatus = "not_configured";
  if (!supabaseUrl || !supabaseKey) {
    issues.push("NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing");
  } else {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { count, error } = await supabase.from("meetings").select("*", { count: "exact", head: true });
      if (error) {
        issues.push(`Supabase Query Error: ${error.message}`);
        supabaseStatus = "error";
      } else {
        supabaseStatus = `connected (meetings table accessible, ${count ?? 0} rows)`;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      issues.push(`Supabase Connection Error: ${msg}`);
      supabaseStatus = "error";
    }
  }

  if (issues.length > 0) {
    return NextResponse.json(
      {
        status: "unhealthy",
        gemini: geminiStatus,
        supabase: supabaseStatus,
        issues,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: "healthy",
    gemini: geminiStatus,
    supabase: supabaseStatus,
    timestamp: new Date().toISOString(),
  });
}
