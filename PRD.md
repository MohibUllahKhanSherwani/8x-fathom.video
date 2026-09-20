# Fathom Clone: Product Requirements Document

Working title: **Fathom clone (8x assignment)**
Status: source of truth for the build. Keep this file in the repo root next to `AGENTS.md` / `GEMINI.md`.
Deadline: **21 Sept 2026, 06:27 UTC (11:27 PKT)**. Feature freeze at 02:57 UTC. Submit by 05:30 UTC at the latest.

---

## 0. Agent operating rules (read first)

1. Read this whole file before writing code. Follow the build order in section 16.
2. Work in phases. Every phase ends with: typecheck and lint pass, commit, push, Vercel deploy verified in a private window, box ticked in `PROGRESS.md`.
3. Commit `.agent-logs/` with every push. Never rewrite history.
4. Never commit secrets. `.env.example` lists variable names only.
5. No lorem ipsum. No buttons that do nothing. Every control either works, is clearly labeled as simulated, or is removed. No dead nav links.
6. Match the observed Fathom UI (section 5). Where a detail is marked INFERRED, use judgment and stay consistent.
7. Ask the human only for: API keys and accounts, approval for destructive actions, or decisions this file does not cover. Otherwise decide and log one line in `DECISIONS.md` (what, why). That file feeds the README and the walkthrough.
8. Prefer boring, proven solutions. Cut lower-priority scope before lowering the quality of P0.
9. Never hotlink Fathom's assets. Recreate logos and illustrations with SVG/CSS or use neutral placeholders.

---

## 1. Context

**Assignment:** rebuild a live product (Fathom, the AI meeting notetaker) in 24 hours. "Better than the original if you want."

**Judged on:**
1. **Speed:** how much working product exists in the time.
2. **Product judgement:** what was built first, what was left out, and whether that is explained.
3. **UX and UI:** whether what shipped is good to use.

**Explicit hints from the brief:**
- Stubbing the recording bot is allowed. Say so in the walkthrough and spend the time elsewhere.
- Playback against transcript, summary templates, action items, highlights, search across meetings, sharing a clip with someone who was not on the call.
- The 8-person, 1-hour call is "the case that actually matters".
- Seed real data. An empty meetings list is penalized.
- The live link must open for someone not signed in as the author.

**Deliverables:** live deployed URL, public GitHub repo with `.agent-logs/` committed, walkthrough video (5 min max, camera on, voiceover).

---

## 2. Product summary

A working Fathom-style meeting notetaker. Recordings become a synced transcript, AI summaries in multiple templates, action items, highlights, shareable links and clips, and an AI assistant that answers questions about one call or all calls with citations that jump to the exact moment. **The live capture layer (Zoom bot) is simulated. Everything after capture is real.**

### 2.1 Reviewer journey (this must work flawlessly)

1. Land on `/` (Fathom-style marketing page) -> "Get started, it's free" -> `/login`.
2. Click **Continue as demo user** (or open `/demo` directly). No signup, no email.
3. Short onboarding (3 screens, skippable) -> `/home` with a populated My Calls list.
4. Search across meetings from the top bar, click a result, land on the call at that timestamp.
5. Open the **8-person, 60-minute call**. Click a transcript line and hear audio from that moment. Speaker stage shows who is talking.
6. Switch summary template. Open action items. Add a highlight.
7. Ask Fathom a question, click a citation chip, the player jumps to that moment.
8. Create a clip, copy the share link, open it in a private window (signed out) and see it work.
9. Upload a short audio file and watch it go through processing to a full call page.
10. Visit Settings and see options that actually change behavior.

### 2.2 Non-goals

Real Zoom/Meet/Teams bot, real Google or Zoom OAuth, billing, teams/admin, CRM sync, desktop or iOS app, Trackers/Scorecards/coaching, real-time live summaries, mobile-first design.

---

## 3. Scope and priorities

| ID | Feature | Priority |
|----|---------|----------|
| F1 | Demo access + per-visitor sandbox session | P0 |
| F2 | Seed data (8 meetings incl. the 8-person hour-long call, with audio) | P0 |
| F3 | App shell, top bar, design system | P0 |
| F4 | Home: My Calls / Team Calls lists | P0 |
| F5 | Call page: player + speaker stage | P0 |
| F6 | Transcript (synced, searchable, virtualized) | P0 |
| F7 | Summary with templates | P0 |
| F8 | Action items | P0 |
| F9 | Search across meetings (top bar) | P0 |
| F10 | Ask Fathom: per-call | P0 |
| F11 | Highlights | P0 |
| F12 | Share link + public share page | P0 |
| F13 | Ask Fathom: account-level (home panel) | P1 |
| F14 | Clips (shareable time range) | P1 |
| F15 | Landing page (matches fathom.ai) | P1, timeboxed 90 min, required for submission |
| F16 | Settings page (real effects) | P1 |
| F17 | Onboarding + simulated capture + test call | P1 |
| F18 | Real upload pipeline (audio -> transcript -> summary) | P1 |
| F19 | Team Calls tab | P1 |
| F20 | Browser recording (WAV via MediaRecorder/AudioWorklet) | P2 |
| F21 | Language switch on summary, mini player, points badge, keyboard shortcuts | P2 |

---

## 4. Personas

- **Reviewer (primary):** engineer or hiring manager clicking around for 5 to 10 minutes. Wants speed, obvious depth, no dead ends.
- **Demo user "Alex Rivera":** the seeded account owner. Team members: Priya, Daniel, Mei, Carlos, Hannah, Tom, Aisha, Jordan (see section 10).

---

## 5. Fidelity notes: observed vs inferred

### 5.1 OBSERVED (from real screenshots and captured page text)

**Global**
- Dark theme only. Top bar: FATHOM wordmark with blue swoosh, "Search Call Recordings" input (left), then Refer (gift icon), Settings (gear), Help & Feedback, gold points badge (star + number), circular avatar (initial).
- Under the top bar on home: tabs **My Calls** and **Team Calls**, active tab in cyan with underline.

**Call page (`/calls/[id]`)**
- Two columns. Left: black video player with custom controls (volume, current time, scrub bar with playhead, `1x` speed, mini-player square icon). Below it three tabs: **SUMMARY, TRANSCRIPT, ASK FATHOM**, active one cyan with underline.
- Right column: title (bold, large), date (small gray, e.g. "Sep 20, 2026"), a wide cyan-outlined **Share** button with link icon, a kebab (three dots) menu beside it, then **ACTION ITEMS** heading (small caps gray). Empty state text: "None detected. Add manually on transcript tab".
- Duration shown next to the player (e.g. "2 mins").

**Summary tab**
- Row: template dropdown (icon + "Enhanced"), language dropdown ("US EN"), and a **Copy Summary** button with a doc icon at the right.
- Enhanced template sections: **Meeting Purpose** (one line), **Key Takeaways** (bullets), **Topics** (named topics, each with bullets). Summary text sits on pure black.

**Transcript tab**
- **Copy Transcript** button with clipboard icon in the tab row. Pill-shaped **Search Transcript** input. A **Resume Auto-Scroll** control appears when the user scrolls away from the playing line.
- Speaker name in small gray text, then consecutive utterances as separate dark rounded bubbles. On hover, a circled **(+)** appears to the left of a bubble and a **"..."** button to the right.

**Ask Fathom tab (per call)**
- Centered logo circle, "Hi, what can I tell you about this meeting?", four suggestion chips in a 2x2 grid: "Propose insightful follow-up questions", "What challenges do you foresee?", "What would help make progress?", "What was surprising in this meeting?". Input "Ask Fathom AI" with cyan up-arrow send button.

**Ask Fathom panel (account level, on home)**
- Right side panel titled "ASK FATHOM" with a collapse icon. Gold info banner at top. Suggested prompts: "Summarize my meetings from today", "List my action items from last week", "Any looming deadlines?". User message bubble (right, dark gray). Assistant empty-result reply in italics: "I couldn't find any calls that seem relevant to your question. Try rephrasing your question or adjusting your date filters." A **Start a new session** pill. Input "Ask anything..." with a scope selector **My Calls** (dropdown).

**Public share page (`/share/<long-token>`)**
- Signed-out top bar: wordmark, a gold pill "Get your own free AI Notetaker" (flame emoji), and **Sign In** on the right (no search, no settings, no points).
- Same two-column layout as the owner page, no kebab menu, Share button still present. Tab default: Summary (Enhanced).

**Settings (`/settings`)**
- Top: a sentence built from dropdowns: "Auto-record [All meetings v] and auto-share [Summary & recording v] with attendees".
- Section **VIDEO CONFERENCING**: cards for Zoom ("Partially Enabled" in gold, Connect button, toggle "Auto-capture unscheduled Zoom meetings", row "Disable 'Recording in progress' audio notification" with Update in Zoom Settings button), Google Meet ("Partially Enabled", Install Chrome Extension button, toggle), Microsoft Teams ("Fully Enabled" in green).
- Section **PREMIUM FEATURES** with a gold "30 days left in free preview" note: Bot Name (value "mohib's Fathom Notetaker", Edit button), Auto-Generate Action Items (Recommended tag, toggle on), Default Meeting Summary Template (dropdown "Enhanced", helper text about external meetings and attendees), Recording Notification Banner (Preview tag, toggle on, warning text about consent laws).
- Section **INTEGRATIONS**: rows with logo, name, description, Connect button (Claude: "Ask anything about your meetings").

**Onboarding**
- Google consent screen (calendar events), then "How are you planning to use Fathom?" (By Myself / With My Team, Continue), then "Connect to Zoom" with "Skip this step", then Zoom "add AI Notetaker by Fathom" consent (Allow / Decline), then a home modal: "Now try Fathom on a test Zoom call to earn another 5 Points" with three cards: Self-Guided Tutorial (1 min), Start Test Call (2 mins), Attend Tips & Tricks Webinar.

**Capture flow (Zoom)**
- Bot joins as a participant named "<name>'s Fathom Notetaker". Host sees a dialog: "<bot> is requesting to record this meeting" with a checkbox "Apply these permissions to all future requests in this meeting" and Approve / Decline. After approval a red REC indicator shows. The recording appears in My Calls.

### 5.2 INFERRED (use judgment)

- Home list row design (thumbnail, title, date, duration, participants, action-item count), date grouping, empty state.
- Transcript timestamp on hover, menu contents behind (+) and "...", clicking a bubble seeks the player.
- Share popover contents, kebab menu contents, template names other than "Enhanced".
- Highlight visuals, clip UI, Team Calls layout.

If any of the inferred items conflict with a screenshot the human adds later, the screenshot wins.

---

## 6. Design system

Verify exact values from the live site (browser tool or DevTools) in Phase 0 and record them in `docs/design-tokens.md`. Starting approximations:

| Token | Approx value | Use |
|-------|--------------|-----|
| `--bg` | `#1a1a1a` | page background |
| `--bg-black` | `#000000` | call page content pane (summary/transcript/ask) and player |
| `--surface` | `#26272b` | cards, modals, transcript bubbles (slightly lighter) |
| `--surface-2` | `#2f3035` | hover states, inputs |
| `--border` | `#3a3b40` | dividers, outlines |
| `--text` | `#ffffff` | primary text |
| `--text-muted` | `#9a9ba1` | dates, labels, section headings |
| `--accent` | `#00b2ea` | primary buttons, active tabs, links |
| `--accent-bg` | `#0a3547` | Share button fill, chip hover |
| `--gold` | `#e8b923` | points, banners, "Partially Enabled", highlights |
| `--success` | `#3dbb6b` | "Fully Enabled", active speaker ring |
| `--danger` | `#ff4d4f` | REC, destructive |

- Font: **Inter** (400, 500, 600, 700). Section labels in small uppercase muted text.
- Radii: 8px cards, 999px pills. Buttons 40px high. Transcript bubbles 10px radius.
- Wordmark: text "FATHOM" in a geometric sans plus a small cyan swoosh SVG drawn by us.
- Motion: subtle, 120 to 180ms ease. No layout jumps when data loads (skeletons everywhere).
- Every list and panel has a loading skeleton, an empty state, and an error state.

---

## 7. Information architecture and routes

| Route | Auth | Purpose |
|-------|------|---------|
| `/` | public | Marketing landing page (F15) |
| `/login` | public | "Continue as demo user" (primary) + mocked Google button |
| `/demo` | public | Sets the demo session cookie and redirects to `/home` (for the walkthrough and README) |
| `/onboarding` | session | 3-step onboarding (F17) |
| `/home` | session | My Calls / Team Calls + Ask Fathom panel |
| `/calls/[id]` | session | Call page (owner view) |
| `/share/[token]` | public | Read-only call page |
| `/clip/[token]` | public | Read-only clip page (F14) |
| `/settings` | session | Settings (F16) |
| `/calls/[id]/processing` | session | Processing state for uploads (or inline state on the call page) |

Rules: no session -> redirect protected routes to `/login`. Public routes never require a cookie and set `noindex`.

---

## 8. Feature specifications and acceptance criteria

### F1. Demo access and sandbox sessions (P0)
- `/demo` and the login button create a `session_id` (uuid) cookie (httpOnly, 30 days) and log in the shared demo user "Alex Rivera".
- Seed content (meetings, transcripts, AI outputs) is shared and read-only. Anything a visitor creates (highlights, manual action items, action-item checkbox state, clips, chats, uploads, settings, points) is stored with their `session_id` and visible only to them.
- Seed meetings cannot be deleted. Uploaded meetings can.
- **AC:** two browsers create highlights independently and do not see each other's. Removing cookies yields a clean state.

### F2. Seed data (P0)
See section 10. **AC:** `/home` shows 8 meetings with realistic titles, dates (rolling window), durations, participants. Each meeting has audio that plays, a transcript with correct timestamps, at least 2 summary templates, action items.

### F3. App shell (P0)
- Top bar as observed. Search input opens a results dropdown (F9). Settings link works. Refer, Help & Feedback open small popovers with plausible content (no dead clicks). Avatar opens a menu with "Settings" and "Sign out".
- Desktop-first. Minimum supported width 1024. Below that, single column stacked, still usable.
- **AC:** consistent tokens, no console errors, keyboard focus rings visible.

### F4. Home: My Calls / Team Calls (P0, Team tab P1)
- **My Calls:** meetings owned by the demo user plus the visitor's uploads, newest first, grouped by "Today / Yesterday / This week / Earlier". Row: thumbnail (speaker stage mini tile), title, relative date and time, duration, stacked participant avatars with count, action-item count, "External" chip when relevant, status badge for processing/failed.
- **Team Calls (F19):** meetings owned by teammates with `visibility = team`, row shows owner name.
- Ask Fathom panel on the right (F13), collapsible, state remembered.
- **AC:** list renders under 300ms from cached data, clicking a row opens the call page, empty state exists (for a session with all data filtered).

### F5. Call page: player and speaker stage (P0)
- Audio element drives everything. The "video area" is a **speaker stage**: grid of participant tiles (initials, color per participant), name label, active speaker highlighted with a green ring, synced to transcript segments. Works for 2 to 8 participants (grid adapts).
- Controls: play/pause, skip -10s / +10s, scrub bar with topic chapter ticks and gold highlight markers, current time / duration, speed cycle (0.75x, 1x, 1.25x, 1.5x, 2x, labeled `1x`), volume, mini-player toggle (P2).
- Seeking is accurate (constant bitrate MP3, HTTP range requests supported).
- Keyboard: Space play/pause, Left/Right 5s, `/` focus search, `H` add highlight at current time (P2 ok).
- Right column: title (inline editable for uploaded calls), date, duration, Share button + kebab (menu: Copy link, Download transcript (.txt), Delete (uploads only)), ACTION ITEMS, HIGHLIGHTS (shown only when present).
- **AC:** play, pause, seek by clicking the scrub bar, seek by clicking a transcript line, all within 300ms and in sync.

### F6. Transcript (P0)
- Segments grouped by speaker turn: speaker name (muted) then bubbles, one per utterance.
- Active bubble follows playback. Binary search on `start_ms` for the active index (never filter the full array on every `timeupdate`). Update at most every 150ms.
- **Virtualized** list (react-virtuoso or tanstack-virtual). 60-minute call has 700+ utterances. Initial render under 200ms on a mid laptop.
- Auto-scroll follows playback. Manual scroll pauses it and shows a **Resume Auto-Scroll** pill.
- Click a bubble seeks. Hover shows timestamp (mm:ss) at the right, (+) at the left, "..." at the right.
  - (+) menu: Add highlight, Add action item (prefilled with the utterance text), Create clip from here.
  - "..." menu: Copy text, Copy link to this moment (`?t=ms`), Jump here.
- **Search Transcript:** pill input, matches highlighted in-line, count "3 of 12", Enter/Shift+Enter to navigate, scrolls and seeks to the match.
- **Speaker filter chips** with talk-time percentage (needed for 8-person calls). Selecting a chip dims other speakers' bubbles.
- **Copy Transcript:** copies `[mm:ss] Speaker: text` lines to the clipboard, toast on success.
- **AC:** with the 8-person call, scrolling stays at 60fps, search is instant, active line stays correct after seeks and speed changes.

### F7. Summary and templates (P0)
- Tab defaults to the template in Settings (default **Enhanced**).
- Templates (names are placeholders unless the live dropdown says otherwise): **Enhanced** (default), **General**, **Sales Discovery**, **Customer Success**, **Stand-up**, **1:1**, **Interview**.
- Enhanced sections: Meeting Purpose (paragraph), Key Takeaways (bullets), Topics (title + bullets, each topic has a timestamp chip that seeks the player), Next Steps (bullets with owner).
- Seeded meetings: all templates pre-generated at seed time. Uploaded meetings: default template generated in the pipeline, others on demand and cached in `summaries`.
- Copy Summary copies plain text (markdown). Language dropdown shows "US EN" (P2: switch translates via Gemini and caches).
- **AC:** switching template is instant for seeded calls (cached), shows a skeleton and streams or resolves for uncached ones. Failure shows an inline retry.

### F8. Action items (P0)
- List in the right column: checkbox, text, assignee chip, timestamp chip (seeks the player), sparkle icon on AI-extracted items.
- Checking off is per-session state. Add manually (from the transcript (+) menu or an inline "Add action item" row). Edit text and assignee inline. Delete manual items.
- Empty state text: "None detected. Add manually on transcript tab".
- Settings toggle "Auto-Generate Action Items" controls extraction for new uploads.
- **AC:** the 8-person call shows 10 to 14 realistic action items with different owners and timestamps.

### F9. Search across meetings (P0)
- Top bar search runs Postgres full-text search over meeting titles, participant names, summaries, and transcript segments. Debounce 200ms.
- Dropdown results grouped by meeting: meeting title + date, up to 3 matching snippets with the query highlighted and a timestamp. Enter opens the top result. Clicking a snippet opens `/calls/[id]?t=ms` and seeks.
- Keyboard: `/` focuses search, Up/Down to navigate, Esc closes.
- Empty state: "No calls match 'x'".
- **AC:** search for a phrase spoken in the 8-person call returns the right meeting and timestamp in under 400ms.

### F10. Ask Fathom: per call (P0)
- Tab as observed. Four chips, input, send button. Messages stream (SSE). Assistant answers are markdown with **citation chips** like `[12:41]` that seek the player.
- **Pre-cached answers** for the four suggestion chips on every seeded call (instant, no API cost, real citations).
- Conversation persists per call per session. "Start a new session" clears.
- If the answer is not in the transcript, the assistant says so plainly. Citations are validated server-side, invalid ones removed.
- Rate limit and Gemini failures show a friendly inline message with retry, never a stack trace.
- **AC:** "Who owns the pricing decision?" on the 8-person call returns the right person with a working citation.

### F11. Highlights (P0)
- Created from the transcript (+) menu or the `H` key at the current time (P2 for the key). Optional note. Stored with `start_ms`, `end_ms`.
- Shown as gold markers on the scrub bar, a gold left border on the transcript bubble, and in a HIGHLIGHTS list in the right column (click to jump, edit note, delete).
- **AC:** highlight persists across reloads (per session) and appears on all three surfaces.

### F12. Share and public page (P0)
- **Share** button opens a popover: link field with copy button, toggle "Anyone with the link can view", checkboxes for what is shared (Summary, Transcript, Recording). Copy shows a toast.
- `/share/[token]` renders the same call layout read-only: signed-out top bar, no kebab, no highlight/action editing, Ask Fathom tab hidden or disabled with a sign-up nudge. Respects the shared parts. Uses the Enhanced template. `noindex`.
- Tokens are 32+ random URL-safe characters. Turning sharing off makes the link 404.
- **AC:** the link opens in a private window with no cookies, audio plays, transcript syncs.

### F13. Ask Fathom: account level (P1)
- Home right panel as observed, including gold banner (own copy), suggested prompts, scope selector (My Calls / Team Calls / All), "Start a new session".
- Retrieval: parse date phrases deterministically ("today", "yesterday", "last week", "this week", "last month", month names) with a library like chrono-node. Candidate meetings = date-filtered (or all). Context = each candidate's Enhanced summary + action items, plus the top 40 segments by Postgres FTS rank for the question. One Gemini call.
- Citations `[Meeting title, 12:41]` link to `/calls/[id]?t=ms`.
- Zero candidates -> the exact empty-result message from the original (section 5.1).
- **AC:** "List my action items from last week" and "Any looming deadlines?" return correct, cited answers on seed data.

### F14. Clips (P1)
- From the transcript (+) menu "Create clip from here" or by selecting start/end on the scrub bar. Dialog: title, start, end (adjustable, max 5 min), Create.
- Result: share link `/clip/[token]` that plays only the range, shows the transcript excerpt synced, and a CTA to sign up.
- **AC:** clip opens signed out, plays exactly the range, cannot see the rest of the call.

### F15. Landing page (P1, timeboxed 90 minutes)
Reference: `https://www.fathom.ai/overview` (fetch it, screenshot it, match layout, spacing, type, and dark space theme). Sections in order:
1. Nav: logo, Overview, Solutions, Integrations, Resources, Pricing, Sign Up (button), Log In. Only include links that resolve to something real (anchors or built pages). Remove the rest.
2. Hero: "Meeting intelligence built around you", subcopy, primary CTA "Get started. It's free." -> `/login`. Trust line: SOC 2 Type II, GDPR, HIPAA, SSO/SCIM. "Used and loved by more than 300,000 companies" with logo row (text or neutral SVG, not their assets).
3. "Never miss what matters": three feature cards (instant AI summaries, transcription built for real conversations, custom dictionaries).
4. "Capture on your terms": three capture modes (Transcript-only, Audio + transcript, Full audio + video) as tabs or cards.
5. "Stay fully present": four tiles (live summaries, private scratchpad, desktop app, iOS app).
6. "Turn every meeting into answers": Ask Fathom section with the four bullets and a small live-looking demo (static screenshot of our own UI is fine).
7. "Works everywhere you already work": integrations grid.
8. "Power your AI stack with meeting context": Claude, ChatGPT, API and MCP.
9. Testimonials, FAQ (accordion), final CTA "Save 38 minutes per meeting", footer.
- Responsive, fast (no heavy images), all CTAs go to `/login`.
- **AC:** side by side with fathom.ai it reads as the same product. Lighthouse performance 85 or above on desktop.

### F16. Settings (P1)
- Layout exactly as observed (section 5.1). Persisted per session.
- **Settings must affect behavior:**
  - Auto-record / auto-share sentence dropdowns affect the simulated capture flow's default share behavior.
  - Bot Name is used in the simulated capture dialog and in the transcript participant list of new simulated calls.
  - Auto-Generate Action Items toggle controls extraction in the upload pipeline.
  - Default Summary Template controls the summary tab default and the pipeline's first generation.
  - Recording Notification Banner toggle shows or hides a banner in the simulated capture flow.
- Zoom/Meet/Teams cards and Integrations: Connect buttons open a mock consent modal, then flip to a "Connected" state. Label as simulated in the walkthrough.
- **AC:** change Default Summary Template to Sales, open a call, and see Sales selected.

### F17. Onboarding and simulated capture (P1)
- Mock Google consent -> "By Myself / With My Team" -> "Connect to Zoom" (mock Zoom consent, Skip link) -> home modal with three cards.
- **Start Test Call** runs the simulated bot: a modal showing a Zoom-like host permission dialog ("<bot name> is requesting to record this meeting", checkbox, Approve/Decline), then REC state with a timer, End, then a processing screen with real steps (Uploading -> Transcribing -> Summarizing -> Ready). Ends in a new "Test call" meeting in My Calls. Uses a pre-generated 2-minute recording; label it "Simulated capture" in a small footnote.
- **Add notetaker to a meeting** on home: paste a Zoom/Meet/Teams link, same simulated flow (valid link format required).
- Points: +5 tutorial, +5 test call (P2 visual only).
- **AC:** the whole flow completes in under 30 seconds and lands on a real call page.

### F18. Real upload pipeline (P1)
- "New call" button on home -> modal: drag and drop or pick file. Accepted: mp3, wav, m4a (aac), ogg, flac. Limit 20 MB and 15 minutes. Validate client-side.
- Flow: client uploads directly to Supabase Storage using a signed upload URL (avoids the Vercel 4.5 MB body limit) -> `POST /api/meetings/[id]/process` -> server transcribes with Gemini (audio input, JSON schema, speaker labels, `MM:SS` timestamps) -> normalize to ms, fill `end_ms` from the next segment -> speaker rename step (Speaker 1 -> "Alex", etc.) -> summary (default template) -> action items (if enabled) -> status `ready`.
- UI polls `GET /api/meetings/[id]/status` every 2s. Processing page shows step progress and a skeleton. Failure shows the reason and a Retry.
- **Pre-flight (do first):** run a real 2-minute file through Gemini and check timestamp accuracy before building UI. If drift is over 3 seconds, chunk audio by 5 minutes and offset timestamps.
- **AC:** a real 2-minute self-recorded file becomes a full call page in under 90 seconds.

### F19. Team Calls (P1)
- Seed 3 meetings owned by teammates with `visibility = team`. Same list UI plus owner column. Opening them works like My Calls (read-only for edits, sandboxed highlights allowed).

### F20 / F21 (P2)
- Browser recording: record 16 kHz mono WAV (AudioWorklet or ScriptProcessor + tiny WAV encoder) so Gemini accepts it, then reuse F18.
- Summary language switch (Gemini translation, cached), mini player, keyboard shortcuts beyond Space, points badge animations.

---

## 9. AI pipeline (Gemini)

**SDK and models:** `@google/genai` (unified Google GenAI SDK). Model IDs come from env: `GEMINI_MODEL` (a current Flash model, verify the current ID in Google AI Studio) and `GEMINI_MODEL_FALLBACK` (a Flash-Lite model). Never hardcode IDs in code paths.

**Free-tier constraints (design around them):**
- Low requests per minute and per day. Seed-time generation is paced (sleep between calls, retry with backoff). Runtime calls are minimized by caching.
- Free-tier prompts may be used by Google to improve products. Only synthetic data goes in. Say so in the README.

**Rules:**
1. **Structured output:** use JSON mode with a response schema for transcription, summaries, and action items. Validate with zod before saving. On invalid JSON, retry once with the validation error appended.
2. **Cache everything:** `summaries` unique on (meeting, template, language). Chat suggestion answers pre-generated for seeded calls. Cache key = hash of (meeting, prompt, model).
3. **Backoff:** on 429/503 retry up to 3 times with exponential backoff and jitter, then switch to `GEMINI_MODEL_FALLBACK`, then return a friendly error.
4. **Per-session budget:** max 20 live AI requests per session per hour (429 with a friendly message and remaining time). Protects the key from reviewers hammering it.
5. **Timeouts:** 45s for generation, abort and surface a retry.

**Schemas**

Summary:
```json
{
  "sections": [
    { "heading": "Meeting Purpose", "style": "paragraph", "text": "..." },
    { "heading": "Key Takeaways", "style": "bullets", "bullets": ["..."] },
    { "heading": "Topics", "style": "topics",
      "topics": [{ "title": "...", "start_ms": 0, "bullets": ["..."] }] },
    { "heading": "Next Steps", "style": "bullets", "bullets": ["Owner: task"] }
  ]
}
```
Action items: `[{ "text": "...", "assignee": "Name or null", "start_ms": 0, "due_hint": "Fri or null" }]`

Transcription: `[{ "speaker": "Speaker 1", "start": "MM:SS", "text": "..." }]`

**Prompts (skeletons)**
- *Summary:* "You are a meeting notetaker. Given the timestamped transcript, write the summary using this template: <template sections>. Be faithful to the transcript. Do not invent facts, names, numbers, or dates. Every topic must include the `start_ms` of where it begins. Keep bullets under 25 words."
- *Action items:* "Extract explicit commitments only. Include an assignee when someone was named or clearly volunteered. Use the timestamp where the commitment was made."
- *Ask:* "Answer only from the provided transcript segments and summaries. Cite every factual claim with segment ids in square brackets like [M3S120]. If the answer is not in the material, say you could not find it. Be concise."

**Ask context builder**
- Per call: the entire transcript formatted `[S120] 12:41 Speaker: text` (a 60-minute call is roughly 12k tokens, fits easily).
- Account level: section F13 retrieval. No vector database, no embeddings. Postgres FTS plus long context is the chosen design (log in `DECISIONS.md`).
- Citation ids map server-side to `{meeting_id, start_ms, title}`; the client renders chips.

**Templates:** store template definitions in `lib/templates.ts` (name, description, sections). Adding a template must not require a migration.

---

## 10. Seed data plan

Everything is **synthetic** and must be labeled so in the README and the walkthrough.

### 10.1 Roster (team)
Alex Rivera (demo user, owner), Priya Nair (VP Product), Daniel Okafor (Eng Manager), Mei Lin (Design Lead), Carlos Ramirez (Sales Director), Hannah Weiss (Customer Success), Tom Becker (Data), Aisha Khan (Marketing), Jordan Lee (Finance/Ops). External guests as needed.

### 10.2 Meetings

| # | Title | People | Length | When (rolling) | Owner / visibility |
|---|-------|--------|--------|----------------|--------------------|
| 1 | **Q4 Roadmap Planning** (the star) | 8 | ~60 min | 1 day ago | Alex, my |
| 2 | Discovery Call: Northwind Logistics | 3 (1 external) | ~28 min | 3 days ago | Alex, my |
| 3 | Weekly Engineering Standup | 6 | ~14 min | 3 hours ago | Alex, my |
| 4 | Acme Corp QBR | 4 (2 external) | ~35 min | 5 days ago | Alex, my |
| 5 | 1:1 Priya and Alex | 2 | ~22 min | 7 days ago | Alex, my |
| 6 | Senior Frontend Interview | 3 | ~25 min | 9 days ago | Alex, my |
| 7 | Marketing Launch Sync | 5 | ~18 min | 2 days ago | Aisha, team |
| 8 | Support Escalation Review | 4 | ~20 min | 12 days ago | Hannah, team |

Requirement: "last week" and "this week" queries must always return results. **Store seed timestamps as offsets from request time** so the window rolls forward and the demo never goes stale. Verify at least 3 meetings fall in the previous calendar week on any weekday.

### 10.3 The star meeting: Q4 Roadmap Planning
- 8 speakers with distinct roles and voices, uneven talk time (Priya about 30%, Daniel 20%, others 5 to 12%).
- About 9,000 words, 650 to 800 utterances, with interruptions, filler words, cross-talk, jargon, numbers, dates.
- Content: Q4 priorities, a launch date debate (Nov 4 proposed, Nov 18 agreed later, so Ask can test conflicting statements), pricing change (decision owner is Carlos), hiring freeze impact, customer escalation from Hannah, analytics blockers from Tom, a 3-minute tangent about the offsite.
- 10 to 14 explicit action items with named owners and dates. 2 unresolved questions.
- Topics with clear timestamps (for chapter ticks): at least 7.

### 10.4 Generation pipeline (scripts in `scripts/seed/`)
1. `outlines.json`: per meeting, speakers with personalities, agenda, decisions, action items, planted facts.
2. `gen-transcripts.ts`: call Gemini in chunks of about 10 minutes per request with the outline, the last 15 utterances for continuity, and a target word count. Output `data/transcripts/<slug>.json` as `[{speaker, text}]`. Commit the JSON.
3. `tts.py` (Python, `edge-tts`, no API key): one distinct voice per speaker (mix of US/GB/AU/IN English voices), light rate variation, 250 to 500 ms silence between utterances. Concatenate with ffmpeg. Record exact start/end ms per utterance from measured durations (not estimates). Export **constant bitrate mono MP3 at 32 kbps** for accurate seeking (about 14 MB for 60 min).
4. `import.ts`: write meetings, participants, segments to Postgres, upload audio to Supabase Storage (public bucket `recordings`), set `audio_url`.
5. `gen-ai.ts`: pre-generate all templates, action items, and the four chip answers per meeting. Paced, resumable (skip what exists).
6. Do not commit audio files. Commit scripts, transcripts JSON, and the manifest.
- Run steps 2 and 3 for the star meeting first (in the background) during Phase 1.

---

## 11. Data model (Postgres / Supabase)

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text, color text
);

create table sandbox_sessions (
  id uuid primary key, created_at timestamptz default now(),
  settings jsonb default '{}'::jsonb, onboarding jsonb default '{}'::jsonb, points int default 25
);

create table meetings (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references users(id),
  session_id uuid references sandbox_sessions(id),      -- null for seed content
  title text not null,
  started_at timestamptz,                                -- null for seed rows
  seed_offset_minutes int,                               -- seed rows: started_at = now() - offset
  duration_sec int, source text check (source in ('seed','upload','record','simulated')),
  platform text, visibility text default 'private' check (visibility in ('private','team')),
  status text default 'ready' check (status in ('uploading','processing','ready','failed')),
  error text, audio_url text,
  share_token text unique, share_enabled boolean default false,
  share_parts jsonb default '{"summary":true,"transcript":true,"recording":true}',
  is_external boolean default false, created_at timestamptz default now()
);

create table participants (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade,
  name text not null, is_host boolean default false, is_external boolean default false,
  color text, talk_ms int default 0
);

create table segments (
  id bigserial primary key,
  meeting_id uuid references meetings(id) on delete cascade,
  idx int not null, participant_id uuid references participants(id),
  start_ms int not null, end_ms int not null, text text not null,
  tsv tsvector generated always as (to_tsvector('english', text)) stored
);
create index on segments (meeting_id, idx);
create index on segments using gin (tsv);

create table summaries (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade,
  template text not null, language text not null default 'en',
  content jsonb not null, model text, created_at timestamptz default now(),
  unique (meeting_id, template, language)
);

create table action_items (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade,
  session_id uuid references sandbox_sessions(id),       -- null for AI/seed items
  source text default 'ai' check (source in ('ai','manual')),
  text text not null, assignee text, due_hint text, start_ms int
);
create table action_item_state (
  session_id uuid, action_item_id uuid, done boolean default false,
  primary key (session_id, action_item_id)
);

create table highlights (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade,
  session_id uuid not null, start_ms int not null, end_ms int, note text,
  created_at timestamptz default now()
);

create table clips (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade,
  session_id uuid not null, token text unique not null,
  title text, start_ms int not null, end_ms int not null, created_at timestamptz default now()
);

create table chat_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null, meeting_id uuid,             -- null = account level
  scope text default 'my', title text, created_at timestamptz default now()
);
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_session_id uuid references chat_sessions(id) on delete cascade,
  role text check (role in ('user','assistant')), content text not null,
  citations jsonb default '[]', created_at timestamptz default now()
);

create table ai_cache (key text primary key, value jsonb not null, created_at timestamptz default now());
```

Row-level access is enforced in server code (service role) by filtering `session_id is null or session_id = :current`. Public share and clip routes look up by token only and expose only the shared parts.

---

## 12. API surface (Next.js route handlers)

| Method + path | Purpose |
|---------------|---------|
| `GET /demo` | set session cookie, redirect `/home` |
| `GET /api/meetings?tab=my\|team` | list |
| `GET /api/meetings/[id]` | meeting, participants, segments, default summary, action items, highlights |
| `GET /api/meetings/[id]/summary?template=&lang=` | cached or generate |
| `POST/PATCH/DELETE /api/meetings/[id]/action-items` | manual items, edits, done state |
| `POST/PATCH/DELETE /api/meetings/[id]/highlights` | highlights |
| `POST /api/meetings/[id]/clips` | create clip |
| `PUT /api/meetings/[id]/share` | enable/disable, parts |
| `GET /api/public/share/[token]`, `GET /api/public/clip/[token]` | public read |
| `GET /api/search?q=` | FTS across meetings |
| `POST /api/ask` (SSE) | `{meetingId?, scope, chatSessionId?, message}` |
| `POST /api/uploads/sign` | signed upload URL |
| `POST /api/meetings/[id]/process` | run pipeline (`export const maxDuration = 60`, use `after()`/`waitUntil` for the tail) |
| `GET /api/meetings/[id]/status` | processing progress |
| `GET/PUT /api/settings` | per-session settings |

Return typed JSON, validate inputs with zod, consistent error shape `{error: {code, message}}`.

---

## 13. Tech stack and repo structure

- **Frontend/back end:** Next.js (App Router) + TypeScript + Tailwind. Server components for read paths, client components for player/transcript/chat.
- **UI libs:** Radix primitives or shadcn/ui for popovers, dialogs, dropdowns. `react-virtuoso` for the transcript. `chrono-node` for date phrases. `zod` for validation.
- **DB and storage:** Supabase (Postgres + Storage). Server uses the service role key.
- **AI:** Google Gemini via `@google/genai`.
- **Hosting:** Vercel with GitHub auto-deploy.
- **Seed tooling:** Node/TS scripts + Python `edge-tts` + ffmpeg.

```
/app                 routes (see section 7)
/components          ui, player, transcript, summary, ask, shell, landing
/lib                 db.ts, session.ts, gemini.ts, templates.ts, search.ts, ask.ts, time.ts
/scripts/seed        outlines.json, gen-transcripts.ts, tts.py, import.ts, gen-ai.ts
/data/transcripts    generated transcript JSON (committed)
/supabase/migrations SQL migrations
/docs                design-tokens.md, screenshots
/.agent-logs         committed with every push
AGENTS.md  PRD.md  PROGRESS.md  DECISIONS.md  README.md
```

---

## 14. Environment variables and accounts

| Variable | Source | Notes |
|----------|--------|-------|
| `GEMINI_API_KEY` | Google AI Studio (free) | server only |
| `GEMINI_MODEL` | you | current Flash model ID |
| `GEMINI_MODEL_FALLBACK` | you | Flash-Lite model ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project settings | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | server only, never expose to the client |
| `DATABASE_URL` | Supabase (pooler string) | for seed scripts and migrations |
| `SESSION_SECRET` | `openssl rand -hex 32` | cookie signing |
| `NEXT_PUBLIC_APP_URL` | Vercel URL | for share links |

Accounts: GitHub (public repo), Supabase (free project), Vercel (free, linked to GitHub), Google AI Studio.
Local tools: Node 20+, pnpm or npm, Python 3.11+ with `pip install edge-tts`, ffmpeg on PATH, git, a screen recorder with camera (Loom or similar).
Not needed: Deepgram/AssemblyAI (Gemini transcribes), Zoom/Google OAuth (mocked), any paid service.

---

## 15. Non-functional requirements

- **Performance:** call page interactive under 2s on seed data. Transcript virtualized. `timeupdate` handling under 2ms per tick. No full-array scans in the playback loop.
- **Reliability:** every async UI has loading, empty, and error states. No unhandled promise rejections. Gemini failures never break the page.
- **Security:** service role key server-only. Share tokens unguessable. Public routes expose only shared parts. Validate file type and size on the server, not only the client. No secrets in the repo or logs.
- **Accessibility:** keyboard reachable controls, focus rings, aria labels on icon buttons, contrast at least AA on text.
- **Browsers:** latest Chrome, Edge, Safari. Test audio seeking in Chrome and Safari.
- **Cleanliness:** no console errors on the main flows, no layout shift on load.

---

## 16. Build order (deploy after every phase)

Times are relative to the start of building and assume about 20 working hours plus buffer.

| Phase | Hours | Scope | Done when |
|-------|-------|-------|-----------|
| 0 | 0 to 1.5 | Scaffold, Tailwind tokens, verify tokens against live site, Supabase project + migrations, session cookie, `/demo`, app shell, Vercel deploy | live URL loads signed out, `/demo` reaches an empty `/home` |
| 1 | 1.5 to 4 | Seed pipeline. Start star-meeting transcript + TTS in the background first. Import, then generate AI outputs. Home list populated. Gemini pre-flight test with a 2-minute audio file | home shows 8 meetings with working audio URLs |
| 2 | 4 to 9 | Call page: player, speaker stage, virtualized transcript with sync, summary + templates, action items, transcript search, highlights | sync works on the 60-minute call, template switch works |
| 3 | 9 to 12 | Global search, Ask Fathom per call (streaming + citations + cached chips), account-level Ask panel | citation chips seek the player |
| 4 | 12 to 14 | Share + public page, clips, Team Calls | share link works in a private window |
| 5 | 14 to 16 | Landing page (hard 90 minute box) | `/` matches fathom.ai structure |
| 6 | 16 to 18 | Settings with real effects, onboarding, simulated capture flow | settings change behavior |
| 7 | 18 to 20 | Real upload pipeline (F18), then browser recording if time remains (F20) | real 2-minute file processed end to end |
| 8 | 20 to 22 | Polish, QA checklist (section 18), README, DECISIONS, walkthrough recording | all P0 and P1 acceptance criteria pass |
| Freeze | 02:57 UTC | No new features. Bug fixes only. | |
| Submit | by 05:30 UTC | Final checklist (section 19) | submitted |

**Cut order if behind schedule:** F20/F21 -> F14 clips -> account-level Ask (F13) -> Team Calls -> onboarding detail -> landing detail. **Never cut:** F1 to F12, the 8-person call, the seed audio, or deployment.

---

## 17. Faked, simplified, and cut (state this in the walkthrough and README)

**Faked (simulated):** Zoom/Meet/Teams bot capture, Google and Zoom OAuth, integration Connect buttons, meeting recording consent dialog, points.
**Real:** transcription of uploaded audio, summaries in multiple templates, action item extraction, search, Ask Fathom with citations, highlights, clips, share links, settings effects.
**Simplified:** audio-only playback with a speaker stage instead of video, synthetic seed data, Postgres FTS + long context instead of a vector database, shared demo account with per-visitor sandboxing.
**Cut:** real bot, billing, teams/admin, CRM sync, Trackers/Scorecards, real-time coaching, live summaries, desktop/iOS apps, mobile-first layouts.

---

## 18. QA checklist (Phase 8)

- [ ] Open the live URL in a private window: `/`, `/login`, `/demo`, `/home` all work.
- [ ] 8-person call: play, seek by scrub bar, seek by transcript click, speed change, search, speaker filter, resume auto-scroll.
- [ ] Template switch on 3 calls. Copy Summary and Copy Transcript work.
- [ ] Add a highlight, an action item, check one off. Reload, they persist. Second browser does not see them.
- [ ] Global search finds a phrase and lands on the right timestamp.
- [ ] Ask Fathom per call (chip and free text) with a working citation. Account-level "last week" prompt returns results.
- [ ] Share link and clip link open signed out in a private window and play.
- [ ] Upload a real 2-minute file, watch processing, open the result.
- [ ] Settings changes take effect (default template, bot name, auto action items).
- [ ] Simulated test call completes.
- [ ] Gemini rate-limit path shows a friendly message (temporarily set a bad key on a preview deploy to test).
- [ ] No console errors on the main flows. Works in Chrome and Safari.
- [ ] Landing page compared side by side with fathom.ai.

---

## 19. Submission checklist

- [ ] Live URL deployed on Vercel, opens signed out, `/demo` works.
- [ ] Public GitHub repo, `.agent-logs/` committed and up to date (last commit includes the final logs).
- [ ] README complete: what it is, live URL, how to run, env vars, architecture, what is real vs faked, what was cut and why, seed data is synthetic, free-tier note.
- [ ] `DECISIONS.md` and `PROGRESS.md` committed.
- [ ] No secrets in the repo history (search for `AIza`, `service_role`, `.env`).
- [ ] `.env.example` present.
- [ ] Walkthrough recorded: **camera on, voiceover, under 5 minutes**, public HTTPS link (Loom or similar), link opens in a private window.
- [ ] Submission form: GitHub link (label "GitHub"), live URL (label "Live Deployed URL"), walkthrough link in the walkthrough field, short note.
- [ ] Final commit hash noted, deploy is on that commit.
- [ ] Submitted before 06:27 UTC (target 05:30 UTC).

---

## 20. Walkthrough script (target 4:45, camera on)

| Time | Content |
|------|---------|
| 0:00 to 0:20 | Who I am, what I built, the one decision that shaped everything: capture is simulated, post-capture is real |
| 0:20 to 0:35 | Landing page next to fathom.ai, click through to demo login |
| 0:35 to 1:10 | Home, global search finds a phrase and lands on the timestamp |
| 1:10 to 2:25 | The 8-person, 60-minute call: sync, speaker stage, speaker filter and talk time, template switch, action items |
| 2:25 to 3:00 | Ask Fathom with a citation that jumps the player; account-level "last week" prompt |
| 3:00 to 3:35 | Highlight, create a clip, open the share link in a private window |
| 3:35 to 4:00 | Upload a real file, show processing, show the result |
| 4:00 to 4:45 | What I faked, what I cut, why (Gemini free-tier limits, caching, FTS instead of vectors), what I would build next |

---

## 21. README outline

1. Overview and live URL
2. What is real, simulated, cut (section 17)
3. Architecture diagram (simple)
4. Key decisions (pull from `DECISIONS.md`): audio-only speaker stage, Gemini for transcription, long context + FTS instead of vectors, per-session sandbox, cached AI outputs and pre-generated chips
5. Seed data: synthetic, how generated (transcripts, TTS voices), how to regenerate
6. Local setup: env vars, migrations, seed commands, run
7. Testing notes and known limitations (upload limits, timestamp drift on long audio, free-tier rate limits)
8. Agent usage: `.agent-logs/` explanation