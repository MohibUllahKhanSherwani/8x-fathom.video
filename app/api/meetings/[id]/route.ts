import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SEED_MEETINGS } from "@/lib/seed-meetings";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Fetch meeting
      const { data: meeting, error: mErr } = await supabase
        .from("meetings")
        .select("*")
        .eq("id", id)
        .single();

      if (!mErr && meeting) {
        // Fetch participants, segments, summaries, action_items in parallel
        const [
          { data: participants },
          { data: segments },
          { data: summaries },
          { data: actionItems },
        ] = await Promise.all([
          supabase.from("participants").select("*").eq("meeting_id", id),
          supabase.from("segments").select("*").eq("meeting_id", id).order("start_ms", { ascending: true }),
          supabase.from("summaries").select("*").eq("meeting_id", id),
          supabase.from("action_items").select("*").eq("meeting_id", id),
        ]);

        // Transform summaries array to map
        const summaryMap: Record<string, unknown> = {};
        if (summaries) {
          for (const s of summaries) {
            summaryMap[s.template] = s.content;
          }
        }

        return NextResponse.json({
          meeting: {
            ...meeting,
            participants: participants || [],
            segments: segments || [],
            summary: summaryMap,
            action_items: actionItems || [],
          },
        });
      }
    }

    // Fallback to local seed meeting
    const localMeeting = SEED_MEETINGS.find((m) => m.id === id) || SEED_MEETINGS[0];
    return NextResponse.json({ meeting: localMeeting });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching meeting details";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
