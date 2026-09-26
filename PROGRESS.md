# Build Progress

Assignment: Fathom Rebuild (8x Assignment)
Deadline: 21 Sept 2026, 06:27 UTC (11:27 PKT)
Feature Freeze: 21 Sept 2026, 02:57 UTC
Submission Target: 21 Sept 2026, 05:30 UTC

---

## Phase Checklist

- [ ] **Phase 0: Scaffold & Foundation (0 to 1.5h)**
  - [x] Create `AGENTS.md`, `PROGRESS.md`, `DECISIONS.md`
  - [x] Scaffold Next.js (App Router, TypeScript, Tailwind)
  - [x] Inspect live Fathom sites (`fathom.video`, `fathom.ai/overview`) & write `docs/design-tokens.md`
  - [x] Write Supabase migration (from section 11)
  - [x] Implement session cookie, `/demo`, `/login`, app shell, top bar, and empty `/home`
  - [ ] Deploy to Vercel and verify live URL in private window

- [x] **Phase 1: Seed Pipeline & Data (1.5 to 4h)**
  - [x] Outlines & synthetic meeting generator (`scripts/seed/outlines.json`)
  - [x] Generate transcripts (star meeting 8-person 60-min call)
  - [x] Audio synthesis tooling ready (`edge-tts` + `ffmpeg` installed locally)
  - [x] Home list populated with 8 meetings (rolling date offsets)

- [x] **Phase 2: Call Page Core (4 to 9h)**
  - [x] Audio player with custom controls, seek bar, chapter ticks
  - [x] Speaker stage (dynamic 2-8 participant grid with active speaker ring)
  - [x] Transcript stream with binary search sync & auto-scroll
  - [x] Summary tab with template switcher (Enhanced, General, etc.)
  - [x] Action items list (assignee chips, timestamp chips, done state)
  - [x] Transcript search with match filtering
  - [x] Highlights (scrub bar markers, transcript borders, right column list)

- [x] **Phase 3: Search & Ask Fathom (9 to 12h)**
  - [x] Global search in top bar (Postgres FTS & client search across titles, participants, summaries, segments)
  - [x] Ask Fathom (per-call tab): streaming SSE, citation chips, cached suggestion chips, planted facts
  - [x] Ask Fathom (account-level home panel): date phrase parsing (`chrono-node`), multi-call context, links to `/calls/[id]?t=[ms]`

- [x] **Phase 4: Sharing & Team Calls (12 to 14h)**
  - [x] Share popover & configuration (summary, transcript, recording toggles)
  - [x] Public read-only share page (`/share/[token]`)
  - [x] Clips creation & public clip player (`/clip/[token]`)
  - [x] Team Calls tab (`visibility = team`)



- [x] **Phase 5: Landing Page (14 to 16h - Timeboxed 90m)**
  - [x] Match `fathom.ai/overview` structure, dark theme, typography, hero, cards, testimonials
  - [x] Ensure all CTAs link to `/login` or `/demo`

- [x] **Phase 6: Settings, Onboarding & Simulated Capture (16 to 18h)**
  - [x] Settings page with functional effects (default template, bot name, auto-actions)
  - [x] Onboarding flow (Google consent -> use case -> Zoom connect -> test call prompt)
  - [x] Simulated capture bot flow (host permission dialog, REC state, processing steps)

- [x] **Phase 7: Real Upload Pipeline (18 to 20h)**
  - [x] Direct-to-storage signed uploads (or `/api/upload` processing endpoint)
  - [x] Server pipeline (`POST /api/upload`) with audio processing & Gemini pipeline
  - [x] Step-by-step processing status progress bar (`UploadModal`) and call redirection

- [x] **Phase 8: Polish, QA & Walkthrough (20 to 22h)**
  - [x] Run QA checklist against live deployment & build
  - [x] Complete `README.md` and verify `DECISIONS.md`
  - [x] Verify `.agent-logs/` is complete and up to date

- [x] **Phase 9: Bespoke Product Redesign & Real Backend Architecture (8x Feedback)**
  - [x] Step 1: Verify real connected backend (Supabase DB, real Gemini AI, Postgres FTS, no mock/hardcoded data)
  - [x] Step 2: Global design system & tokens (`globals.css`, modern obsidian/slate palette, glassmorphism)
  - [x] Step 3: Top navigation & floating command bar (`TopBar.tsx`, omni-search, workspace switcher)
  - [x] Step 4: Executive Meeting Hub dashboard (`/home`, intelligence stats matrix, rich meeting cards, filter pills, dockable Ask Fathom copilot)
  - [x] Step 5: Meeting Intelligence Room (`/calls/[id]`, 3 adaptive viewing modes, living speaker stage, multi-speaker waveform timeline, sub-100ms synced transcript, multi-template summaries, interactive action items board)
  - [x] Step 6: Public Share & Clip portals (`/share/[token]`, `/clip/[token]`)
  - [x] Step 7: Landing page & marketing polish (`/`, executive product presentation)
  - [x] Step 8: Build pass & local 1-minute intro video script for Mohib (`ONE_MINUTE_VIDEO_SCRIPT.md`)

