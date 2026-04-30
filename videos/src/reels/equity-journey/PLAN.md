# Equity Journey — Scenario Plan

**Goal:** Walk through the full life of a startup's cap table, from founding to acquisition, using one fictional company **"Brewly"** (a coffee app, founders Maya & Alex). At every funding event we redraw the same pie, update the cap table, recompute share price, and show the pre-money + cash = post-money equation. The lesson lands at exit when Maya's shrinking percentage becomes a much bigger dollar number every round.

- **Format:** 1080×1920, 9:16, 30 fps
- **Voice:** Laura (`FGY2WhTYpPnrIDTdsKH5`) — young female, social_media use case, sunny enthusiasm
- **Pad per scene:** 0.7s of trailing silence so viewers can read each frame before the next beat
- **Length target:** ~90s, 10 scenes
- **Aesthetic:** Paper background (`#13110E`), ink (`#F1ECDF`), accent orange `#E5572A`, warn ochre `#B8860B`, pos green, neg red. Display serif for headlines, mono for numbers (tabular-nums), italic body for asides.

---

## Committed math (clean teaching numbers)

| Round       | Raise | Pre-money | Post-money | Investor % | Share price | Total shares  |
|-------------|-------|-----------|------------|------------|-------------|---------------|
| Founding    | —     | —         | —          | —          | $0.00       | 10,000,000    |
| Pre-seed    | $1M   | $3M       | $4M        | 25%        | $0.30       | 13,333,333    |
| Seed        | $4M   | $16M      | $20M       | 20%        | $1.20       | 16,666,667    |
| Series A    | $10M  | $40M      | $50M       | 20%        | $3.00       | 20,833,333    |
| Series B    | $30M  | $120M     | $150M      | 20%        | $6.00       | 26,041,667    |
| Exit (acq.) | —     | —         | $500M      | —          | $19.20      | 26,041,667    |

**Maya's path:** 60% → 45% → 36% → 28.8% → 23.04%; stake $0 → $1.8M → $7.2M → $14.4M → $34.5M → **$115M** at exit.
**Alex's path:** 40% → 30% → 24% → 19.2% → 15.36% → **$77M**.
**Investor returns:** Angels $1M→$64M (64×); Seed VC $4M→$64M (16×); Series A $10M→$80M (8×); Series B $30M→$100M (3.3×).

> All percentages displayed always sum to 100%. Where rounding nudges values, we hide it inside the animation; the on-screen ledger stays exact.

---

## SVG primitives

### Reused (already in `src/brand/svg.tsx`)
- `Pie` — multi-slice with sweep-on, detach, growth
- `DollarTag` — spring-in price label
- `MoneyBill` — arcing $ rectangle
- `FlowArrow` — animated arrow

### New (to be appended)
- **`ValuationStack`** — three labeled horizontal bars (Pre-money / + Cash / Post-money) with widths interpolated to the values; bars draw on left-to-right and labels fade in.
- **`CapTable`** — bordered ledger that reveals one row per word cue. Columns: Holder · Shares · %. Newly added row is highlighted with a left-edge accent stripe for ~30 frames.
- **`PriceTicker`** — large tabular-nums number with a "/share" suffix that animates between two values via a slot-machine roll (number scales down → swaps → scales up) plus a small green/orange spark line under it.
- **`StakeBar`** — labeled bar (vertical or horizontal) with a value label that ticks; used twice in the dilution-vs-value split.
- **`RoundBadge`** — pill containing a small stage glyph (sprout / sapling / tree / building) + round name.
- **`InvestorChip`** — circular avatar (silhouette) with a role label underneath.

---

## Scenes

> All durations below are *spoken length only*; the actual `durationFrames` comes from the manifest, which already includes the 0.7s pad. **Word-cue triggers** name a word in the narration; the visual fires on `wordCue(scene.words, "<word>")`.

### Scene 01 — Hook  (~5s spoken)
- **Visual:** Black paper. Hand-drawn arrow climbs from the bottom-left ($0 label) to the top-right ($500M label); during the climb, share-price ticks fly past behind it. On "follow one", an `InkWipeLine` sweeps in the title strip: **"BREWLY · a coffee app"**.
- **Narration:** *"How does a company go from two people in a room to half a billion dollars? Let's follow one."*
- **Sync:**
  - "two" → arrow starts climbing
  - "half a billion" → "$500,000,000" label snaps in at the arrow tip
  - "follow one" → title strip wipes in
- **End hold:** arrow + title visible for the full pad.

### Scene 02 — Day 0: the founding  (~9s spoken)
- **Visual:** Two avatar circles enter from the left: **Maya** (accent orange, "CEO") and **Alex** (warn ochre, "CTO"). The pie draws on the right (radius grows from 20→260) with a 60/40 split. Below the pie a `CapTable` reveals two rows on word cues. To the right of the table, a `PriceTicker` reads `$0.00 / share`.
- **Narration:** *"Day one. Maya and Alex start a company. They split it sixty-forty. Ten million shares on paper, worth nothing yet."*
- **Sync:**
  - "Maya" → Maya avatar pops in
  - "Alex" → Alex avatar pops in
  - "sixty-forty" → pie draws on with both slices
  - "Ten million shares" → cap-table title row + Maya's row reveal
  - "nothing yet" → ticker emphasizes `$0.00` with a soft shake

### Scene 03 — Valuation primer  (~9s spoken)
- **Visual:** A clean horizontal `ValuationStack` diagram in three steps:
  1. A bar labeled **"Pre-money · $X"** draws left→right.
  2. A `MoneyBill` flies in labeled **"+ Cash"**, lands at the bar's end.
  3. The bars merge into a longer bar labeled **"= Post-money"**.
  - Below: the formula `share price = post-money ÷ total shares` types in.
- **Narration:** *"Two words you need. Pre-money: what the company's worth before investors put cash in. Add the cash, and you get post-money. That's it."*
- **Sync:**
  - "Pre-money" → first bar draws
  - "cash" → money-bill arcs in
  - "post-money" → merged bar locks in
  - "That's it" → formula finishes typing

### Scene 04 — Pre-seed: angels  (~13s spoken)
- **Visual:** `RoundBadge` "Pre-seed" top-left. Three `InvestorChip`s labeled "Angels" float in. `ValuationStack` animates: $3M + $1M = $4M. The big pie redraws: it carves a green 25% wedge out, and Maya's & Alex's slices proportionally shrink to 45% / 30% in place. `CapTable` below adds a row `Angels — 3,333,333 — 25%` highlighted. `PriceTicker` rolls **$0.00 → $0.30**.
- **Narration:** *"Pre-seed round. Three angels chip in one million dollars. The company's worth four million afterward — so they own a quarter. Maya and Alex own less now. That's called dilution."*
- **Sync:**
  - "Pre-seed" → badge + chips appear
  - "one million" → bill + valuation stack animates
  - "four million" → post bar locks
  - "quarter" → green wedge carves out
  - "less now" → founder slices visibly shrink
  - "dilution" → marker-highlight on the word "dilution" in a small caption

### Scene 05 — Seed  (~12s spoken)
- **Visual:** Same template, badge "Seed". Stack: $16M + $4M = $20M. Pie carves a new 20% wedge (different color, e.g. lighter accent). All earlier slices proportionally shrink. `CapTable` adds `Seed VC — 3,333,333 — 20%`. Maya 36%, Alex 24%, Angels 20%, Seed VC 20%. `PriceTicker` rolls **$0.30 → $1.20**. Side `MarkerHighlight` italic caption: *"Smaller slice. Worth four times more."*
- **Narration:** *"Seed round. Four million in, at twenty million post. Maya's slice shrinks to thirty-six percent — but each share is now worth four times what it was."*
- **Sync:**
  - "Seed round" → badge swaps
  - "four million in" → stack animates
  - "twenty million post" → post bar locks
  - "thirty-six" → ticker on Maya's % spins to 36
  - "four times" → ticker rolls $0.30 → $1.20

### Scene 06 — Series A  (~10s spoken)
- **Visual:** Badge "Series A". Stack: $40M + $10M = $50M. Pie carves another wedge. `CapTable` adds `Series A — 4,166,667 — 20%`. `PriceTicker` rolls **$1.20 → $3.00**. New small panel below the ticker: **"Maya's stake → $14.4M"** ticks up from $7.2M.
- **Narration:** *"Series A. Ten million at fifty. The pie's the same shape — it's just worth a lot more."*
- **Sync:**
  - "Series A" → badge swaps
  - "Ten million at fifty" → stack
  - "lot more" → ticker rolls + Maya's stake counter ticks

### Scene 07 — Series B  (~10s spoken)
- **Visual:** Badge "Series B". Stack: $120M + $30M = $150M. Final wedge — pie now has six colors. `CapTable` adds `Series B — 5,208,333 — 20%`. `PriceTicker` **$3.00 → $6.00**. Maya's stake counter ticks **$14.4M → $34.5M**. Maya's % counter ticks **28.8% → 23.0%**.
- **Narration:** *"Series B. Thirty million in. The company is worth a hundred and fifty million. Maya owns less than a quarter — and that quarter is worth thirty-four million dollars."*
- **Sync:**
  - "Thirty million in" → stack
  - "hundred and fifty" → post bar locks
  - "less than a quarter" → Maya % ticks down
  - "thirty-four million" → stake counter lands

### Scene 08 — The reveal: shrinking %, growing $  (~10s spoken)
- **Visual:** Split-screen, vertical divider line.
  - **Left:** five `StakeBar`s in a row labeled Day-0 / Pre / Seed / A / B; heights map to Maya's % (60, 45, 36, 28.8, 23). Bars rise to those heights with a stagger; an arrow sweeps along the top labeled **"% down"**.
  - **Right:** five `StakeBar`s, heights map to Maya's $stake (0, 1.8M, 7.2M, 14.4M, 34.5M) — they climb up; arrow labeled **"$ up"**.
  - Big bottom band: **"Smaller slice. Bigger pie."** (display serif).
- **Narration:** *"Look what happens. Her percentage goes down every round. Her dollars go up every round. That is the trade."*
- **Sync:**
  - "down every round" → left bars cascade in
  - "up every round" → right bars cascade in
  - "the trade" → bottom band locks

### Scene 09 — Exit: acquisition  (~13s spoken)
- **Visual:** A large banner sweeps in: **"ACQUIRED · $500,000,000"** in display serif, accent stripe under it. The pie shrinks to upper-third. Each slice flips like a card to a `DollarTag` showing the cash to that holder; a small "× multiple" badge stamps next to investor slices. The flips happen in this order on word cues:
  - "Maya" → $115M
  - "Alex" → $77M
  - "angels" → $64M (64× green spark)
  - "Seed VC" → $64M (16×)
  - "Series A" → $80M (8×)
  - "Series B" → $100M (3.3×)
  - `PriceTicker` settles at **$19.20**.
- **Narration:** *"Five years later, Brewly sells for half a billion dollars. The angel who put in one million walks away with sixty-four. Maya — a hundred and fifteen."*
- **Sync:**
  - "half a billion" → banner slams in
  - "one million" → angel slice flips first
  - "sixty-four" → 64× badge stamps with a spark
  - "Maya — a hundred and fifteen" → Maya's slice flips

### Scene 10 — Outro  (~6s spoken)
- **Visual:** `DotMark` enters center. Tagline `MarkerHighlight`: **"A smaller slice of a much bigger pie."** Sub-line: **"That's the whole game."** "Made plain" wordmark settles bottom.
- **Narration:** *"A smaller slice of a much bigger pie. That's the whole game."*
- **Sync:**
  - "smaller slice" → first line wipes in
  - "whole game" → DotMark final pulse + wordmark

---

## House-rule compliance (per `videos/WORKFLOW.md`)

- Durations are **never** hardcoded — every `<Sequence>` reads `startFrame` and `durationFrames` from `voiceover/manifest.json`.
- One mp3 per scene (10 mp3s total).
- Word timings drive every animation beat — components receive `scene.words` and call a local `wordCue(words, needle, fallback)` helper.
- All visuals come from the brand SVG library; new primitives are added to `src/brand/svg.tsx` first.
- The 0.7s `pad_seconds` is the audible breath at scene boundaries — no hardcoded "extra hold".

## Verification plan

1. After writing `script.json`, sanity-read totals (~80–90s).
2. After TTS, confirm `manifest.totalFrames` ≈ 2400–2700.
3. Smoke-render stills:
   - middle of scene 04 (pre-seed pie)
   - middle of scene 07 (Series B post-money)
   - middle of scene 08 (split bars)
   - middle of scene 09 (exit flips)
4. Confirm cap-table totals are visually balanced (sum to 100%) at every frozen scene.
5. `npx remotion render EquityJourney out/equity-journey.mp4`
6. Restart Remotion Studio at `http://localhost:3001` for final preview.
