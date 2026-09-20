import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Case 1: Toggle 'done' state
    if (body.action === "toggle_done" && body.id !== undefined) {
      const { data, error } = await supabase
        .from("action_items")
        .update({ done: body.done })
        .eq("id", body.id)
        .select()
        .single();

      if (error) {
        // If row not found (e.g. manual in-memory id), return soft ok
        return NextResponse.json({ success: true, updated: false, error: error.message });
      }
      return NextResponse.json({ success: true, updated: true, item: data });
    }

    // Case 2: Create new manual action item
    if (body.action === "create") {
      const { meeting_id, text, assignee, due_hint, start_ms, source = "manual" } = body;
      if (!meeting_id || !text) {
        return NextResponse.json({ error: "meeting_id and text required" }, { status: 400 });
      }

      const { data, error } = await supabase
        .from("action_items")
        .insert({
          meeting_id,
          text,
          assignee: assignee || "Unassigned",
          due_hint: due_hint || "Upcoming",
          start_ms: start_ms || 0,
          source,
          done: false,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, item: data });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error handling action item";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
