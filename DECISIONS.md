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
