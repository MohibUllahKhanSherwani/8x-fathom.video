# Fathom AI Rebuild — 8x Software Engineer Assignment

> Pixel-faithful, high-performance clone of [Fathom](https://fathom.video) (the #1 AI meeting notetaker) built for the **8x Software Engineer** technical evaluation.

**Author**: Mohib Ullah Khan Sherwani  
**Repository**: [https://github.com/MohibUllahKhanSherwani/8x-fathom.video.git](https://github.com/MohibUllahKhanSherwani/8x-fathom.video.git)  
**Submission Deadline**: 21 Sept 2026, 06:27 UTC (11:27 PKT)  
**Governing Documents**: [PRD.md](file:///d:/Projects/8x_Assignment/PRD.md) • [AGENTS.md](file:///d:/Projects/8x_Assignment/AGENTS.md) • [CAPTURE-TEST.md](file:///d:/Projects/8x_Assignment/CAPTURE-TEST.md) • [PROGRESS.md](file:///d:/Projects/8x_Assignment/PROGRESS.md) • [DECISIONS.md](file:///d:/Projects/8x_Assignment/DECISIONS.md)

---

## 1. Quick Links for Reviewers

- **Direct Demo Sandbox**: `/demo` (bypasses login obstacles, sets a 30-day session cookie, seeds 8 meetings)
- **Star 8-Person 60-Minute Call**: `/calls/829997322` (interactive audio sync, active speaker stage, multi-template summaries, Ask Fathom)
- **Public Read-Only Share**: `/share/demo-share-q4-roadmap` (unauthenticated view with toggleable summary, transcript, and audio)
- **Public Clip Player**: `/clip/launch-decision` (standalone shareable snippet player with jump-to-full-call link)
- **Settings with Functional Effects**: `/settings` (customizable bot name, default summary template, auto-join rules, CRM integrations)
- **Onboarding Flow & Simulated Bot**: `/onboarding` (calendar connect, use case selection, simulated Zoom host permission prompt & recording bot)

---

## 2. Product Judgement & Prioritization (from 8x Brief)

The 8x evaluation emphasizes **Speed**, **Product Judgement**, and **UX/UI Polish**.

### What Was Prioritized First (P0)
1. **The Star 8-Person 60-Minute Meeting**: A full 60-minute executive planning call with 8 distinct speakers, realistic talk-time distribution, cross-talk, debate, and planted facts (Launch Date: Nov 18 vs Nov 4; Pricing: Carlos Ramirez $19/mo Pro tier; Compliance: Daniel Okafor SOC 2 Type II due Oct 15).
2. **Sub-Second Audio-Transcript Synchronization**: Binary-search segment lookup (<100ms), auto-scrolling transcript with manual scroll detection and "Resume Auto-Scroll" pill, active speaker tile highlight with green ring (`#3dbb6b`), and scrubbing bar with chapter ticks & gold highlight markers.
3. **Real-Time Full-Text Search (FTS)**: Global search in TopBar across meeting titles, attendees, summaries, and spoken phrases, with jump-to-timestamp navigation (`/calls/[id]?t=[ms]`) and keyword highlighting.
4. **Ask Fathom with Citations**: Both per-call chat and account-level home panel with clickable timestamp chips (`[MM:SS]`) that seek the media player directly to the exact spoken moment.
5. **Multi-Template Summaries**: Seamless switching between Enhanced (Purpose, Key Takeaways, Topics, Next Steps), General, Sales, and 1-on-1 templates.
6. **Action Items & Highlights**: Checkbox done states, assignee chips, manual item addition from transcript, and scrub bar gold highlight markers.

### What Was Simulated vs Real
- **Simulated**: Live Zoom/Meet/Teams bot join/consent flow (stubbed with native-style host permission dialog and REC state), Google/Zoom OAuth consent screen, CRM connect buttons.
- **Real**: Audio playback & seeking, audio-transcript sync, virtualized transcripts, AI summaries in multiple templates, action item extraction, search, Ask Fathom with citations, highlights, clips, public sharing, and settings persistence.

---

## 3. Architecture & Technical Decisions

| Decision | Choice | Rationale |
| :--- | :--- | :--- |
| **D-001: Capture Layer** | Simulated bot flow, real downstream processing | Building a live headless bot cluster is outside the 1-day window; the brief explicitly favors prioritizing core playback sync, rich transcript UX, and AI insights. |
| **D-002: Framework** | Next.js 15 App Router + TypeScript + Tailwind CSS v4 | Optimal combination of fast server-rendered initial shells and rich client components for synchronized playback. |
| **D-003: Search Engine** | Postgres FTS (`tsvector` + GIN) + Gemini Long-Context | Avoids external vector database drift and latency. Meeting search is lexical and chronological; Gemini's 1M+ token window fits entire meeting transcripts effortlessly. |
| **D-004: Speaker Stage** | Interactive participant grid instead of video canvas | Audio files (~14MB for 60 min at 32 kbps mono MP3 vs >500MB video) enable instant seeking, zero buffering, reliable HTTP range requests, and cross-browser reliability. |
| **D-005: Sandboxing** | `fathom_session_id` Cookie | Allows reviewers to freely test without signing up, while keeping their notes, highlights, and action item completions isolated. |

---

## 4. Key Features Implemented

- **F1: Upload & Processing Pipeline**: Drag-and-drop modal supporting audio/video uploads (`/components/home/UploadModal.tsx`) with animated multi-step progress bar and `/api/upload` endpoint.
- **F2: Audio Player & Speaker Stage**: Custom player with play/pause, seek bar, chapter ticks, 15s skips, speed cycle (`1x`, `1.25x`, `1.5x`, `2x`), volume, and dynamic 2-8 participant grid with live green active speaker ring.
- **F3: Synchronized Virtualized Transcript**: Binary search sync, speaker filter chips, search within transcript, copy full transcript, hover `(+)` to highlight and `(...)` menu to add action items or create clips.
- **F4: Global Search Dropdown**: Keyboard shortcut `/` to focus, grouped results ("Meetings" and "Transcript Moments"), keyboard arrow navigation, and click to jump directly to timestamp (`?t=ms`).
- **F5: Ask Fathom AI**: Single-call tab and account-level home panel supporting `chrono-node` date phrase parsing ("today", "last week", "deadlines"), answering planted facts, and generating clickable citation chips.
- **F6: Multi-Template Summaries**: Enhanced, General, Sales, and 1-on-1 summaries with copy dropdown.
- **F7: Action Items**: Checkbox done states, assignee chips, due hints, and timestamp links.
- **F8: Highlights & Scrub Bar Markers**: Gold markers on the seek bar (`#e8b923`), transcript border accents, and right-column highlight management.
- **F9: Public Sharing**: `/share/[token]` page with granular toggles for summary, transcript, and audio recording.
- **F10: Clips**: `/clip/[token]` page with standalone audio player, speaker quote box, and full-call deep link.
- **F11: Settings**: `/settings` with functional effects for bot name, default summary template, auto-join rules, and simulated CRM integrations.
- **F12: Onboarding Flow**: 3-step wizard with calendar connect, use case selection, and simulated Zoom host permission dialog with live test call recording.

---

## 5. Local Setup Instructions

### Prerequisites
- Node.js 20+
- npm or pnpm
- Python 3.10+ (for `edge-tts` seed audio synthesis, optional)

### Installation
```bash
# 1. Clone repository
git clone https://github.com/MohibUllahKhanSherwani/8x-fathom.video.git
cd 8x-fathom.video

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional, app runs in self-contained demo mode without keys)
cp .env.example .env.local

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page, or [http://localhost:3000/demo](http://localhost:3000/demo) to jump directly into the demo workspace.

---

## 6. Verification & QA Status

- `npm run build`: Passes cleanly with code 0 (11 routes generated).
- `npx tsc --noEmit`: 0 errors.
- `CAPTURE-TEST.md`: Active & verified (Canary 1 & Canary 2 passing, continuous turn logging in `.agent-logs/`).
- Interleaved Commits: `.agent-logs/` committed with every push to GitHub.
