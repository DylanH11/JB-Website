# MILESTONES.md

Tracking table for all planned, in-progress, and completed milestones.
The agent updates this file at the start and end of every milestone.

**Status values:** `Planned` · `In Progress` · `Complete` · `Blocked`

---

| # | Slug | Description | Status | Branch | Notes |
|---|------|-------------|--------|--------|-------|
| 1 | `foundation` | Vite + React + TS scaffold, CSS design tokens, app shell with routing, CI pipeline wired, deploys to GitHub Pages | Planned | `feat/foundation` | First milestone — sets up everything the rest builds on. Must include a passing Vitest run and a successful `pnpm build` before merge. |
| 2 | `design-system` | All reusable UI primitives: Button, Badge, Input, Textarea, Select, Modal shell, custom cursor, typography scale — all styled to the design tokens | Planned | `feat/design-system` | No page sections yet. Components only. Each component gets a basic render test. |
| 3 | `nav-hero` | Fixed nav with inline SVG logo, hero section with Great Vibes script heading + Cormorant serif, artwork SVG panel, animated marquee strip | Planned | `feat/nav-hero` | Pixel-faithful to the prototype. Scroll-triggered nav border. No scroll hint indicator. |
| 4 | `about-section` | About section: stacked rotated frames, studio copy, stats row (100+ works / 5★ / 48h reply) | Planned | `feat/about-section` | Stacked frames are CSS transform only — no JS. Stats are hardcoded in `artworks.ts` config object. |
| 5 | `gallery-grid` | Gallery section: 12-column masonry grid, ArtworkCard with hover reveal overlay, type badge (Print / Original / Both), enquiry button triggers modal shell | Planned | `feat/gallery-grid` | No prices shown. Badge values come from `artworks.ts`. Grid layout via CSS grid — no JS masonry library. |
| 6 | `enquiry-modal` | Enquiry modal: full form (name, email, format preference, size, message), client-side validation, success state, error state. Unit tests for all validation logic. | Planned | `feat/enquiry-modal` | Validation lives in `src/utils/validation.ts` — pure functions, fully tested. Modal uses focus trap. |
| 7 | `commissions-form` | Custom order section: 4-step process display, order form (name, email, type dropdown, description, size, budget, deadline), validation, success/error states, unit tests | Planned | `feat/commissions-form` | Reuses validation utils from milestone 6. Form submission is frontend-only — displays success message. Instructions for connecting Formspree in README. |
| 8 | `contact-section` | Contact section: Instagram link, email link, general message form (name, email, subject, message), validation, success/error, unit tests | Planned | `feat/contact-section` | Reuses validation utils. Matches two-column layout from prototype. |
| 9 | `data-layer` | Extract all gallery content and site config to `src/data/artworks.ts`. Typed `Artwork` and `SiteConfig` interfaces. File is owner-editable with inline plain-English comments on every field. | Planned | `feat/data-layer` | This is the milestone that makes the site maintainable without a developer. README gets "Updating your artwork" section. |
| 10 | `performance` | Lazy-load all artwork images, route-level code splitting, Lighthouse mobile audit, fix any score <90 on Performance. Add `loading="lazy"` and correct `width`/`height` to prevent CLS. | Planned | `feat/performance` | Run Lighthouse in CI via `lighthouse-ci` or document the manual audit result in the log. |
| 11 | `accessibility` | WCAG AA audit: colour contrast on all text, full keyboard navigation, ARIA labels on all interactive elements, focus management in modals, skip-to-content link | Planned | `feat/accessibility` | Use `axe-core` via `@axe-core/react` in dev mode. Document findings and fixes in the log. |
| 12 | `polish` | Scroll-reveal animations (Intersection Observer, no library), hover transition pass, footer, meta tags, Open Graph image, favicon generated from logo SVG | Planned | `feat/polish` | Final milestone. App should score ≥90 Lighthouse across all categories after this. |
