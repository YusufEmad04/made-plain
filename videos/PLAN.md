# Video plans — animated concept reels

The first round of concept reels was text-on-paper. That's a poster, not an
animation. 2D animation earns its keep by showing the *mechanism* of an idea —
the bucket filling, the line crossing the threshold, the curve bending.
Below are the scenarios for two concept reels rebuilt around that principle.

Both are 1080×1920 (9:16), 30fps. Brand rules from `design-system/motion.md`
still apply: editorial restraint, one accent doing all the conversion work,
real numbers, no slides, no easing fluff.

---

## Reel A — "CAC payback, in pictures" (≈18s, 540 frames)

**The concept.** When you buy a customer, you spend cash today and earn it
back month by month. Payback is the moment you cross the line.

**The screenshot line.** *"If your payback is longer than your runway, you
don't have a growth engine. You have a cash leak."*

**Real numbers.** Sahelli: $400 CAC, $80/mo, 5-month payback.

### Scene 1 — Title (0–2.5s, 75f)

| Layer | Animation |
|---|---|
| Eyebrow `§ UNIT ECONOMICS` | eyebrow-stroke |
| Headline *"When does the customer pay you back?"* | ink-wipe-line |
| Hairline beneath | hairline-strike |
| DotMark, lower-left | pulse-dot drop-in |

### Scene 2 — The transaction (2.5–6s, 105f)

The screen splits into a left "wallet" zone and a right "clinic" zone.

| Layer | Animation |
|---|---|
| SVG storefront (right) | path draws on with stroke-dasharray |
| `$400` coin chip (left) | spring slide → arc-tweens into storefront |
| Storefront pulses on impact | scale 1 → 1.06 → 1.0 over 8f |
| Caption: *"Acquire a clinic for $400"* | ink-wipe-line, mute color |
| Three `$80` chips (after pulse) | spring out from storefront, fall down to a tray, staggered |
| Caption: *"It pays you $80 a month"* | ink-wipe-line |

The coin chips are real SVG with the JetBrains Mono number rendered inside.
Same chip component reused across the reel.

### Scene 3 — The bucket fills (6–12s, 180f)

Now we move to the **payback chart** — the centerpiece of the reel.

Layout:

- A vertical bar chart (6 bars, one per month) growing from a baseline.
- A horizontal **dashed accent line** at the $400 mark labeled `CAC $400`.
- A timeline axis below labeled `M1 M2 M3 M4 M5 M6`.
- Each frame "tick" represents one month and lasts ~25 frames.

| Frame range | What happens |
|---|---|
| 0–10 | Chart axes draw on (hairline-strike for x-axis, vertical for y) |
| 10–20 | Dashed `CAC $400` threshold line draws across, accent color |
| 20–45 | Month 1 bar grows to $80; running total label `$80` ticks up |
| 45–70 | Month 2 bar grows; total → $160 |
| 70–95 | Month 3 → $240 |
| 95–120 | Month 4 → $320 |
| 120–150 | **Month 5 bar grows; total crosses the threshold line.** The dashed line flashes to solid accent for 6 frames. The crossing point gets a DotMark. The bar at M5 turns accent. |
| 150–180 | Big number reveals: ink-wipe `5 months.` (display 200px, accent) and italic helper *"That's payback."* |

The total counter uses `<TabularTicker>`. Bars use a generic `<GrowBar>`
component (height interpolated against frames-since-tick).

### Scene 4 — Why it matters (12–16s, 120f)

Two horizontal bars stacked vertically:

- Top bar: `Payback — 5 months`, ink color, draws to ~50% width.
- Bottom bar: `Runway — 3 months`, accent color, draws to ~30% width.

Below the bars, the runway bar then **drains right-to-left** as a clock
ticker counts months 1–2–3 above it. When the runway hits 0, the screen
darkens slightly and the screenshot line wipes in:

> *"If your payback is longer than your runway,*
> *you don't have a growth engine —*
> *you have a cash leak."*

Last word `cash leak` gets a `marker-highlight` (accent block behind).

### Scene 5 — Brand outro (16–18s, 60f)

- Hairline-strike across center.
- DotMark drops in.
- *"made plain"* in italic Newsreader to its right.

### Scene props (data the comp needs)

```ts
{
  cac: 400,
  monthly: 80,
  paybackMonths: 5,
  runwayMonths: 3,
  monthBars: 6,
}
```

---

## Reel B — "The leaky bucket" (≈18s, 540 frames)

**The concept.** Acquisition fills your bucket. Churn drains it. The size of
the holes determines whether you have a business — not the size of the tap.

**The screenshot line.** *"Acquisition is what you do to survive. Retention
is what you do to win."*

**Real numbers.** Two buckets, same tap (100 customers/month). One leaks at
5%/month, the other at 1%/month. After 12 months: ~750 vs ~1,180 customers
in steady state. (Steady state ≈ acquisition / churn rate.)

### Scene 1 — Title (0–2.5s, 75f)

| Layer | Animation |
|---|---|
| Eyebrow `§ RETENTION` | eyebrow-stroke |
| Headline line 1: *"Your business"* | ink-wipe-line |
| Headline line 2: *"is a bucket."* | ink-wipe-line, accent |
| Hairline | hairline-strike |

### Scene 2 — The bucket (2.5–5.5s, 90f)

A single big SVG bucket draws on (stroke-dasharray reveal of the rim and
walls). Then drops start falling from the top.

| Frame | What happens |
|---|---|
| 0–25 | Bucket outline draws on (rim → left wall → bottom → right wall) |
| 25–45 | A label `+100/mo` appears above with a downward arrow drawing in |
| 30+ | Drops start spawning from the top, falling into the bucket on a sine-bobbed path. Drop spawn rate: every 6 frames. |
| 45–90 | Water level inside rises smoothly to ~60% of bucket height |

A drop is a small SVG path (terracotta accent) with a slight squish
on impact. Water level is a `<rect>` masked by the bucket interior.

### Scene 3 — The leak (5.5–9s, 105f)

Three holes appear on the side of the bucket. Drops start leaking out.

| Frame | What happens |
|---|---|
| 0–15 | Three small SVG circles "punch in" along the bucket's lower wall (scale 0 → 1 with bouncy spring). The circles are paper-color (the bucket's body) inside an accent ring. |
| 15+ | A leak stream (small drops) exits each hole at an arc, falling off-screen below |
| 0–105 | Water level rises but more slowly; eventually plateaus visibly below the rim |
| 60–105 | Caption right of bucket: *"−5% / month"* in mono with a downward arrow |

### Scene 4 — Two buckets (9–14s, 150f)

The screen splits. Two buckets side by side. Same drop rate from the tap.

- **Left bucket:** big holes (5% churn). Steady state low.
- **Right bucket:** tiny holes (1% churn). Steady state high.

| Frame | What happens |
|---|---|
| 0–25 | Left bucket slides to its half, right bucket fades in on the other half |
| 0–120 | Both buckets receive drops at the same rate |
| 0–120 | Their water levels rise on `1 − (1 − churn)^t` curves — left plateaus near ~25%, right approaches ~85% |
| 30+ | Counters appear above each: tabular tickers labeled `customers` |
| 120–150 | Counters settle. Bottom caption draws in: *"Same acquisition. 3× the business."* |

The counters are driven by the same exponential model so the numbers and
the visuals agree:

```
N(t) = (acquisition / churn) * (1 − (1 − churn)^t)
```

### Scene 5 — Screenshot line (14–17s, 90f)

The two buckets fade to 20% opacity behind a centered editorial line:

> *Acquisition is what you do to survive.*
>
> *Retention is what you do to win.*

The second line uses italic Newsreader at display size, with the phrase
*to win* highlighted by `marker-highlight`.

### Scene 6 — Brand outro (17–18s, 30f)

Hairline + DotMark + *"made plain"*.

### Scene props (data the comp needs)

```ts
{
  acquisition: 100,        // per month
  highChurn: 0.05,
  lowChurn: 0.01,
  monthsSimulated: 12,
}
```

---

## Shared SVG primitives to build first

Both reels lean on the same building blocks. These go in
`src/brand/svg.tsx` so both compositions stay short and the design system
gains a new module.

| Primitive | Purpose |
|---|---|
| `<Storefront />` | Phosphor-style line-drawn shop. `progress` 0–1 draws stroke. |
| `<CoinChip label/>` | Round chip with `$N` rendered in JetBrains Mono. Tweenable. |
| `<Bucket holes water />` | SVG bucket with rim/walls drawn on, optional holes, water-level rect masked by interior. |
| `<Drop />` | Small terracotta drop, used for falling water and leaking water. |
| `<DropEmitter from to count />` | Spawns drops on a parametric arc; respects `useCurrentFrame()`. |
| `<GrowBar value max delay />` | Vertical bar that grows from baseline, with optional label. |
| `<Axis ticks labels />` | Horizontal hairline with tick marks and `text-mono` labels. |
| `<DashedThreshold y label />` | Horizontal accent dashed line with a small label tag. |
| `<DrawPath d delay duration />` | Generic SVG path that draws itself via `stroke-dasharray`. |

Every primitive is purely deterministic on `useCurrentFrame()` — no random,
no setInterval, no CSS keyframes. They follow the same brand rules: ink for
structure, accent only on the moment of insight, mono for numbers, serif
italics for the editorial line at the end.

---

## Out-of-scope for this round

- No voiceover yet (silent reels — captions carry the meaning).
- No transitions between reels (each renders standalone).
- The `KitAd` reel stays as is — it's an ad, not a concept reel, and the
  current treatment matches the brand's hero rules.
