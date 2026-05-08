# PLAN V7 — Engines of Growth (third iteration)

Vertical 1080×1920, 30fps. Target ~110–120s including breathing pauses.

## Global rules

- `script.json` `pad_seconds` raised from 0.35 → **0.75** so every scene
  gets a real ending breath. The Remotion composition reads scene durations
  from the manifest, so the pause is automatic.
- Every concept ships with a **named brand example** on screen.
- No text inside an SVG `<rect>` exceeds ~90% of the rect width. Long
  phrases either break to two lines or get wider rects.
- All animation driven by `useCurrentFrame()` only.

## Brand examples (used across scenes)

- Sticky → **Spotify**, **Netflix**.
- Viral → **TikTok**, **Instagram**.
- Paid → **Shopify store + Google Ads**, **Uber promos**.
- Marketplace → **Amazon**, **Etsy**.
- Media → **YouTube**.

## Scene plan

### 01 — Problem (subscription / social / store)
- Three cards. Label at top, brand badges in the middle (replace current
  abstract icons), short rule at the bottom inside the card with proper
  vertical spacing.
- The "PICK THE ENGINE" rect is widened and the headline shrunk so the
  text fits with margin on both sides.
- Narration adds: "like Spotify, like TikTok, like an Amazon store."

### 02 — Three engines, three tests (replace gauges)
- Three side-by-side mini test diagrams instead of liquid gauges:
  - Sticky → tilting scale, NEW pan vs CHURN pan, NEW heavier.
  - Viral → small branch tree from 1 → 2 → 4 dots.
  - Paid → dollar coin going in to a small pipe and a stack coming out.
- Brand row underneath each: Spotify, TikTok, Shopify ads.
- Footer band stays for the rule line, single line, smaller.

### 03 — Sticky bucket (kept)
- Existing bucket model is fine. Tighten timing so the +20/-8 inequality
  has a clearer beat.
- Add a small "like Spotify" tag near the title.

### 04 — Sticky example (calendar)
- Existing calendar visual is mostly fine. Add Netflix tag at top so the
  recurring-payment story is anchored in a real product.

### 05 — Viral K branches
- Existing branching diagram is fine. Add "TikTok" tag under the K-pill
  so the abstract `K` is anchored.

### 06 — Why audience (fix overflow)
- Top: `WHY AUDIENCE?` headline.
- Smaller subtitle pill: `sell access to the crowd`.
- Marketplace block: BUYERS dots ↔ SELLERS shops + tag "Amazon · eBay".
- Media block: dot grid of viewers + SPONSOR pays + tag "YouTube".
- Remove the standalone `THE AUDIENCE IS THE PRODUCT` overflowing band.
  Put that idea instead at the top, smaller, centered, on a single line
  inside a properly-sized box.
- Move the bottom `LessonBand` higher or replace it with the in-svg
  caption above so they cannot stack.

### 07 — Paid (CAC funnel + LTV timeline) — biggest change
- Top: `PAID — turn money into profitable customers`.
- CAC mini-scene (left half):
  - A wallet icon at top spits out four `$10` coins that fall into a
    funnel labeled `ADS`. The funnel produces one customer figure on
    the right with "1 customer" caption.
  - Total spent box: `CAC = $40`.
- LTV mini-scene (right half / below):
  - Horizontal timeline with months M1..M4, the customer figure stays
    paying each month: `+$30, +$30, +$30, +$30`.
  - Cumulative total bar grows underneath: `$30 → $60 → $90 → $120`.
  - Final box: `LTV = $120`.
- Compare bar at the bottom: `$40 < $120 — scale it.`
- Then loss mode (animated swap):
  - CAC stack becomes `$90`.
  - Timeline pays only `$15 × 4 = $60`.
  - Compare bar: `$90 > $60 — every new customer deepens the loss.`
- Brand tags: `Shopify + Google Ads` for the good case,
  `Bad funnel` example for the loss case. (Real names of failed
  startups skipped to avoid defamation; "Bad funnel" is enough.)

### 08 — Wrong engine, wrong fix (trap)
- Three traps, one at a time, each its own mini-animation:
  1. **Leak trap** (sticky/ads):
     - Trapezoid bucket. Liquid fill clipped to the trapezoid, not a
       rectangle. Coins drop in from above; equal volume drips out the
       hole at the bottom. Caption: `Ads cannot patch a leak.`
     - Brand tag: `Trying to fix Spotify churn with ads`.
  2. **Network trap** (viral / isolated users):
     - Five user dots scattered with NO lines. Then dotted attempt-
       lines fail to connect. Caption: `Buying users is not a network.`
     - Brand tag: `A new social app with no friends-of-friends`.
  3. **Loss trap** (paid / bad math):
     - One sale on a big card: `−$5 per sale`. Then x10, x100, x1000
       arrows step down with growing red bars. Caption box shrunk so
       `MORE DEMAND, MORE LOSS` fits. Smaller font, wider box.
     - Brand tag: `An Uber promo that loses money on every ride`.

### 09 — Diagnostic (kept)
- Decision path is fine. Keep brand tag chips per row:
  Sticky · Spotify, Viral · TikTok, Paid · Shopify ads.

### 10 — Outro
- Three engine equations stacked.
- Bottom box: shrink `MAKE YOUR EQUATION TRUE` to fontSize 56 and
  widen the rect to ~990 to leave margins on both sides. The `____ > ____`
  hint stays small and centered.
- Tail dot brand mark.

## Smoke test plan

For every scene, render stills at four points:
- start (first beat)
- mid-animation
- end of animation (just before the trailing pause)
- final frame (during the pause)

Plus extra stills at every overlap-risk frame:
- Scene 01: pickAt frame and final
- Scene 06: bottom band frame
- Scene 07: handoff between good→loss mode
- Scene 08: each trap transition + final
- Scene 10: trueAt frame

After each round of fixes, re-still the previously broken frames before
moving on.
