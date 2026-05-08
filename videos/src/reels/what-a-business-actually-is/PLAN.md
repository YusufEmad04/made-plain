# What A Business Actually Is — Scenario Plan

**Goal:** Teach the simplest, hardest-to-skip definition of a business: a working loop that **creates value**, **delivers it**, and **captures part of it** as money, margin, or cash. The motif is a three-node triangle that lights up side by side, then breaks deliberately, then re-forms as a continuous loop.

- **Format:** 1080×1920, 9:16, 30 fps
- **Voice:** Laura (`FGY2WhTYpPnrIDTdsKH5`) — same as Equity Journey for feed continuity
- **Pad per scene:** 0.6s of trailing silence
- **Length target:** ~55–62s, 7 scenes
- **Aesthetic:** Dark Made-Plain paper. Display serif headlines, mono numerals/labels, italic body for asides. Accent terracotta for the "live" side, ochre warn for caution, green pos for value reaching the customer, red neg for broken sides.

---

## The motif: the value triangle

A single triangle, drawn once, with three labeled corners. Side colors carry meaning:

| Corner | Meaning |
| --- | --- |
| **CREATE** | Solve a real problem for a real person. |
| **DELIVER** | Make the value reach the customer reliably. |
| **CAPTURE** | Turn part of that value into money, margin, or cash. |

The triangle is the spine of the reel. Each scene either lights one corner, breaks one side, or completes the loop. We never re-explain the triangle; we just keep operating on it.

---

## SVG primitives

### Reused (already in `src/brand/svg.tsx`)
- `DrawPath` — for animating the triangle outline.
- `CoinChip` — coin units flowing back to the business in scene 04.
- `TweenedCoin` — arc-traveling coins.
- `MoneyBill` — short flying $ rectangles.
- `FlowArrow` — directional arrows with optional moving dashes.
- `GrowBar` — for the three capture meters (money / margin / cash).

### New (defined locally inside `index.tsx`)
- **`ValueTriangle`** — three labeled nodes at fixed corners, with per-side state (idle / lit / broken) driven by frame cues. Sides draw on with stroke-dashoffset; broken sides switch to dashed red and pulse once.
- **`PainDot`** — pulsing red circle representing customer pain. Becomes a calm green check on resolution.
- **`CustomerGlyph`** — a minimal silhouette (re-uses the `InvestorChip` shape but local, with role label "CUSTOMER").
- **`BusinessTypeCard`** — a small framed card containing a mini value-triangle plus a sector label and a single highlighted "weak side."

These are local because they encode this reel's lesson tightly. If they prove useful in later May reels, promote them to `svg.tsx`.

---

## Committed copy

| Scene | On-screen copy | Narration |
| --- | --- | --- |
| 01 hook | Eyebrow: `§ DAY 1 · WHAT IS A BUSINESS` · Headline: **An idea is not a business.** | "An idea is not a business yet. A business is a system that does three things." |
| 02 create | Eyebrow: `§ SIDE 1` · Headline: **Create value.** · Caption: *Solve a real problem for a real person.* · Example chips: `LEAKY FAUCET / midnight · water everywhere`, `LATE INVOICE / freelancer · 6-week wait` | "First, it creates value. It solves a real problem for a real person. Like a leaky faucet at midnight, or a freelancer waiting six weeks to get paid." |
| 03 deliver | Eyebrow: `§ SIDE 2` · Headline: **Deliver it.** · Lane labels: `SHIPPED`, `DONE`, `USED`, `MATCHED` | "Then it delivers that value reliably. A product shipped, a service done, an app used, a marketplace matched." |
| 04 capture | Eyebrow: `§ SIDE 3` · Headline: **Capture part of it.** · Meter labels with examples: `MONEY / $10 at the till`, `MARGIN / $2 left after costs`, `CASH / in the bank Friday` | "And it captures part of that value back. Money is what the customer pays, like ten dollars at the till. Margin is what's left after costs, maybe two dollars. Cash is what's actually in the bank on Friday." |
| 05 breaks | Eyebrow: `§ THE LOOP` · Headline: **One missing side breaks the loop.** · Card labels: *Good idea, no buyer.* · *Lots of orders, no margin.* · *Busy work, no real value.* | "If one side is weak, the loop is stuck. Good idea, no buyer. Lots of orders, no margin. Busy work, no real value." |
| 06 types | Eyebrow: `§ SAME LOOP` · Headline: **Different business. Different weak side.** · Card labels with examples: `SOFTWARE / like Notion`, `SERVICES / like a plumber`, `PRODUCTS / like coffee roaster` | "Software like Notion. Services like a plumber. Products like a coffee roaster. Same loop. The weak side is just different." |
| 07 outro | Headline: **Where is your loop weakest?** · Sub: *Start there.* · Wordmark: `MADE PLAIN` | "So the real question is simple. Where is your loop weakest? Start there." |

---

## Scenes

> Durations come from `voiceover/manifest.json`. All cues use `wordCue(scene.words, "<word>")` against ElevenLabs character-aligned timings.

### Scene 01 — Hook  (~6s spoken)
- **Visual:** Black paper. A small lightbulb glyph fades in centered. Three dashed feeler lines try to extend out from it but stall. On "**system**", a clean triangle outline draws around the lightbulb; on "**three**", three labeled nodes pop at its corners: CREATE (top), DELIVER (bottom-right), CAPTURE (bottom-left). The lightbulb gently fades into the triangle's center.
- **Sync:**
  - "idea" → lightbulb fades in
  - "not" → small "x" stamps on the dashed feelers
  - "system" → triangle outline draws on
  - "three" → three corner nodes pop with stagger

### Scene 02 — Create value  (~7s spoken)
- **Visual:** Triangle persists but moved up; CREATE corner is the only lit node. Below it, a `PainDot` pulses on the right ("real problem"). On "**solves**", a solution diamond emerges from the CREATE node and travels toward the pain dot. On "**person**", a `CustomerGlyph` fades in beside the pain dot and the dot turns from pulsing red to a calm green check.
- **Sync:**
  - "creates" → CREATE node lights, pulse halo
  - "real problem" → pain dot pulses
  - "solves" → solution diamond travels along arrow
  - "person" → customer glyph fades in, pain resolves

### Scene 03 — Deliver  (~9s spoken)
- **Visual:** Triangle now lights CREATE + DELIVER (the right-hand side). Below the triangle, four delivery lanes stack like a bus diagram. A single value token (orange disc) splits into four copies that travel along the four lanes to the customer glyph on the right. Each lane label types in on its word: `SHIPPED`, `DONE`, `USED`, `MATCHED`.
- **Sync:**
  - "delivers" → DELIVER node lights, right side of triangle draws
  - "shipped" → box icon + lane 1
  - "done" → handshake/check icon + lane 2
  - "used" → phone/screen icon + lane 3
  - "matched" → two-arrow icon + lane 4

### Scene 04 — Capture  (~8s spoken)
- **Visual:** Triangle now has all three corners lit; the bottom side draws on. Coins (`CoinChip`) fly back from the customer along an arc into a small "business" anchor at the CAPTURE corner. As they land, three labeled meters fill below the triangle: `MONEY` (terracotta), `MARGIN` (green), `CASH` (ochre). Each meter grows on its word.
- **Sync:**
  - "captures" → first coins fly back
  - "money" → MONEY meter grows
  - "margin" → MARGIN meter grows
  - "cash" → CASH meter grows + bottom side of triangle locks in

### Scene 05 — One missing side breaks the loop  (~10s spoken)
- **Visual:** The big triangle slides up and three smaller "mini-loops" fan out beneath it in a row. Each mini-loop is the same value triangle but starts whole, then a single side snaps to dashed-red on its caption.
  - **Card 1:** caption "Good idea, no buyer." — DELIVER side breaks.
  - **Card 2:** caption "Lots of orders, no margin." — CAPTURE side breaks.
  - **Card 3:** caption "Busy work, no real value." — CREATE side breaks.
  Each break flashes a single red pulse, then settles into a dashed broken line.
- **Sync:**
  - "weak" → big triangle slides, three mini-cards fade in idle
  - "good idea, no buyer" → card 1 break
  - "lots of orders, no margin" → card 2 break
  - "busy work, no real value" → card 3 break

### Scene 06 — Same loop, different weak side  (~8s spoken)
- **Visual:** Three `BusinessTypeCard`s slide in vertically. Each card has a mini-triangle and a sector label. As each sector is named, its typical weak side highlights in accent (not broken — just emphasized):
  - **SOFTWARE** — DELIVER lit fully; CAPTURE side highlighted (retention/churn).
  - **SERVICES** — CREATE lit fully; DELIVER side highlighted (scaling delivery).
  - **PRODUCTS** — CREATE lit fully; CAPTURE side highlighted (margin/inventory cash).
  A short caption line below: *"Same loop. Different weak side."*
- **Sync:**
  - "software" → card 1 emphasis
  - "services" → card 2 emphasis
  - "products" → card 3 emphasis
  - "different" → caption italic line wipes in

### Scene 07 — Outro  (~7s spoken)
- **Visual:** Cards collapse. The big triangle re-centers and morphs into a continuous loop: an animated traveling pulse runs CREATE → DELIVER → CAPTURE → CREATE on repeat. On "**weakest**", the loop slows and each node pulses once asking the viewer. Headline `InkWipeLine`: **Where is your loop weakest?** Sub: *Start there.* `DotMark` settles. `MADE PLAIN` wordmark fades in.
- **Sync:**
  - on scene start → loop pulse begins traveling
  - "weakest" → loop slows + nodes triple-pulse
  - "start there" → headline complete + dot mark + wordmark

---

## House-rule compliance (per `videos/WORKFLOW.md`)

- Every `<Sequence>` uses `manifest.json` `startFrame` and `durationFrames` — never hardcoded.
- One mp3 per scene (7 mp3s total).
- Word timings drive every animation beat — components receive `scene.words` and call a local `wordCue(words, needle, fallback)` helper.
- Brand visuals dominate: motion primitives from `src/brand/motion.tsx`, SVG primitives from `src/brand/svg.tsx`. New visuals scoped to this reel are kept local in `index.tsx`; if a primitive proves reusable across May, promote it.
- The 0.6s `pad_seconds` is the audible breath at scene boundaries.

## Verification plan

1. After `script.json`, sanity-read total spoken length (~55s).
2. After TTS, confirm `manifest.totalFrames` ≈ 1700–1900 (≈58–63s).
3. Smoke-render stills:
   - middle of scene 01 (triangle just drawn)
   - end of scene 04 (all three corners lit, meters filled)
   - middle of scene 05 (one card broken)
   - end of scene 06 (three sector cards visible)
4. `npx tsc --noEmit` from `videos/`.
5. `npx remotion studio` — visually check sync of named beats vs spoken words.
6. `npx remotion render WhatBusinessActuallyIs out/what-a-business-actually-is.mp4`
