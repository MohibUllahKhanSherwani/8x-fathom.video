import os
import sys
import json
import re
from datetime import datetime, timezone
from pathlib import Path

def parse_iso_datetime(dt_str):
    if not dt_str:
        return datetime.now(timezone.utc)
    clean_str = dt_str.replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(clean_str)
    except Exception:
        return datetime.now(timezone.utc)

def format_iso_utc(dt):
    if hasattr(dt, "tzinfo") and dt.tzinfo is not None:
        utc_dt = dt.astimezone(timezone.utc)
    else:
        utc_dt = dt.replace(tzinfo=timezone.utc)
    return utc_dt.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"

def sanitize_secrets(text):
    if not text:
        return ""
    # Redact Google/Gemini and GCP API keys
    text = re.sub(r'AQ\.Ab[a-zA-Z0-9_\-]+', '[REDACTED_GEMINI_API_KEY]', text)
    text = re.sub(r'AIzaSy[a-zA-Z0-9_\-]+', '[REDACTED_GOOGLE_API_KEY]', text)
    return text

def extract_prompt_text(content):
    if not content:
        return ""
    # Check for <USER_REQUEST> tags
    req_match = re.search(r"<USER_REQUEST>\s*(.*?)\s*</USER_REQUEST>", content, re.DOTALL)
    if req_match:
        return sanitize_secrets(req_match.group(1).strip())
    return sanitize_secrets(content.strip())


def process_transcript(conversation_id, transcript_path=None, model_name=None, repo_root=None):
    if repo_root is None:
        # Default to repo root (3 levels up from this script: .agents/scripts/ -> repo root)
        repo_root = Path(__file__).resolve().parent.parent.parent
    else:
        repo_root = Path(repo_root)

    logs_dir = repo_root / ".agent-logs"
    logs_dir.mkdir(parents=True, exist_ok=True)

    # Determine full transcript path
    full_transcript_path = None
    if transcript_path:
        tp = Path(transcript_path)
        # Check if transcript_full.jsonl exists alongside transcript.jsonl
        candidate_full = tp.parent / "transcript_full.jsonl"
        if candidate_full.exists():
            full_transcript_path = candidate_full
        elif tp.exists():
            full_transcript_path = tp

    if not full_transcript_path or not full_transcript_path.exists():
        # Look in standard Antigravity location
        app_data = os.environ.get("USERPROFILE", "C:\\Users\\Cognilum AI")
        candidate = Path(app_data) / ".gemini" / "antigravity-ide" / "brain" / conversation_id / ".system_generated" / "logs" / "transcript_full.jsonl"
        if candidate.exists():
            full_transcript_path = candidate
        else:
            candidate_regular = candidate.parent / "transcript.jsonl"
            if candidate_regular.exists():
                full_transcript_path = candidate_regular

    if not full_transcript_path or not full_transcript_path.exists():
        # Debug log
        with open(logs_dir / "capture_debug.log", "a", encoding="utf-8") as f:
            f.write(f"[{datetime.now(timezone.utc).isoformat()}] Could not find transcript for conversation {conversation_id}\n")
        return

    # Read transcript entries
    lines = []
    with open(full_transcript_path, "r", encoding="utf-8") as f:
        for line in f:
            line_str = line.strip()
            if line_str:
                try:
                    lines.append(json.loads(line_str))
                except Exception:
                    pass

    # Group into turns
    turns = []
    current_user = None
    current_responses = []

    for entry in lines:
        stype = entry.get("type")
        if stype == "USER_INPUT":
            if current_user is not None:
                turns.append((current_user, current_responses))
            current_user = entry
            current_responses = []
        elif stype == "PLANNER_RESPONSE":
            content = entry.get("content", "") or ""
            # Capture responses with content (final responses), or non-tool call responses
            if content.strip() or not entry.get("tool_calls"):
                current_responses.append(entry)

    if current_user is not None:
        turns.append((current_user, current_responses))

    if not turns:
        return

    # Identify session details
    session_id = conversation_id or "unknown-session"
    short_session_id = session_id[:8]
    first_prompt_entry = turns[0][0]
    first_prompt_time_str = first_prompt_entry.get("created_at", "")
    first_prompt_dt = parse_iso_datetime(first_prompt_time_str)

    last_prompt_entry = turns[-1][0]
    last_prompt_time_str = last_prompt_entry.get("created_at", "")
    last_prompt_dt = parse_iso_datetime(last_prompt_time_str)

    date_str = first_prompt_dt.strftime("%Y-%m-%d")
    timestamp_prefix = first_prompt_dt.strftime("%Y-%m-%d_%H-%M-%S")
    target_filename = f"{timestamp_prefix}_{session_id}.md"
    target_filepath = logs_dir / target_filename

    # Default metadata
    resolved_model = model_name or "gemini-3.8-flash"
    author = "MohibUllahKhanSherwani"
    project = "8x-fathom.video"
    tool_name = "antigravity-ide"

    # Build Markdown
    header = f"""---
session_id: {session_id}
date: {date_str}
author: {author}
model: {resolved_model}
tool: {tool_name}
project: {project}
total_exchanges: {len(turns)}
first_prompt_time: {format_iso_utc(first_prompt_dt)}
last_prompt_time: {format_iso_utc(last_prompt_dt)}
---

# Session Log - {date_str}

Session: `{short_session_id}` | Project: `{project}` | Author: `{author}`

---
"""

    entries = []
    for idx, (u_step, resps) in enumerate(turns):
        turn_num = idx + 1
        u_time = format_iso_utc(parse_iso_datetime(u_step.get("created_at")))
        prompt_text = extract_prompt_text(u_step.get("content", ""))

        prompt_block = f"""[LOG_ENTRY type=PROMPT num={turn_num} session={short_session_id}]
timestamp: {u_time}
model: {resolved_model}

{prompt_text}"""
        entries.append(prompt_block)

        # Get final response for this turn
        final_resp_step = resps[-1] if resps else None
        if final_resp_step:
            r_time = format_iso_utc(parse_iso_datetime(final_resp_step.get("created_at")))
            resp_text = sanitize_secrets((final_resp_step.get("content", "") or "").strip())
            if not resp_text:
                resp_text = "[Agent completed turn with tool execution]"

            resp_block = f"""[LOG_ENTRY type=RESPONSE num={turn_num} session={short_session_id}]
timestamp: {r_time}
model: {resolved_model}

{resp_text}"""
            entries.append(resp_block)

    full_log_content = header + "\n" + "\n\n\n".join(entries) + "\n"

    with open(target_filepath, "w", encoding="utf-8") as f:
        f.write(full_log_content)

def main():
    input_data = {}
    if len(sys.argv) > 1:
        conversation_id = sys.argv[1]
        transcript_path = sys.argv[2] if len(sys.argv) > 2 else None
        model_name = "gemini-3.8-flash"
        workspace_paths = [str(Path(__file__).resolve().parent.parent.parent)]
    else:
        try:
            raw = sys.stdin.read()
            if raw.strip():
                input_data = json.loads(raw)
        except Exception:
            pass

        conversation_id = input_data.get("conversationId")
        transcript_path = input_data.get("transcriptPath")
        model_name = input_data.get("modelName") or "gemini-3.8-flash"
        workspace_paths = input_data.get("workspacePaths", [])

    app_data = os.environ.get("USERPROFILE", "C:\\Users\\Cognilum AI")
    if not conversation_id:
        brain_dir = Path(app_data) / ".gemini" / "antigravity-ide" / "brain"
        if brain_dir.exists():
            sessions = [d for d in brain_dir.iterdir() if d.is_dir() and (d / ".system_generated" / "logs").exists()]
            if sessions:
                sessions.sort(key=lambda d: d.stat().st_mtime, reverse=True)
                conversation_id = sessions[0].name

    repo_root = workspace_paths[0] if workspace_paths else None

    # Log execution for debugging
    try:
        app_data = os.environ.get("USERPROFILE", "C:\\Users\\Cognilum AI")
        debug_log_path = Path(__file__).resolve().parent.parent.parent / ".agent-logs" / "hook_debug.log"
        debug_log_path.parent.mkdir(parents=True, exist_ok=True)
        with open(debug_log_path, "a", encoding="utf-8") as f:
            f.write(f"[{datetime.now(timezone.utc).isoformat()}] Hook triggered. conversationId={conversation_id}, modelName={model_name}\n")
    except Exception:
        pass

    if conversation_id:
        process_transcript(conversation_id, transcript_path, model_name, repo_root)

    # Return empty JSON object to stdout as required by Antigravity hook contract
    print(json.dumps({}))

if __name__ == "__main__":
    main()
