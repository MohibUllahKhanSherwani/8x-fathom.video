# 8x Assignment — Agent Operating Rules & Context

Source of Truth: [PRD.md](file:///d:/Projects/8x_Assignment/PRD.md)
Assignment: Clone Fathom AI (`fathom.video`) — 8x Software Engineer Assignment
Deadline: 21 Sept 2026, 06:27 UTC (11:27 PKT)
Feature Freeze: 21 Sept 2026, 02:57 UTC
Submission Target: 21 Sept 2026, 05:30 UTC

---

## 1. Evaluation Criteria (from 8x Brief)
1. **Speed**: How much working, high-fidelity product is built within the window.
2. **Product Judgement**: What was prioritized first (core playback sync, star 8-person 60-min call, search, AI summaries), what was left out, and clear architectural rationale.
3. **UX & UI**: Pixel-faithful reproduction of Fathom (`fathom.video`), smooth micro-interactions, responsive audio-transcript sync, no dead links or dummy buttons.

---

## 2. Core Deliverables Required for Submission
- **Live Deployed URL**: Hosted on Vercel, accessible to unauthenticated reviewers without login obstacles (via `/demo`).
- **Public GitHub Repository**: Clean commit history with `.agent-logs/` committed side-by-side with code changes.
- **Walkthrough Video**: Under 5 minutes, camera ON, voiceover, public HTTPS link (Loom or similar).
- **`CAPTURE-TEST.md`**: Verified and green before building.
- **`PROGRESS.md` & `DECISIONS.md`**: Updated after every phase.

---

## 3. Operating Rules (Section 0 of PRD & 8x Brief)
1. **Source of Truth**: `PRD.md` and the 8x assignment brief govern all feature scopes, acceptance criteria, and architectures. Follow section 0 and section 16 strictly. Never forget or deviate from the PRD and 8x requirements.
2. **Side-by-Side Commits & Capture Logs**: Commit frequently alongside implementation. `.agent-logs/` must be committed and pushed with EVERY commit. Never rewrite history or delete entries.
3. **Capture Test Integrity**: Keep `CAPTURE-TEST.md` updated and verify that automatic turn logging remains active throughout the entire project lifecycle.
4. **Phase Execution**: Work strictly phase-by-phase. Each phase ends with:
   - Typecheck and lint pass (`npm run lint` / `npx tsc --noEmit`)
   - Commit & push interleaved with `.agent-logs/`
   - Verification in a private window / clean state
   - Checkbox ticked in `PROGRESS.md`
   - Key decisions logged in `DECISIONS.md`
5. **Prioritize What Matters (Product Judgement)**:
   - Star meeting (8-person, 60-minute call with planted facts)
   - Media & transcript sync (<100ms accuracy, auto-scroll, speaker identification)
   - Real search (Postgres FTS across transcripts and metadata)
   - Real AI summaries in multiple templates & Ask Fathom with citations
6. **No Dead Ends**: No lorem ipsum. Every button and control must either work, be clearly labeled as simulated, or be removed.
7. **Human Escalations**: Only ask the human for:
   - API keys and accounts (`.env` credentials from PRD section 14)
   - Approval for destructive actions
   - Decisions not covered in `PRD.md`
8. **Design Fidelity**: Adhere to verified design tokens in `docs/design-tokens.md` extracted from live Fathom (`pics_of_flow/` and DOM).
9. **Simulated vs Real Boundaries**:
   - **Simulated**: Zoom/Meet/Teams bot capture, Google/Zoom OAuth consent, integration Connect buttons, points.
   - **Real**: Audio-transcript sync, virtualized transcripts, AI summaries in multiple templates, action item extraction, search, Ask Fathom with citation chips, highlights, clips, share links, settings effects.


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
