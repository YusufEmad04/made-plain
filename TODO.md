# TODO — made-plain.com

This deployment is **landing-page only**. The backend routes exist and the code
compiles, but Vercel will run without `MONGODB_URI`, `AUTH_SECRET`, S3 keys,
`RESEND_API_KEY`, or a real payment provider. Every integration falls back to
an in-memory stub or a console log so the site never throws on a cold visit.

The list below is what still needs to happen before this becomes a real
product.

---

## 1. Real backend (when we go live for purchases)

- [ ] Provision MongoDB Atlas → set `MONGODB_URI` + `MONGODB_DB` in Vercel.
- [ ] Generate a 32+ char `AUTH_SECRET` (`openssl rand -hex 32`) → Vercel env.
- [ ] Create an S3 bucket (private, server-side encryption) → set
      `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`.
- [ ] Upload the 7 kit artefacts (handbook PDF, connection-map PNG/PDF, books
      distilled PDF, glossary PDF, worksheets ZIP, exercises ZIP, quick-start
      PDF) to S3 under the keys referenced in `lib/content/kit.ts`.
- [ ] Wire Resend (or Postmark) → `RESEND_API_KEY`, `EMAIL_FROM`. Replace the
      `console.log` fallback in `lib/email/index.ts` once verified.
- [ ] Replace `MockPaymentProvider` with Stripe Checkout or Lemon Squeezy.
      Webhook → `/api/webhook/payment` → mark order paid → email receipt with
      signed download links.
- [ ] Add rate limiting on `/api/checkout`, `/api/login`, `/api/contact`
      (Upstash Redis or Vercel KV).

## 2. Content fill

- [ ] `/concepts` — only scaffolding now. Need ~30 entries, each with a
      one-paragraph definition + 1 worked example + 2 cross-links.
- [ ] `/glossary` — same. Pull from the Handbook draft.
- [ ] `/map` — the Connection Map page renders an SVG placeholder. Replace
      with the real interactive map (probably a static SVG with hotspots).
- [ ] `/blog` — 3 launch posts: "Why one weekend", "What I cut from the
      handbook", "The Connection Map, explained".
- [ ] Real testimonials. The current three are placeholders pulled from beta
      readers; swap names/metrics for verified ones before launch.
- [ ] Author photo + short bio block (currently just a line).

## 3. Domain, infra, observability

- [ ] Buy + point `made-plain.com` (or chosen domain) at Vercel.
- [ ] Plausible / Umami / PostHog for analytics. No GA.
- [ ] Sentry (or Vercel's built-in) for error tracking.
- [ ] Set `NEXT_PUBLIC_SITE_URL` so `app/sitemap.ts` and OG images use the
      right host.
- [ ] Open Graph image (`app/opengraph-image.tsx`) — currently fallback.

## 4. Legal

- [ ] Replace `/privacy`, `/terms`, `/refunds` placeholder copy with reviewed
      versions. Add cookie banner only if analytics requires it.
- [ ] Confirm 30-day refund language matches whatever Stripe/LS supports.

## 5. Email templates

- [ ] Receipt email (with download links + license note).
- [ ] Magic-link login email.
- [ ] Newsletter welcome + double opt-in.

---

# Landing-page critique (Hormozi / Sabri Suby / Halbert lens)

The page is editorial and clean. Editorial does not sell on its own. Below is
what would lift conversion if/when this becomes the actual money page.

## What's working

- Strong **specificity in the promise**: "A working mental model of business
  by Sunday night." Time-bound, concrete outcome.
- The kit is **tangible** — 7 named pieces, not "modules". Hormozi rule:
  *make the offer feel like a stack of physical things*. The KitMockup helps.
- **Editorial restraint** signals taste; the buyer thinks "this person knows
  what they're doing." That earns the click on the CTA.
- **Single price, single CTA.** Cognitive load is low. Removing the 3-tier
  table was the right move.
- **Risk reversal is present** (30-day refund), surfaced near the CTA.

## What's missing or weak (priority order)

### A. The offer doesn't feel like a steal yet
Hormozi's grand-slam rule: dream outcome × perceived likelihood ÷ time × effort.
The page nails dream outcome and time, but **perceived value is anchored
low** because $19 sits next to seven items the visitor hasn't priced. Fix:

- Add a **value-stack table** above or beside the price card:
  - Handbook (180 pages) — *if sold alone, $79*
  - Connection Map — *$29*
  - 30 books distilled — *$49*
  - Glossary, Worksheets, Exercises, Quick-Start — *$59*
  - **Total value: $216. Today: $19.**
- This makes the $19 feel like a deliberate underprice, not a cheap product.

### B. No urgency / no scarcity
We removed the "300 founding spots" line and replaced it with nothing. That
was the only urgency lever on the page.

- Add either: (a) a launch countdown ("Price doubles to $39 on
  June 1"), (b) a soft cap ("First 500 buyers get the Operator Notes
  archive"), or (c) a cohort-based reading group bonus that closes weekly.
- Hormozi: *if there is no real reason to buy now, they won't.*

### C. Hero CTA copy is still generic
"Get the kit — $19" is fine. But the highest-performing version names the
*outcome*, not the product:

- Try: **"Build the model — $19"** or **"Get the weekend plan — $19"** and
  A/B once analytics is on.
- Sub-CTA microcopy could be a 1-line objection-burner: "If you don't ship
  by Sunday, email me — full refund, no form."

### D. Above-the-fold has no proof
First screen = headline + image + CTA. There's zero social proof before the
visitor scrolls. Suby's "Halo Strategy": at least one credibility marker has
to appear in the hero.

- Add a single-line proof strip directly under the CTA: *"Used by operators
  at [logos] · 1,200+ readers · 4.8/5 from 80 reviews."* Even one true
  number beats none.

### E. No before/after / problem agitation
The page says *what the kit is*. It barely says *how bad it is to not have
it*. Halbert's rule: agitate first, then sell.

- Add a "Before vs After" block right after the hero:
  - **Before:** 47 open tabs · half-finished Coursera · YouTube on 1.5× ·
    no idea where pricing belongs in the model.
  - **After:** One handbook · one map on the wall · pricing slots into
    "value capture" without thinking.

### F. Pricing section feels lonely
The Pricing card sits alone with 5 ticks. Strong, but no risk reversal,
no FAQ-on-card, no payment logos. Add inside or next to the card:

- "Pay once. Lifetime updates." (already there ✓)
- "30-day, no-questions refund" (already there ✓)
- Stripe / Apple Pay / G Pay logo strip — even before Stripe is wired,
  placeholder these once payment is real.
- "Instant download. Email arrives in <60s."

### G. Testimonials are vague
"$30k MRR" with no name, no logo, no photo, no link reads as fabricated to a
trained eye (and to Google). Until you have real ones, *use fewer*. One real
quote with a real name beats three anonymous ones.

### H. FAQ ordering
The FAQ should lead with the **#1 objection**, which on a $19 cart is almost
never refunds — it's *"is this for me?"* Reorder:

1. Who is this for? (level of business experience)
2. What if I already know the basics?
3. How is this different from a $20 book / a $500 course?
4. Refund policy.
5. Team license.
6. Updates.

### I. No exit-intent / no email capture
The page either converts to $19 or loses the visitor. Add a low-friction
fallback: *"Not ready? Get the first chapter free."* → email → drip → repitch.
This typically captures 8–15% of the would-be bounces.

### J. Mobile audit notes

Run-through on a 375px viewport:

- **Hero `font-mega` clamp**: `clamp(56px, 9vw, 120px)` — verify the 11ch
  max-width still keeps "weekend" on its own line on iPhone SE. Looks OK on
  ≥390px.
- **Sticky CTA bar**: hides tagline below `sm:` (correct). Confirm it
  doesn't cover the in-page Pricing CTA on the smallest screens — currently
  it sits `bottom-0` with `pb-safe`. Fine.
- **KitMockup card**: `max-w-[480px] mx-auto` stacks below text on `<lg`.
  Good. But the SVG inside has small labels — verify they don't truncate.
- **Library / glossary grids**: collapse to 1-col on `<md`. Good.
- **Tap targets**: all CTAs are `h-12` or `h-14` (≥48px). Good.
- **Focus rings**: relying on browser default. Consider an explicit
  `focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]` on Link
  CTAs for keyboard users.
- **Decorative SVGs**: `KitMockup` should add `aria-hidden="true"`; the big
  `opacity-[0.06]` background marks too.
- **Skip-to-content link**: missing. Add one in `app/layout.tsx`.
- **Color contrast**: `var(--color-mute)` on `var(--color-paper)` — measured
  ~4.7:1, passes AA for normal text. The `--color-mute-2` is borderline;
  audit with axe before launch.
- **Reduced motion**: no animations need a `prefers-reduced-motion` guard
  yet. Add when motion is introduced.

### K. SEO basics

- [ ] `app/layout.tsx` metadata: title template, description, OG image, twitter
      card. Currently default Next scaffold values likely.
- [ ] Per-page `metadata` on `/concepts`, `/glossary`, `/map`, `/blog`.
- [ ] `app/sitemap.ts` exists but lists static routes only — extend once
      `/blog/[slug]` and `/concepts/[slug]` are real.
- [ ] JSON-LD `Product` schema on the pricing card with offer + aggregateRating
      once real reviews exist.

---

## TL;DR for the next session

1. Wire Stripe (or LS) — that unlocks everything else.
2. Add the **value stack** + **urgency** + **above-fold proof strip**. These
   three changes alone will move conversion more than any visual tweak.
3. Real testimonials, real photos, real numbers. Drop the placeholders.
4. Fill `/concepts` and `/glossary` with at least 20 entries each before
   launch — empty index pages erode trust faster than missing testimonials.
