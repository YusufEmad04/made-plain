# Equity Pie — Funding, Valuation & Rounds Explained

**Hook:** Startup funding, in plain English. Your company is a pizza.
**Audience:** Total beginners. No business background assumed.
**Length target:** ~50-55 seconds.
**Voice:** Brian (`nPczCjzI2devNBz1zQrb`) — energetic American. Lower stability (0.35), higher style (0.55) for more animation in delivery.
**Visual signature:** Single big pizza in the center. Slices color-coded. Pizza grows when a new round happens. Money bills fly in; slices animate out to investors. Bold typography, lots of confident color (accent + pos + warn).

## Scenes

### 01 — Title (Hook)
"Where does startup money come from? And what do investors actually buy?"

Animation: Cold open. `InkWipeLine` first line, then accent second line. A small pie slice icon appears bottom-right.

### 02 — Your company is a pizza
Pizza appears (one whole pie). Eyebrow: "EQUITY · MADE PLAIN".
"Imagine your company is a pizza. The whole thing belongs to you, the founder."

Animation: Pizza draws on (radial sweep). Single 100% slice, labeled "FOUNDER". Counter shows "100%".

Sync notes:
- "pizza" → pizza pops in
- "founder" → label fades in, 100% counter ticks up

### 03 — Valuation = how much the pizza is worth
"Now — how much is your pizza worth? That's your valuation. Maybe a million dollars. Maybe ten."

Animation: Pizza stays. Big "$1,000,000" tag flies in next to it. Then shifts to "$10,000,000" with a quick jump. Sub-label: "VALUATION".

Sync notes:
- "valuation" → tag flies in
- "million" → $1M
- "ten" → jumps to $10M

### 04 — Investors buy slices
"An investor says: I'll give you cash. In return, I want a slice."

Animation: A "$" coin/bill flies in from off-screen toward the pie. Pie cuts: 80% founder slice, 20% pulls out and floats toward an "INVESTOR" label. Dollar amount on the slice: "$200K → 20%".

Sync notes:
- "cash" → bill flies in
- "slice" → 20% slice separates and slides out
- "INVESTOR" label appears on detached slice

### 05 — Rounds: bigger pizza each time
"Each funding round is a bigger pizza, and a higher price."
Three pies appear left-to-right with arrows between:
- PRE-SEED — small pie, $1M valuation, sliver to angel
- SEED — medium pie, $5M, slice to seed VC
- SERIES A — big pie, $25M, larger slice to Series A VC

Sync notes:
- "pre-seed" → pie 1 in
- "seed" → pie 2 in (arrow draws)
- "series a" → pie 3 in (arrow draws)

### 06 — Dilution = your % shrinks, but the pie is bigger
"Yes, your slice gets smaller. But the pizza gets way bigger."
Animation: Comparison. Left: 100% of $1M. Right: 60% of $25M. Big arrow. Big "$15M" highlight. Lesson: "Your slice is smaller — but worth way more."

Sync notes:
- "smaller" → slice shrinks (60%)
- "bigger" → pie scales up
- "worth" → big dollar value lands

### 07 — Outro
DotMark + "made plain" + closing line: *"Smaller slice. Bigger pie. Bigger life."*

## Word→animation cheat sheet

| Scene | Word | Effect |
|---|---|---|
| 02 | pizza | pie draws on |
| 02 | founder | 100% label appears |
| 03 | valuation | $ tag flies in |
| 03 | million | $1M |
| 03 | ten | jumps to $10M |
| 04 | cash | bill animates in |
| 04 | slice | slice detaches |
| 05 | pre-seed | pie 1 |
| 05 | seed | pie 2 |
| 05 | series | pie 3 |
| 06 | smaller | slice shrinks |
| 06 | bigger | pie grows |
| 06 | worth | dollar lands |

## House rules
- Durations from `voiceover/manifest.json`. Never hardcode.
- Add `<Pie>` primitive to `brand/svg.tsx` (radial slices, labels, growth animation).
- Use accent + pos + warn liberally — this is the "energetic" reel.
- Numbers in `font-variant-numeric: tabular-nums`.
