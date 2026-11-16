# DESIGN.md — Proddigi Cinema-First Visual System

## 1. Aesthetic Direction

**proddigi** follows a cinema-first editorial minimalism modeled on 16:9 and 2.39:1 screening frames, architectural print monographs, and studio color-grading suites. Every container uses crisp **90-degree straight edges (`border-radius: 0`)** with generous negative space and hairline structural dividers.

## 2. Color System (60-30-10 + Cinema Accent)

### Dark Mode (Default — `data-theme="dark"`)
- **Canvas (`--bg`)**: `#0A0A0B`
- **Elevated Surface (`--surface`)**: `#141416`
- **Hover Surface (`--surface-hover`)**: `#1B1B1E`
- **Primary Ink (`--text`)**: `#F4F4F5`
- **Muted Metadata (`--text-muted`)**: `#8E8E93`
- **Hairline Borders (`--border` / `--border-strong`)**: `rgba(255, 255, 255, 0.12)` / `rgba(255, 255, 255, 0.28)`

### Light Mode (`data-theme="light"`)
- **Canvas (`--bg`)**: `#FAFAFA`
- **Elevated Surface (`--surface`)**: `#FFFFFF`
- **Hover Surface (`--surface-hover`)**: `#F2F2F4`
- **Primary Ink (`--text`)**: `#111113`
- **Muted Metadata (`--text-muted`)**: `#636366`
- **Hairline Borders (`--border` / `--border-strong`)**: `rgba(0, 0, 0, 0.10)` / `rgba(0, 0, 0, 0.26)`

### Cinema Accent (`--accent`)
- **REC / Active Marker**: `#E12D39` (dark) / `#C81E2B` (light)
- Applied with restraint to:
  - Active navigation underline and active portfolio filter underline
  - Showreel play triangle (`▶`)
  - Blinking `REC` camera indicator in `#contacte`

## 3. Typography

- **Primary Sans**: `Plus Jakarta Sans` (400, 500, 600, 700)
- **Technical / Timecode Monospace**: `JetBrains Mono` (400, 500) with `font-variant-numeric: tabular-nums`
- **Fluid Scale**:
  - Hero Headline: `clamp(2rem, 1.4rem + 3vw, 3.65rem)` (`line-height: 1.04`, `text-wrap: balance`)
  - Section Headings: `clamp(1.75rem, 1.45rem + 1.5vw, 2.5rem)`
  - Body Copy: `clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)` (`line-height: 1.6`)
  - Timecodes & Kickers: `clamp(0.75rem, 0.72rem + 0.12vw, 0.8125rem)`

## 4. Layout & Section Architecture

1. **Sticky Header**: Single-row 3-zone grid (`proddigi` wordmark — 5 nav links — `CA / ES / EN` + bare sliding theme switch). Collapses to wordmark + two-line CSS hamburger drawer on viewports `<= 820px`.
2. **Full-Bleed Hero (`#inici`)**: 100% viewport width cinema backdrop (`/images/hero_showreel_frame.jpg`) with measured dark gradient scrim and overlaid headline, subheadline, studio credentials, and discreet showreel trigger.
3. **Portfolio (`#portafoli`)**: Unboxed underlined category filters (`Tots`, `Publicitat`, `Corporatiu`, `Esdeveniments`, `Documental`) and a 2-column CSS Grid of 16:9 `<article>` cards launching a native `<dialog>` Vimeo player.
4. **Services (`#serveis`)**: 4-column typographic capability matrix with hairline top rules.
5. **Studio (`#estudi`)**: Asymmetric editorial split with quantitative studio strip and 4:3 Barcelona Eixample grading suite still.
6. **Contact (`#contacte`) & Footer**: Live `REC` blinking dot indicator, direct Barcelona studio details (`Carrer del Consell de Cent, 315`), minimal inquiry form, and footer credit (`Desenvolupat a Barcelona per xarop.com`).
