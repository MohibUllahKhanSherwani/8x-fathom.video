# Architecture & Engineering Decisions

Log of all key technical decisions, trade-offs, and rationale for the Fathom clone build.

---

### D-001: Architecture & Scope Split (Simulated Capture vs Real Processing)
- **Decision**: Simulate the live Zoom/Meet/Teams bot join/consent flow, but keep all downstream processing, playback, transcripts, AI summaries, search, and sharing 100% real.
- **Rationale**: Live video conferencing bots require dedicated infrastructure, reverse-engineered protocol wrappers, or paid headless bot clusters. The 8x brief explicitly allows stubbing the capture layer to focus engineering effort on media synchronization, rich transcript UX, and AI insights.

### D-002: Next.js App Router + TypeScript + Tailwind CSS
- **Decision**: Use Next.js 15 (App Router) with React 19, TypeScript, and Tailwind CSS v4 / modern CSS variables.
- **Rationale**: Optimal for server components (fast initial renders, SEO, zero-client-JS layouts) combined with rich client components for audio sync, virtualized transcripts, and streaming AI chat.

### D-003: Postgres Full-Text Search (FTS) + Long Context over Vector DB
- **Decision**: Use Postgres built-in FTS (`tsvector` + GIN index) paired with Gemini's large context window (1M+ tokens) instead of a standalone vector database.
- **Rationale**: Meeting transcripts are inherently chronological and lexical. Users search for exact spoken phrases, names, and topics. Gemini's massive context window easily fits entire meetings or multi-call summaries, avoiding embedding latency, vector drift, and external vector DB infrastructure overhead.

### D-004: Speaker Stage instead of Video Stream
- **Decision**: Render an audio-driven speaker stage (interactive grid of participants with dynamic active-speaker borders and talk-time indicators) instead of a full video canvas.
- **Rationale**: Audio files are significantly smaller (~14MB for 60 min at 32 kbps mono MP3 vs >500MB for video), enabling instant seeking, lower bandwidth, reliable HTTP range requests, and eliminating video codec compatibility issues across browsers.

### D-005: Per-Visitor Sandbox via Cookie Session
- **Decision**: Use an httpOnly `session_id` cookie for visitors. Seed meetings are shared and read-only; visitor highlights, notes, action item completions, uploads, and chat history are isolated to their session.
- **Rationale**: Allows reviewers to freely test without signing up, while keeping their state private and preventing mutual state collisions.

### D-006: UI Exact Parity via Ground-Truth Flow Captures
- **Decision**: Redesign TopBar, HomePage, AskFathomPanel, CallPage, and SettingsPage to replicate pixel-for-pixel the ground truth flow captures in `pics_of_flow/` (`1.png` to `18.png`) and the live home screenshot.
- **Rationale**: The 8x rubric heavily weights UX & UI fidelity to `fathom.video`. Incorporating the exact 16:9 thumbnail view, subheader navigation tabs (`My Calls`, `Team Calls`, `Playlists`, `Alerts`, `Deals`), gold announcement banner, and overlay video controls creates an indistinguishable clone.

### D-007: Dual Support for Real Test Call & 8-Person 60-Min Star Call
- **Decision**: Include both the authentic 2-minute "Test call" (meeting `829997322` matching the user's flow and screenshot 15.png) and the full 8-person 60-minute "Q4 Roadmap Planning" call (meeting `829997321` with all planted facts required by the 8x brief).
- **Rationale**: Satisfies both the user's visual expectation of seeing their exact test call from the screenshots and the reviewer's evaluation criteria of inspecting the 8-person, 60-minute roadmap call.

### D-008: Fail Loudly Architecture with Gemini 3.6 Flash
- **Decision**: Eliminate silent fallbacks in `/api/ask` and `/api/health`. Use Google's recommended `gemini-3.6-flash` model and require a valid `GEMINI_API_KEY` in environment.
- **Rationale**: The user explicitly instructed to "fail loudly" if an LLM or database is missing or fails. `gemini-3.6-flash` is fast (~1s latency), reliable, and handles complex multi-meeting reasoning without 503 throttling.

### D-009: Secret Scrubbing in Agent Logs
- **Decision**: Implement automatic API key redaction in `.agents/scripts/capture_turn.py` before committing `.agent-logs/`.
- **Rationale**: Protects secrets from being leaked to GitHub and prevents GitHub Push Protection rejections.

### D-010: 100% Database-Driven Production Architecture
- **Decision**: Completely eliminate in-app static seed data dependencies from the UI. Home page, Call page, Share page, and Clip page dynamically fetch data from Supabase via API routes.
- **Rationale**: The product must be true production-grade: meetings, participants, segments, summaries, and action items are queried live from Supabase PostgreSQL. Summary templates are generated on-demand via Gemini `gemini-3.6-flash` and cached in the database. Action items persist checked states and new items directly to the database. Global search executes live PostgreSQL Full-Text Search via GIN-indexed `tsv`.

### D-011: Landing Page & Pricing Overhaul with Real Content & Exact User Screenshot Parity
- **Decision**: Rebuild the landing page (`app/page.tsx`) to match the user's live screenshots 1-5 from `fathom.video` (announcement banner, dark starry space hero with floating astronaut and UI cards, social proof, retro rocket section, clarity neon portal, and 3-pillar stats). Create a real `/pricing` page matching `fathom.video/pricing` with full comparison matrix. Update home page to use `My Calls ⌵` dropdown selector for `Team Calls`.
- **Rationale**: The user provided screenshots from live Fathom and requested zero stubs. Scraping and replicating real content from `fathom.video` and `fathom.video/pricing` ensures the application is completely authentic, functional, and faithful to the production product.



