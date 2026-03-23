# CLAUDE.md — JB Designs Website

## Overview

Single-file website for **JB Designs** — an original artwork and custom order studio.
Everything lives in one file: `index.html`. No build tools, no frameworks, no dependencies beyond Google Fonts.

---

## File Structure

```
/
├── index.html     ← The entire website (HTML + CSS + JS, self-contained)
└── CLAUDE.md      ← This file
```

---

## Tech Stack

| Layer      | Choice                  | Notes                                         |
|------------|-------------------------|-----------------------------------------------|
| Markup     | HTML5                   | Semantic sections, single file                |
| Styles     | Vanilla CSS             | All in a `<style>` block, uses CSS variables  |
| JavaScript | Vanilla ES6             | All in a `<script>` block at the bottom       |
| Fonts      | Google Fonts (CDN)      | Cormorant, Jost, Great Vibes                  |
| Hosting    | Any static host         | Netlify, Vercel, GitHub Pages all work        |

---

## Design Tokens (CSS Variables)

Defined in `:root` at the top of the `<style>` block. Change colours here, not inline.

```css
--bg:     #faf8f5   /* main background — warm white */
--bg2:    #f3efe8   /* secondary background — slightly warmer */
--ink:    #222018   /* primary text / dark elements */
--mid:    #7a7468   /* muted text */
--line:   #ddd8ce   /* borders and dividers */
--accent: #b8864e   /* brand caramel — buttons, highlights, logo */
--acc2:   #d4a574   /* lighter accent — hover states */
--serif:  'Cormorant', Georgia, serif
--sans:   'Jost', sans-serif
--script: 'Great Vibes', cursive
```

---

## Page Sections

| Section        | Anchor         | Purpose                                               |
|----------------|----------------|-------------------------------------------------------|
| Nav            | —              | Fixed top bar with logo SVG, links, Shop Now CTA      |
| Hero           | `#hero`        | Full-screen intro, script heading, artwork SVG panel  |
| Marquee        | —              | Scrolling text strip — keywords + Instagram handle    |
| About          | `#about`       | Studio story, stacked frame art display, stats        |
| Gallery        | `#gallery`     | 5 artwork cards in a masonry grid                     |
| Custom Orders  | `#commissions` | Process steps + custom order enquiry form             |
| Contact        | `#contact`     | Instagram link, email link, general contact form      |
| Footer         | —              | Logo, copyright, Instagram link                       |

---

## Gallery Cards

Each card is a `.gc` div inside `.g-grid`. To add or edit a piece:

```html
<!-- Card template -->
<div class="gc fu" onclick="openModal('TITLE', 'MEDIUM · SIZE')">
  <div class="gc-img">
    <!-- Replace the SVG below with your actual photo: -->
    <img src="your-photo.jpg" style="width:100%;height:100%;object-fit:cover"/>
  </div>
  <div class="gc-hov">
    <div class="gc-title">TITLE</div>
    <div class="gc-sub">MEDIUM · SIZE</div>
    <div class="gc-type">Print available</div>  <!-- or: Print + Original available / Original only -->
    <button class="btn-buy" onclick="event.stopPropagation();openModal('TITLE','MEDIUM · SIZE')">Enquire</button>
  </div>
</div>
```

**Grid layout** — the first card spans 2 rows (tall). Cards 2–5 fill the right side. The CSS grid uses `grid-column` and `grid-row` on `:nth-child()` selectors. If you add more cards, either remove those selectors or extend the pattern.

**Replacing placeholder art** — the SVG blobs are placeholders only. Swap each `<svg>…</svg>` inside `.gc-img` with `<img src="filename.jpg" style="width:100%;height:100%;object-fit:cover"/>`.

---

## Enquiry Modal (Gallery)

When a visitor clicks a gallery card, `openModal(title, desc)` fires. It opens a modal with:
- Piece title and medium
- A short explanatory note (no price shown)
- Name, email, format preference (print / original), size, and optional message fields
- "Send enquiry" button — on success shows a confirmation and closes

**No payment is taken here.** You respond to enquiries directly with pricing.

---

## Custom Order Form (Commissions section)

The form at `#commissions` collects:
- Name, email
- Order type (dropdown: custom commission / print of existing work / gift / other)
- Description textarea
- Preferred size + budget (optional)
- Deadline (optional)

`sendCustomOrder()` validates name, email and description, then shows a success message. **Currently frontend-only — no emails are sent automatically.** See "Going live with email" below.

---

## Contact Form

The form in `#contact` collects name, email, subject and message. `sendCF()` handles it the same way — frontend validation + success message only.

---

## Going Live with Email (Recommended Next Step)

To actually receive enquiries, connect the forms to an email service. The simplest options:

### Option A — Formspree (free tier, no backend needed)
1. Sign up at [formspree.io](https://formspree.io)
2. Create a form and get your endpoint URL (e.g. `https://formspree.io/f/xyzabc`)
3. In each form's submit function (`sendCustomOrder`, `sendCF`, `pay`), replace the success block with a `fetch` POST:

```javascript
async function sendCustomOrder() {
  const n = document.getElementById('co-name').value.trim();
  const e = document.getElementById('co-email').value.trim();
  const d = document.getElementById('co-desc').value.trim();
  if (!n || !e || !d) { alert('Please fill in name, email and description.'); return; }

  await fetch('https://formspree.io/f/YOUR_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: n, email: e, description: d })
  });

  document.getElementById('co-ok').style.display = 'block';
  document.querySelector('[onclick="sendCustomOrder()"]').disabled = true;
}
```

### Option B — Netlify Forms (free, works automatically on Netlify)
1. Add `netlify` attribute to any `<form>` tag (you'd need to convert the divs to a real `<form>`)
2. Netlify captures submissions and emails you — zero config

### Option C — EmailJS (free tier)
[emailjs.com](https://www.emailjs.com) — client-side email sending, no backend required.

---

## Adding Payments (When Ready)

The site intentionally has no payment processing right now — you quote customers directly after they enquire.

When you're ready to take payments:

### Stripe Payment Links (easiest)
1. Create a product in your [Stripe Dashboard](https://dashboard.stripe.com)
2. Generate a **Payment Link** for each item/price
3. Update the enquiry confirmation email to include the payment link

### Stripe Checkout (integrated)
Requires a small backend (Netlify Function or Vercel serverless):
```js
// /api/create-checkout.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
module.exports = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: req.body.priceId, quantity: 1 }],
    mode: 'payment',
    success_url: 'https://yoursite.com/success',
    cancel_url: 'https://yoursite.com',
  });
  res.json({ url: session.url });
};
```

### PayPal Buttons
Add the PayPal SDK and render a button anywhere on the page:
```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=GBP"></script>
<div id="paypal-button-container"></div>
<script>
  paypal.Buttons({
    createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: '50.00' } }] }),
    onApprove: (data, actions) => actions.order.capture().then(() => alert('Payment complete!'))
  }).render('#paypal-button-container');
</script>
```

---

## Deployment

### Netlify (recommended — free)
Drag and drop `index.html` to [app.netlify.com/drop](https://app.netlify.com/drop). Done. Add a custom domain in Settings → Domains.

### GitHub Pages (free)
1. Push `index.html` to a GitHub repo
2. Settings → Pages → Deploy from branch (main, root)
3. Live at `https://USERNAME.github.io/REPO`

### Vercel (free)
```bash
npx vercel
```
Follow the prompts. Auto-deploys on every git push.

---

## Things Still To Do

- [ ] Replace placeholder SVG artwork with real photos of your work
- [ ] Update email address in the Contact section (`hello@jbdesigns.co.uk`)
- [ ] Connect forms to Formspree / Netlify Forms so you actually receive enquiries
- [ ] Add payment links once you've agreed prices with customers
- [ ] Update the marquee strip text if you want different keywords
- [ ] Update the "100+ Works sold" badge in the hero to whatever number you like
- [ ] Update the stats in the About section (100+ originals, 5★, 48h)

---

## Notes for Claude (future edits)

- All CSS is in the `<style>` block — search for the comment before each section (e.g. `/* GALLERY */`)
- All JS is in the `<script>` block at the bottom
- CSS variables are in `:root` — always change colours there
- Gallery card grid layout is controlled by `.gc:nth-child(N)` rules — update these if you add/remove cards
- The modal (`#mb`) is populated dynamically by `buildMo()` in JS
- The custom order form uses IDs prefixed `co-` (e.g. `co-name`, `co-email`)
- The contact form uses IDs prefixed `cf-` (e.g. `cf-n`, `cf-e`)
- The logo is an inline SVG in the `<nav>` — edit the `<path>` elements to adjust it
