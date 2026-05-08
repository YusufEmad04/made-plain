# A Business Has Three Jobs — Scenario Plan v4

**Goal:** Make the framework instantly legible using a persistent **3-cell scoreboard**, a literal **cash-flow animation** for "Keep more than it cost," AND map the three plain-words jobs to the real business concepts viewers will hear elsewhere: **Operations**, **Marketing & Sales**, **Finance**.

- **Format:** 1080×1920, 9:16, 30fps · Voice: Laura · Pad 0.6s
- **Length target:** ~70–80s, **6 scenes**

## What changed v3 → v4

User said: *"you didn't map the video to real concepts like operations and marketing and finance, even you didn't mention these words."*

Fix: every scoreboard cell now has **two labels**:
1. **Plain words** (big, terracotta) — `MAKE` / `HAND OVER` / `KEEP`.
2. **Formal name** (small mono uppercase, muted) — `OPERATIONS` / `MARKETING & SALES` / `FINANCE`.

The plain words let the framework click. The formal names give the viewer the vocabulary they'll meet in books, podcasts, and pitch decks. Narration says each formal name once, plainly: *"This is what people call operations,"* etc. No jargon dump — one clear label, one beat.

## What changed v2 → v3 (still applies)

1. **Persistent scoreboard** as the visual spine, scenes 02–05.
2. **Job 3 is a literal cash-flow animation** — $5 in, $2 out to costs bin, $3 into KEEP jar. Math is the motion.
3. **Trap scene = three rows**, each a mini bakery + mini scoreboard with one ✗.

---

## The motif: a scoreboard with two layers of vocabulary

Top of frame, scenes 02–05:

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│    1     │ │    2     │ │    3     │
│  MAKE    │ │HAND OVER │ │  KEEP    │     ← plain words (terracotta)
│ OPS      │ │ MKT/SALES│ │ FINANCE  │     ← formal name (mono, muted)
└──────────┘ └──────────┘ └──────────┘
```

- Empty in scene 01.
- Slot 1 fills green ✓ at the climax of scene 02; "MAKE" + sub "OPERATIONS" appear.
- Slot 2 fills ✓ at climax of scene 03; "HAND OVER" + sub "MARKETING & SALES".
- Slot 3 fills ✓ at climax of scene 04; "KEEP" + sub "FINANCE".
- Scene 05: 3 mini scoreboards, one ✗ each, showing exactly which formal area is broken.
- Scene 06: full checklist returns with both layers.

---

## SVG primitives (local)

- **`Scoreboard`** — props: `state: ('empty'|'check'|'cross')[3]`, `revealAt: [number, number, number]` (frame each cell ✓/✗), `labels: ['MAKE'|...]`, `subLabels: ['OPERATIONS'|...]`, optional `mini` boolean for trap scene.
- **`Bakery`**, **`BreadLoaf`**, **`Customer`**, **`Bill`**, **`KeepJar`** — kept from v2.
- **`CostsBin`** — wooden crate labeled `FLOUR · POWER · TIME` that catches the $2 bill.

---

## Committed copy v4

| # | Eyebrow | Headline | Sub | Narration |
| --- | --- | --- | --- | --- |
| 01 hook | `§ DAY 1 · WHAT IS A BUSINESS` | **A tiny bakery.** | *Three things have to be true.* | "If you opened a tiny bakery tomorrow, three things have to be true. Or you don't have a business yet. You just have an idea." |
| 02 make | `§ JOB 1 · MAKE` | **Make something they want.** | *This is what people call operations.* | "Job one. Make something people actually want. Smelling-bread-on-the-sidewalk good. Not the kind you wish people wanted. This is what people call operations." |
| 03 hand | `§ JOB 2 · HAND OVER` | **Get it into their hands.** | *This is marketing and sales.* | "Job two. Get it into their hands. The shop has to be open. The customer has to find it. And the bread has to cross the counter. This is what people call marketing and sales." |
| 04 keep | `§ JOB 3 · KEEP` | **Keep more than it cost.** | *That gap is finance.* | "Job three. Keep more than it cost. The customer pays five dollars. Two of those go right back out, for flour, power, and your time. Three dollars stay in the jar. That three-dollar gap is the whole business. People call this finance." |
| 05 trap | `§ THE TRAP` | **Most do only one or two.** | *Find the empty slot.* | "Most things people call a business only do one or two of these. Watch. Bakery A. Great bread. Locked door. Their operations work, their marketing doesn't. Bakery B. Open every day. Bread nobody remembers. Marketing fine, operations broken. Bakery C. Customers everywhere, but five dollars in, six dollars out. Finance is the leak. Find the empty slot. Fix that one." |
| 06 outro | `§ START HERE` | **Is each box checked?** | *Whichever is no — start there.* | "So look at your idea. Is each box checked? Operations. Marketing. Finance. Make. Hand over. Keep. Whichever answer is no, start there." |

---

## Scenes

### Scene 01 — Hook (~7s)
Bakery storefront strokes in centered. Headline "A tiny bakery." wipes in. Sub *"Three things have to be true."* Three empty numbered cells slide in along the bottom — the empty scoreboard.

### Scene 02 — Job 1: Make · Operations (~9s)
Scoreboard top of frame, all empty. Bakery centered-lower. Bread rises in window on "actually want." Customer slides in from right on "smelling-bread." Slot 1 fills ✓ green; **MAKE** label drops in big, **OPERATIONS** sub appears in mono on "operations."

### Scene 03 — Job 2: Hand over · Marketing & Sales (~10s)
Scoreboard with slot 1 already ✓. CLOSED → OPEN flip on "open." Customer slides to door on "find it." Loaf arcs across counter on "counter." Slot 2 fills ✓; **HAND OVER** + sub **MARKETING & SALES** appears on "marketing."

### Scene 04 — Job 3: Keep · Finance (~16s)
Frame becomes a money-flow diagram. Three labeled zones: **CUSTOMER** (bottom-right), **BAKERY** (center, smaller), **COSTS BIN** (left), **KEEP JAR** (right of bakery).
- "five dollars" → customer pushes $5 up into bakery; mono `IN  $5` lands.
- "two of those" → $2 flies LEFT into costs bin; `OUT  $2` lands.
- "three dollars stay" → $3 drops into KEEP jar; jar fills green; `KEEP  $3` lands.
- "the whole business" → terracotta ring pulses around jar; slot 3 ✓.
- "finance" → sub label **FINANCE** appears under slot 3.

### Scene 05 — The trap (~22s)
Three horizontal rows stack in, one per bakery. Each row: mini bakery (180px) · mini scoreboard `[1][2][3]` · two-line caption (plain words above, formal diagnosis below).

| Row | Bakery state | Scoreboard | Caption (plain) | Caption (formal) |
| --- | --- | --- | --- | --- |
| A | bread visible · padlocked door | `[✓][✗][·]` | *Great bread. Locked door.* | OPS ✓ · MKT ✗ |
| B | open · dull `meh` loaf | `[✗][✓][·]` | *Open all day. Forgettable bread.* | OPS ✗ · MKT ✓ |
| C | open · bread visible | `[✓][✓][✗]` | *$5 in. $6 out.* | OPS ✓ · MKT ✓ · FIN ✗ |

Each row's red ✗ pulses once. Footer: "*Find the empty slot. Fix that one.*" big italic.

### Scene 06 — Outro (~9s)
No bakery. Centered checklist with **two-layer labels**:
- □ **People want it.** · `OPERATIONS`
- □ **They can get it.** · `MARKETING & SALES`
- □ **You keep more than you spent.** · `FINANCE`

Each box checks green on its formal name word ("operations", "marketing", "finance"). Sub: "*Whichever is no — start there.*" + DotMark + MADE PLAIN.

---

## House rules

- Every `<Sequence>` reads `manifest.startFrame` / `durationFrames`.
- Word timings drive every beat (`wordCue`).
- Headlines 110-130px, sub italics 48-60px, mono labels 36-44px.
- Scoreboard cells full-size: 280×220 with 90px numerals, 44px plain word, 24px formal sub.
- Mini scoreboard: 100×80 cells.
- Every abstract claim ships with a visible thing.

## Verification

1. After TTS: confirm `manifest.totalFrames` ≈ 2200-2500.
2. Smoke-render mid-scene stills covering each scene.
3. Look for: scoreboard never collides with bakery; scene 04 zones don't overlap; scene 05 rows fit within stage; outro labels don't clip.
4. `npx tsc --noEmit`.
5. `npx remotion render BusinessThreeJobs out/business-three-jobs.mp4`.
