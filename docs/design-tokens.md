# Fathom Design Tokens

Extracted and verified from live Fathom (`fathom.video`, `pics_of_flow/`, and DOM references).

---

## 1. Color Palette

### Backgrounds
- `--bg-page`: `#111214` (Deep dark neutral, page background)
- `--bg-canvas`: `#161719` (App shell & body background)
- `--bg-black`: `#000000` (Pure black - used in video player & call page left column)
- `--surface-card`: `#1e2024` (Modal background, transcript bubbles, card surfaces)
- `--surface-card-hover`: `#26292f` (Hover states for cards & bubbles)
- `--surface-input`: `#1e2024` (Search inputs & form fields)
- `--surface-input-focus`: `#282b32`

### Borders & Dividers
- `--border-subtle`: `#26282d` (Dividers, light separators)
- `--border-default`: `#32353c` (Input borders, card borders)
- `--border-active`: `#00b2ea` (Focused inputs, active tab indicators)

### Typography Colors
- `--text-primary`: `#ffffff` (Headings, active buttons, transcript text)
- `--text-secondary`: `#d1d5db` (Body paragraphs, summary text)
- `--text-muted`: `#9a9ba1` (Dates, durations, section uppercase labels)
- `--text-disabled`: `#555861`

### Brand & Accents
- `--accent-cyan`: `#00b2ea` (Fathom logo swoosh, active tab line, primary CTA, active toggles)
- `--accent-cyan-hover`: `#00c5ff`
- `--accent-cyan-subtle`: `rgba(0, 178, 234, 0.12)` (Share button background, active chip hover)
- `--gold`: `#e8b923` (Points star, 30-day preview banner, "Partially Enabled" tag)
- `--gold-bg`: `rgba(232, 185, 35, 0.12)`
- `--success-green`: `#3dbb6b` ("Fully Enabled", active speaker ring)
- `--danger-red`: `#ff4d4f` (REC indicator, End meeting, destructive actions)

---

## 2. Typography

- **Font Family**: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Scale**:
  - `Display / Call Title`: `24px` (`1.5rem`), font-weight: 700 (bold), line-height: 1.2
  - `Section Header`: `12px` (`0.75rem`), font-weight: 600 (semibold), uppercase, letter-spacing: 0.05em, color: `--text-muted`
  - `Subheading / Purpose`: `16px` (`1rem`), font-weight: 600 (semibold), color: `--text-primary`
  - `Body / Transcript`: `14px` (`0.875rem`), font-weight: 400 (regular), line-height: 1.5, color: `--text-primary`
  - `Meta / Timestamps`: `12px` (`0.75rem`), font-weight: 500 (medium), color: `--text-muted`

---

## 3. Radii & Spacing Metrics

- **Border Radii**:
  - Pill / Rounded Full: `9999px` (Search inputs, status badges, chip buttons)
  - Cards & Modals: `10px`
  - Transcript Bubbles: `10px`
  - Buttons: `8px`
  - Floating video player: `12px`
- **Heights**:
  - Top Bar: `56px`
  - Primary Buttons: `38px`
  - Search Input: `36px`
  - Transcript Bubble Padding: `10px 14px`
