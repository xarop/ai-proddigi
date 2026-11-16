# AGENTS.md — Engineering & Architecture Guidelines

This document defines the strict architectural constraints for maintaining and extending the **proddigi** codebase.

## Core Technical Rules

1. **No CSS Utility Frameworks in `index.html`**
   - Do **not** introduce Tailwind CSS, Bootstrap, or utility-class frameworks into `index.html`.
   - Write clean semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<figcaption>`, `<dialog>`, `<footer>`) and Vanilla CSS using CSS Custom Properties and native CSS nesting.
2. **Straight-Edge Cinema Geometry**
   - Maintain `border-radius: 0` across all frames, thumbnails, cards, inputs, buttons, and `<dialog>` modals.
3. **Theme & Icon Restraint**
   - Default to Dark Mode (`html[data-theme="dark"]`) and support Light Mode (`html[data-theme="light"]`).
   - Keep the theme toggle minimal with no text labels and no sun/moon icons.
   - Avoid decorative stock icons inside the Services (`#serveis`) grid.
   - The blinking crimson `REC` indicator (`#contacte`) is the sole intentional status pulse in the UI.
4. **Multilingual Consistency (`ca` / `es` / `en`)**
   - Every visible string and accessibility label must be defined across `ca`, `es`, and `en` in `PRODDIGI_CMS.i18n`.
   - Changing language must immediately re-render static `[data-i18n]` elements, dynamic portfolio cards, filter tabs, services, form placeholders, and subsequent `<dialog>` opens.
5. **Vimeo API & Server Architecture (`server.ts`)**
   - Keep Vimeo access tokens strictly server-side (`process.env.VIMEO_ACCESS_TOKEN`). Never expose secrets or render API-key input forms in the UI.
   - Keep `server.ts` compatible with both `tsx server.ts` and Node 22 native TypeScript execution (`node server.ts`) by avoiding non-erasable TypeScript syntax such as `enum` or constructor parameter properties.
   - Always clear the Vimeo `<iframe>` inside `#vimeo-modal` on close/Escape so audio stops immediately.
6. **Scrollspy & Motion Performance**
   - Only animate compositor properties (`opacity`, `transform`).
   - Respect `@media (prefers-reduced-motion: reduce)`.
   - Keep programmatic smooth-scroll locking intact so intermediate sections do not flicker active navigation states during anchor jumps.

## Verification Checklist

Before completing any change, run:

- `npm run build` (`vite build`)
- `npm run lint` (`tsc --noEmit`)
- Verify `/api/vimeo/portfolio` and `/api/vimeo/showreel` return valid JSON.
