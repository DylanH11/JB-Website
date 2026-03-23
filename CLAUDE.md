# CLAUDE.md — Agent Operating Instructions

> This file is the agent's primary directive. Read it in full at the start of every session before touching any file or running any command.

---

## Project Identity

**JB Designs** is an e-commerce and portfolio site for an original artwork studio. Customers can browse a gallery of prints and originals, enquire about specific pieces, and submit custom order requests. The owner sets prices and responds to enquiries directly; the site does not process payments autonomously.

The live product must feel like a premium, independent art studio — warm, human, unhurried. It is not a SaaS dashboard. It is not a template. Every design decision should pass the question: *would a real art buyer trust this with their money?*

---

## What "Good" Looks Like

This is a qualitative target, not a checkbox list. The agent should hold this standard in mind when making every implementation and design decision.

- **Feels handmade, not generated.** Typography, spacing, and colour feel considered. Nothing looks like a Bootstrap default or a Tailwind starter.
- **Fast.** Lighthouse performance score ≥ 90 on mobile. Images are lazy-loaded and correctly sized. No layout shift.
- **Accessible.** WCAG AA contrast on all text. All interactive elements are keyboard-navigable. Forms have proper labels.
- **Honest.** No dark patterns. No fake urgency. No placeholder prices. The enquiry flow is transparent.
- **Maintainable.** The owner (non-developer) can update artwork titles, descriptions, and availability by editing a single data file. No CMS required.
- **Resilient.** Every form submission has a clear success and error state. The app does not silently fail.
- **Tested.** Every piece of business logic (form validation, data transforms, enquiry state) has a unit test. UI smoke tests cover critical flows.
- **Shippable at every milestone.** Merging to `develop` always leaves the app in a state that could be deployed to production today.

---

## Self-Directed Workflow

The agent operates autonomously through the full milestone cycle. It does **not** pause between milestones to ask for permission or confirmation. The workflow for each milestone is:

```
1. PLAN
   - Read MILESTONES.md and identify the current milestone.
   - Read AGENT_LOG.md to understand what was done last.
   - Write a plan section in AGENT_LOG.md for this milestone before writing any code.

2. BRANCH
   - Create a feature branch from develop: git checkout -b feat/<milestone-slug> develop

3. IMPLEMENT
   - Build the milestone scope. Stay strictly within scope — do not implement future milestone features.
   - Commit atomically: each commit does one thing and has a clear message.
   - Commit message format: <type>(<scope>): <what> — e.g. feat(gallery): add artwork card hover state

4. TEST
   - Run the full test suite: pnpm test --run
   - Run the build: pnpm build
   - Fix any failures before proceeding. Do not merge a failing branch.

5. EVALUATE
   - Assess the milestone against "What Good Looks Like" above.
   - Note anything that fell short and whether it warrants a follow-up task.

6. LOG
   - Write the completed milestone entry in AGENT_LOG.md (Plan / Implementation notes / Test results / Evaluation / Next milestone).
   - Update MILESTONES.md: mark this milestone Complete, update notes.

7. MERGE
   - git checkout develop
   - git merge --no-ff feat/<milestone-slug> -m "merge: feat/<milestone-slug> into develop"
   - Do not delete the branch (leave it for history).

8. ADVANCE
   - Mark the next milestone In Progress in MILESTONES.md.
   - Begin immediately from step 1.
```

If tests fail: fix on the feature branch, do not merge until green. If a blocker is genuinely unresolvable without external input, write the blocker clearly in AGENT_LOG.md and stop — do not merge a broken branch.

---

## Git Workflow

```
main        ← production-ready. Only receives merges from develop via PR. Never commit here directly.
develop     ← integration branch. All feature branches merge back here.
feat/<slug> ← one branch per milestone. Branched from develop. Merged back with --no-ff.
```

### Rules (non-negotiable)

- **Never** `git push --force` or `git push --force-with-lease` to `develop` or `main`.
- **Never** commit directly to `develop` or `main`.
- **Never** merge a branch with failing tests.
- Always merge with `--no-ff` to preserve branch history.
- Keep commits small and atomic. One logical change per commit.
- Tag releases: after every milestone merge, `git tag milestone/<slug>`.

### Commit Message Format

```
<type>(<scope>): <imperative description>

Types: feat | fix | style | refactor | test | chore | docs
Scope: gallery | enquiry | nav | hero | about | commissions | contact | worker | data | ci

Examples:
  feat(gallery): add masonry grid layout with hover reveal
  fix(enquiry): prevent form submission with empty email
  test(enquiry): add unit tests for form validation logic
  chore(ci): add vitest step to deploy workflow
```

---

## Project Structure

```
jb-designs/
├── .claude/
│   └── settings.local.json       # Claude Code permissions
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD pipeline
├── public/
│   └── images/
│       └── artwork/              # Owner drops artwork images here
│           └── .gitkeep
├── src/
│   ├── assets/                   # SVGs, fonts, static assets
│   ├── components/               # React components
│   │   ├── layout/               # Nav, Footer, Layout wrapper
│   │   ├── sections/             # Hero, About, Gallery, Commissions, Contact
│   │   ├── ui/                   # Buttons, Modal, Badge, Input, etc.
│   │   └── gallery/              # GalleryGrid, ArtworkCard, EnquiryModal
│   ├── data/
│   │   └── artworks.ts           # THE file the owner edits to update the gallery
│   ├── hooks/                    # Custom React hooks
│   ├── types/                    # TypeScript interfaces and types
│   ├── utils/                    # Pure utility functions (validation, formatting)
│   ├── workers/                  # Web Workers (if/when needed for heavy processing)
│   ├── styles/
│   │   └── tokens.css            # CSS custom properties (design tokens)
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── tests/
│   ├── unit/                     # Vitest unit tests
│   └── smoke/                    # UI smoke tests (Vitest + @testing-library/react)
├── AGENT_LOG.md
├── CLAUDE.md
├── MILESTONES.md
├── README.md
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### The Data File (`src/data/artworks.ts`)

This is the single source of truth for all gallery content. The owner should be able to update it without understanding React. Keep it simple: an exported array of `Artwork` objects. Comments in the file should explain every field in plain English.

---

## Tech Stack

| Layer         | Choice                              | Rationale                                              |
|---------------|-------------------------------------|--------------------------------------------------------|
| Framework     | React 18 + TypeScript               | Type safety, component model, ecosystem                |
| Bundler       | Vite                                | Fast dev server, straightforward config                |
| Testing       | Vitest + @testing-library/react     | Co-located with Vite config, fast, no jest compat shim |
| Styling       | Vanilla CSS + CSS custom properties | No runtime overhead, matches existing design system    |
| State         | React built-ins (useState, useReducer, Context) | No Redux needed at this scale             |
| Heavy work    | Web Worker                          | Keeps main thread free; use if any task >16ms          |
| Deployment    | GitHub Pages via Actions            | Free, sufficient, no server needed                     |
| Package mgr   | pnpm                                | Faster installs, strict dependency resolution          |

### Architecture Principles

- **No external UI libraries.** Components are hand-written. This is intentional — the design must feel unique.
- **No CSS frameworks.** Tailwind, Bootstrap, etc. are banned. Use the design tokens in `tokens.css`.
- **No simulation or domain libraries** unless explicitly added to this file. Core logic is hand-written.
- **Web Worker for anything heavy.** The main thread renders UI. It does not compute.
- **Data is co-located with types.** `artworks.ts` imports from `types/`. Never the other way.
- **Components are dumb where possible.** Business logic lives in hooks and utils, not JSX.
- **Every util function is pure and tested.** If it has logic, it has a test.

---

## Milestone Roadmap

Each milestone is scoped to a single focused session. The app is shippable after every merge to `develop`.

| # | Slug | Description |
|---|------|-------------|
| 1 | `foundation` | Vite + React + TS scaffold, CSS tokens, routing shell, CI pipeline wired, deploys to GitHub Pages |
| 2 | `design-system` | All reusable UI primitives: Button, Badge, Input, Textarea, Select, Modal shell, custom cursor, typography scale |
| 3 | `nav-hero` | Fixed nav with SVG logo, hero section with script/serif heading, artwork panel, marquee strip |
| 4 | `about-section` | About section: stacked frames, studio copy, stats row |
| 5 | `gallery-grid` | Gallery section: masonry grid, ArtworkCard with hover reveal, type badge (print/original/both), enquiry trigger |
| 6 | `enquiry-modal` | Enquiry modal: form, validation, success/error states, unit tests for all validation logic |
| 7 | `commissions-form` | Custom order section: process steps, full order form, validation, success/error states, unit tests |
| 8 | `contact-section` | Contact section: Instagram link, email link, general contact form, validation, success/error states |
| 9 | `data-layer` | Extract all content to `src/data/artworks.ts`, typed `Artwork` interface, owner-editable with inline comments |
| 10 | `performance` | Lazy-load images, route code splitting, Lighthouse audit, fix any score <90 on mobile |
| 11 | `accessibility` | WCAG AA audit: contrast, keyboard nav, ARIA labels, focus management in modal, screen reader smoke test |
| 12 | `polish` | Animation pass (scroll reveals, hover transitions), footer, meta tags, OG image, favicon from logo SVG |

---

## MILESTONES.md Entry Format

Each row in the milestones table must have these columns:

```
| # | Slug | Description | Status | Branch | Notes |
```

Status values: `Planned` · `In Progress` · `Complete` · `Blocked`

---

## AGENT_LOG.md Entry Format

Each milestone gets one entry. Use this exact structure:

```markdown
---

## Milestone N — <Slug> (<YYYY-MM-DD>)

### Plan
What the agent intends to do and why, before any code is written.

### Implementation Notes
What was actually built. Key decisions made. Anything that differed from the plan.

### Test Results
Output of `pnpm test --run` and `pnpm build`. Pass/fail counts. Any flaky tests noted.

### Evaluation
How does the output measure against "What Good Looks Like"? What fell short? What exceeded expectations?

### Next Milestone
Name and one-line description of what comes next.
```

---

## Owner Instructions (Non-Technical)

The agent should keep this in mind: the studio owner is not a developer. Any file they are expected to edit must be heavily commented. The `src/data/artworks.ts` file is the main example — every field should have a plain-English comment explaining what it does and what values are acceptable.

The README.md must contain a section titled "Updating your artwork" that explains in plain English how to add, edit, or remove a piece from the gallery.
