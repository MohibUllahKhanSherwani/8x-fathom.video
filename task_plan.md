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

- [ ] **Phase 9.1: Design Tokens & Foundations**
  - Modern obsidian/slate palette, glassmorphism, dynamic gradients, elevated typography (Inter/Outfit).
  - Update `app/globals.css` with cohesive design tokens and utility classes.

- [ ] **Phase 9.2: TopBar & Global Command Center**
  - Re-architect `components/shell/TopBar.tsx`.
  - Omni-search with live keyboard navigation (`/` or `Ctrl+K`), meeting and transcript previews.
  - Clean brand identity ("Cortex" / AI Meeting OS).

- [ ] **Phase 9.3: Executive Dashboard (`/home`)**
  - Replace dated subheaders and table with an Executive Meeting Hub:
    - Intelligence Stats Matrix (Meeting hours saved, pending action items, strategic decisions).
    - Quick-filter chips (All, Executive, Product, Client, 1:1s).
    - Rich interactive Meeting Cards with AI summary previews, duration badges, and participant talk-time rings.
    - Dockable Cortex Copilot (Ask AI across calls with citation chips).

- [ ] **Phase 9.4: Call Intelligence Room (`/calls/[id]`)**
  - Layout switchers: **Executive Briefing Mode**, **Studio Split Mode**, and **Focus Transcript Mode**.
  - Living Speaker Stage with dynamic talk-time indicators, speaker role badges, and click-to-filter quotes.
  - Interactive multi-speaker timeline & waveform scrubber with chapter tick marks.
  - Sub-100ms synchronized transcript with search highlights, instant quote clipper, and binary-search auto-scroll.
  - Multi-template AI Summaries (Executive Brief, Action Items, Technical Standup, Sales Insights) with 1-click Markdown/Slack export.
  - Action Items matrix with live checkboxes connected to Supabase.

- [ ] **Phase 9.5: Public Share & Clip Portals**
  - Modernized `/share/[token]` and `/clip/[token]` pages reflecting the new bespoke visual system.

- [ ] **Phase 9.6: Landing Page & Marketing Polish**
  - Evolve `/` into an executive, high-converting product showcase matching the new design language.

- [ ] **Phase 9.7: Quality Assurance, Verification & 1-Minute Video Script**
  - Run `npm run lint` and `npm run build`.
  - Verify in browser using DevTools MCP.
  - Write `ONE_MINUTE_VIDEO_SCRIPT.md` providing Mohib with high-impact talking points for his 8x intro video.
