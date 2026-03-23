# JB Designs

Portfolio and enquiry site for JB Designs — an original artwork studio. Customers browse a gallery of prints and originals, enquire about specific pieces, and submit custom order requests. Prices are set and communicated directly by the studio owner.

**Live site:** _set after first deploy_
**Instagram:** [@jb.designstudios](https://www.instagram.com/jb.designstudios)

---

## Current Features

- Gallery of original artwork and prints with hover reveal
- Piece type badges (Print available / Original only / Print + Original)
- Enquiry modal per piece — no prices shown, owner responds directly
- Custom order form with full validation
- General contact form
- About section with studio story and stats
- Fully responsive — mobile, tablet, desktop
- Accessible — WCAG AA contrast, keyboard navigable, screen reader friendly

## Planned Features

See [MILESTONES.md](./MILESTONES.md) for the full roadmap. Upcoming highlights:

- Performance pass — Lighthouse ≥ 90 on mobile
- Accessibility audit and fixes
- Open Graph / social sharing meta
- Formspree integration for real email delivery

---

## Tech Stack

| Layer      | Choice                              |
|------------|-------------------------------------|
| Framework  | React 18 + TypeScript               |
| Bundler    | Vite                                |
| Testing    | Vitest + @testing-library/react     |
| Styling    | Vanilla CSS + CSS custom properties |
| Deployment | GitHub Pages via GitHub Actions     |
| Package    | pnpm                                |

No external UI libraries. No CSS frameworks. Components and styles are hand-written to match the studio's brand.

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Install

```bash
git clone <repo-url>
cd jb-designs
pnpm install
```

### Development

```bash
pnpm dev
```

Opens at `http://localhost:5173`.

### Tests

```bash
pnpm test          # watch mode
pnpm test --run    # single run (used in CI)
```

### Build

```bash
pnpm build         # outputs to dist/
pnpm preview       # preview the production build locally
```

---

## Project Structure

```
jb-designs/
├── public/
│   └── images/artwork/       ← Drop artwork images here
├── src/
│   ├── components/
│   │   ├── layout/           ← Nav, Footer, Layout wrapper
│   │   ├── sections/         ← Hero, About, Gallery, Commissions, Contact
│   │   ├── ui/               ← Button, Modal, Badge, Input, etc.
│   │   └── gallery/          ← GalleryGrid, ArtworkCard, EnquiryModal
│   ├── data/
│   │   └── artworks.ts       ← Edit this to update the gallery ← ← ←
│   ├── hooks/                ← Custom React hooks
│   ├── types/                ← TypeScript interfaces
│   ├── utils/                ← Pure utility functions (validated and tested)
│   ├── workers/              ← Web Workers for any heavy processing
│   └── styles/
│       └── tokens.css        ← Design tokens (colours, fonts, spacing)
├── tests/
│   ├── unit/                 ← Vitest unit tests
│   └── smoke/                ← React Testing Library smoke tests
├── AGENT_LOG.md              ← Agent's running log
├── CLAUDE.md                 ← Agent's operating instructions
└── MILESTONES.md             ← Milestone tracking table
```

---

## Updating Your Artwork

> You do not need to know how to code to update the gallery. You only need to edit one file.

### The file to edit

```
src/data/artworks.ts
```

Open it in any text editor. Every field has a comment above it explaining what it does.

### Adding a new piece

1. Copy an existing artwork object from the array.
2. Give it a new unique `id` (e.g. `"artwork-06"`).
3. Fill in the fields: `title`, `medium`, `dimensions`, `availability`, and optionally `description`.
4. Drop the image file into `public/images/artwork/` and set the `image` field to the filename (e.g. `"my-painting.jpg"`).
5. Save the file.

### Removing a piece

Delete the entire object (from `{` to `},`) for that piece from the array.

### Changing availability

The `availability` field accepts three values:
- `"print"` — print only
- `"original"` — original artwork only
- `"both"` — print and original available

### Example entry

```ts
{
  // Unique ID — never change this after the piece goes live
  id: "artwork-01",

  // The title shown on the card and in the enquiry modal
  title: "Untitled No. 7",

  // Medium and technique — shown as a subtitle on the card
  medium: "Acrylic on Canvas",

  // Physical dimensions of the original work
  dimensions: "80 × 100 cm",

  // What's available to purchase
  // Options: "print" | "original" | "both"
  availability: "both",

  // Filename of the image in public/images/artwork/
  // Leave blank ("") to show a placeholder
  image: "untitled-no-7.jpg",

  // Optional: shown in the enquiry modal
  description: "A study in warm tones and organic form.",
},
```

---

## Connecting Forms to Your Email

By default, form submissions show a success message but don't send an email. To receive real enquiries:

### Formspree (recommended — free)

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form and copy your endpoint URL (e.g. `https://formspree.io/f/xyzabc`)
3. Open `src/utils/submitForm.ts` and replace the placeholder URL with your endpoint

That's it. Formspree will email you every submission.

---

## Deployment

The site deploys automatically to GitHub Pages whenever commits are pushed to the `develop` branch. No manual steps needed.

To set it up for the first time:
1. Go to your repo → Settings → Pages
2. Set source to **GitHub Actions**
3. Push to `develop` — the workflow handles the rest

---

## How the Agent Works

This project is built by a self-directed AI agent (Claude) operating through milestone cycles. The agent:

1. Reads `CLAUDE.md` for its operating instructions
2. Reads `MILESTONES.md` to identify the current milestone
3. Reads `AGENT_LOG.md` to understand what was done previously
4. Writes a plan in `AGENT_LOG.md` before touching any code
5. Creates a feature branch, implements the milestone, runs tests
6. Evaluates the output against quality standards
7. Merges to `develop` only when tests pass
8. Logs the completed milestone and advances to the next one

The agent does not ask for permission between milestones. If it encounters a genuine blocker, it logs it in `AGENT_LOG.md` and stops — it does not merge broken code.

All agent work branches from `develop`. The `main` branch receives merges from `develop` when the owner is ready to cut a production release.
