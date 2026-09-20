import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SEED_MEETINGS } from "@/lib/seed-meetings";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab") || "my";

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      let query = supabase.from("meetings").select("*, participants(*)");

      if (tab === "team") {
        query = query.eq("visibility", "team");
      } else {
        query = query.eq("visibility", "private");
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ meetings: data });
      }
    }

    // Fallback to local seed meetings
    const filtered = SEED_MEETINGS.filter((m) =>
      tab === "team" ? m.visibility === "team" : m.visibility === "private"
    );
    return NextResponse.json({ meetings: filtered });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching meetings";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
