# proddigi — Estudi de Producció Audiovisual (Barcelona)

Interactive one-page portfolio and showreel application for **proddigi** (`proddigi.com`), an audiovisual production studio based in Barcelona.

## Stack & Architecture

- **Frontend**: Single self-contained semantic HTML5 document (`index.html`) with Vanilla CSS (CSS Custom Properties, native CSS nesting, CSS Grid, `clamp()` fluid typography) and Vanilla JavaScript. Zero CSS utility frameworks.
- **Backend**: Lightweight Express server (`server.ts`) integrating Vite in development and serving live Vimeo metadata endpoints:
  - `GET /api/vimeo/portfolio` — Queries Vimeo REST API v3 when `VIMEO_ACCESS_TOKEN` is configured, or falls back to live Vimeo public oEmbed metadata (`vimeo.com/api/oembed.json`) merged with studio project data.
  - `GET /api/vimeo/showreel` — Returns live Vimeo duration and metadata for the studio showreel.
- **CMS-Ready Data Layer**: All localized copy (`ca`, `es`, `en`) and fallback collection schemas live inside `PRODDIGI_CMS` in `index.html` and `CURATED_PORTFOLIO` in `server.ts`, structured for direct migration to Keystatic CMS collections.

## Environment Variables

Copy `.env.example` and configure optional secrets as needed:

```bash
VIMEO_ACCESS_TOKEN=""   # Optional Vimeo API personal access token
VIMEO_SHOWCASE_ID=""    # Optional Vimeo Showcase / Album ID
```

## Development & Build

```bash
npm install
npm run dev      # Starts Express + Vite dev server on port 3000
npm run build    # Compiles production static bundle to dist/
npm start        # Runs production server via Node 22 native TypeScript support
npm run lint     # Runs tsc --noEmit
```

## Repository Structure

- `index.html` — Complete one-page semantic HTML5, Vanilla CSS, and Vanilla JS application
- `server.ts` — Express server with Vite middleware and `/api/vimeo/*` routes
- `public/images/` — Cinema stills for hero, portfolio projects, and Barcelona studio
- `DESIGN.md` — Visual system, color tokens, typography, and layout rules
- `AGENTS.md` — Architectural constraints and contributor guidelines

---

Desenvolupat a Barcelona per [xarop.com](https://xarop.com).
