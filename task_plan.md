# Task Plan: Rebuild Frontend with Bespoke Design & Connected Backend

## Objective
Rebuild the frontend with our own original layout and visual design, keeping our idea (AI Meeting Intelligence) and 100% real, connected backend (Supabase DB + Gemini API + real search + synchronized playback). Implement our own product decisions: what we change, what we cut, and how we make it 10x better to use.

---

## Evaluation Criteria (from 8x Feedback)
1. **Our Own Design Choices**: An interface designed by us — not a clone or blueprint copy. Our layout, visual design, and product decisions.
2. **Real & Connected Backend**: Supabase DB, real API routes, real AI summaries, real search, real audio sync — no mock data or hardcoded responses.
3. **Product Judgement**: Clear rationale for what we changed, what we cut, and why it is better.
4. **Clean Code & Commits**: Continuous agent logging in `.agent-logs/` with commits.

---

## Phase Breakdown

- [x] **Phase 9.1: Design Tokens & Foundations**
  - Modern obsidian/slate palette, glassmorphism, dynamic gradients, elevated typography (Inter/Outfit).
  - Update `app/globals.css` with cohesive design tokens and utility classes.

- [x] **Phase 9.2: TopBar & Global Command Center**
  - Re-architect `components/shell/TopBar.tsx`.
  - Omni-search with live keyboard navigation (`/` or `Ctrl+K`), meeting and transcript previews.
  - Retained brand identity "FATHOM" with AI badge.

- [x] **Phase 9.3: Executive Dashboard (`/home`)**
  - Replaced dated subheaders and table with an Executive Meeting Hub:
    - Intelligence Stats Matrix (Meeting hours saved, pending action items, strategic decisions).
    - Quick-filter chips (All, Executive, Product, Client, 1:1s).
    - Rich interactive Meeting Cards with AI summary previews, duration badges, and participant talk-time rings.
    - Dockable Ask Fathom Copilot (Ask AI across calls with citation chips).

- [x] **Phase 9.4: Call Intelligence Room (`/calls/[id]`)**
  - Layout switchers: **Executive Briefing Mode**, **Studio Split Mode**, and **Focus Transcript Mode**.
  - Living Speaker Stage with dynamic talk-time indicators, speaker role badges, and click-to-filter quotes.
  - Interactive multi-speaker timeline & waveform scrubber with chapter tick marks.
  - Sub-100ms synchronized transcript with search highlights, instant quote clipper, and binary-search auto-scroll.
  - Multi-template AI Summaries (Executive Brief, Action Items, Technical Standup, Sales Insights) with 1-click Markdown/Slack export.
  - Action Items matrix with live checkboxes connected to Supabase.

- [x] **Phase 9.5: Public Share & Clip Portals**
  - Modernized `/share/[token]` and `/clip/[token]` pages reflecting the new bespoke visual system.

- [x] **Phase 9.6: Settings & Upload Pipeline Polish**
  - Evolved `/settings` and `UploadModal` into an executive, high-converting product showcase matching the new design language.

- [x] **Phase 9.7: Quality Assurance & Verification**
  - Typecheck passed: `npx tsc --noEmit` 0 errors.
  - Production build passed: `npm run build` 17 routes generated cleanly.
  - Chrome DevTools MCP verified live in browser with screenshots.
  - Script kept local and `.gitignore` updated per user instruction.

---

## Phase 10: Customer Reviews & Complaints Resolution (8x Feedback)
- [x] **10.1: Recording Consent, Awareness & Auto-Record Governance**
  - Settings: Configurable auto-record policies (`Manual Approval Only`, `Internal Only`, `Scheduled Only`) and pre-call chat announcements.
  - Call Page: Live Recording Status & Consent badge with pause/resume controls and participant consent indicators.
- [x] **10.2: Direct Timestamp Deep-Linking & Copy-to-Moment**
  - On every transcript line: "Copy Link to Moment" button (`🔗`) copying `?t=seconds`.
  - On page load: URL query `?t=...` parsing, auto-seeking player and scrolling transcript with radiant highlight.
  - In summary & notes: Timestamp mentions (`[MM:SS]`) with click-to-seek and copy-link triggers.
- [x] **10.3: Calm / Zen Mode to Eliminate UI Clutter & Cognitive Overload**
  - "Calm Mode" toggle on call page reducing visual noise, hiding secondary widgets, and presenting clean typography.
  - Streamlined top bar actions with grouped popover menus and self-explanatory tooltips.
- [x] **10.4: Inline AI Fact-Correction & Human-in-the-Loop Fixes**
  - Inline Edit (`✎`) on summary bullets to directly correct hallucinated or inaccurate numbers/facts.
  - "Flag Inaccuracy / Fix with AI" (`⚑`) popover to supply quick user corrections and re-synthesize targeted sections via Gemini.
  - "Verify Source" (`🔍`) jump button to trace each AI summary point directly to transcript evidence.
- [x] **10.5: QA, TypeScript & Build Pass**
  - Validate TypeScript (`npx tsc --noEmit`), build (`npm run build`), test in browser, and commit alongside `.agent-logs/`.

---

## Phase 11: Purge Internal Leaks & Standardize Realistic Enterprise Data
- [x] **11.1: Purge All Developer/Stack Leaks from User-Facing UI**
  - Removed all exposed badges and labels mentioning internal technologies: "Postgres FTS + Gemini" -> "ENTERPRISE INTELLIGENCE", "Gemini 3.6 Flash Active" -> "Multi-Model Neural Pipeline", "Live AI" -> "Copilot", "Querying Supabase database..." -> "Loading meeting records...".
  - Cleaned all modals, settings, onboarding, and call pages of internal tool names ("Fix with Gemini" -> "Auto-Correct Fact", "Verifying with Gemini" -> "Verifying with transcript", etc.).
- [x] **11.2: Replace Cliché Demo Names with Prestigious Enterprise Brands**
  - Replaced standard placeholders "Acme Corp" / "Acme" with authentic fintech leader **Ramp Enterprise** / **Ramp**.
  - Replaced "Northwind Logistics" / "Northwind" with premier supply chain leader **Flexport Logistics** / **Flexport**.
  - Updated participant roles, meeting slugs, and call descriptions across all datasets and outlines.
- [x] **11.3: Clean Spoken Transcript Dialogues of Internal Architecture Jargon**
  - Removed internal stack trivia from 60-min meeting dialogues and action items ("Postgres FTS with tsvector", "GIN indexing", "Gemini 1-million-token window").
  - Replaced with realistic engineering discussion: direct high-speed search index pipeline, sub-50ms query latency, and neural context window.
- [x] **11.4: Reseed Real Supabase Database & Verify Search**
  - Ran `npx tsx scripts/seed_supabase.ts` with 100% success across all 9 meetings, summaries, action items, and transcripts.
  - Verified live search `/api/search`: queries for "Ramp" and "Flexport" return instant timestamped matches; queries for "Acme" and "Northwind" return 0.
- [x] **11.5: Strict Verification & Commit**
  - `npx tsc --noEmit` passed with 0 errors.
  - `npm run build` passed with 0 errors.
