# Reel — Cash Conversion Cycle

> **Hook:** "Profit is opinion. Cash is timing."
> **Concept:** The Cash Conversion Cycle (CCC) — the gap between
> paying suppliers and getting paid by customers. Two businesses
> with the same P&L can have wildly different lives depending on
> how this gap is shaped.
> **Length target:** ~22–26s (manifest decides).

---

## Visual system

A horizontal **pipeline** runs left → right across the canvas.
Money is a coin (`TweenedCoin`) that flows along it, passing through
three stamped stages:

```
[ Pay supplier ] ──── [ Hold inventory ] ──── [ Get paid ]
       ●─────────────────────●──────────────────────●
       day 0                 day 30                day 60
```

Two reusable visual primitives we'll add to `src/brand/svg.tsx`:

- **`Pipeline`** — a horizontal track with stamped stage markers,
  drawn-on stroke, optional shaded "trap zone" between two x-coords.
- **`Pipe`** (alias) — a fat editorial line with rounded caps + tick
  stops, sized in days.

---

## Scenes (rough — voice will pin durations)

### 01-title — *"Profit is opinion. Cash is timing."*
- **Visual:** Cold open on the line `Profit is opinion.` typeset in
  Newsreader italic, large. After 0.7s an `InkWipeLine` slashes
  through "is" and overwrites it with `was`. Then second line
  `Cash is timing.` wipes in beneath, "timing." in accent.
- **Narration:** "Profit is opinion. Cash is timing."

### 02-pipeline — *"Every business is a pipeline."*
- **Visual:** A long horizontal pipe draws on across the canvas,
  with three stamped stops. As the narrator says each stage name,
  its label fades in: *Pay supplier* → *Hold inventory* → *Get paid*.
- **Narration:** "Every business is a pipeline. You pay your
  supplier. You hold inventory. You get paid."

### 03-coin-flow — *"That gap is your cash conversion cycle."*
- **Visual:** A `$1` coin (`TweenedCoin`) leaves a wallet on the left,
  enters the pipe at *Pay supplier*. The pipe segment from
  *Pay supplier* → *Get paid* fills with a translucent red wash —
  the "trapped" zone. A counter ticks: `cash trapped — 60 days`.
  At the right end, the coin re-emerges as a `$1.20` coin (mark-up).
- **Narration:** "The gap between paying out and getting paid back
  — that's your cash conversion cycle."

### 04-two-businesses — *"Same P&L. Different lives."*
- **Visual:** Two pipelines stacked.
  - **Top — Apple-style:** *Get paid* tick comes first, *Pay supplier*
    later. The trap zone is shaded **green** ("cash floats free")
    and labeled `–30 days`.
  - **Bottom — corner store:** *Pay supplier* day 0, *Get paid*
    day 60. Trap zone shaded red, labeled `+60 days`.
  - On the right of each: a small **runway** bar grows up (Apple)
    or shrinks down (corner store). Both have the same revenue
    label at top: `$1M / mo`.
- **Narration:** "Same revenue. Same margins. One floats on free
  customer cash. The other drowns in supplier debt."

### 05-formula — *"Days inventory plus days receivable, minus days payable."*
- **Visual:** A clean editorial equation typesets in:
  ```
  CCC  =  DIO  +  DSO  −  DPO
  ```
  Each term wipes in on its word. After the equation lands, three
  small numerals slot under each variable for the corner store:
  `45 + 30 − 15 = 60`. A pulse highlights the answer.
- **Narration:** "Days holding inventory, plus days waiting on
  customers, minus days you owe suppliers."

### 06-shrink-the-pipe — *"Three levers."*
- **Visual:** The corner store's pipeline returns. Three labeled
  arrows compress it from different sides:
  1. `Sell faster` — *Hold inventory* tick slides left.
  2. `Get paid sooner` — *Get paid* tick slides left.
  3. `Pay later` — *Pay supplier* tick slides right.
  The red trap zone narrows on each push. Final state: trap zone
  collapses to a thin sliver; counter reads `cash trapped — 8 days`.
- **Narration:** "Sell faster. Get paid sooner. Pay later. Squeeze
  the cycle and your business funds itself."

### 07-outro — *"Profit is opinion. Cash is timing."*
- **Visual:** Pipeline fades. Centered: brand dot mark + "made plain"
  in display 900. The opening line returns as a small caption.
- **Narration:** "Profit is opinion. Cash is timing."

---

## Sync notes (word → animation)

| Scene | Trigger word | Animation |
|------|--------------|-----------|
| 02 | "supplier" | `Pay supplier` label appears |
| 02 | "inventory" | `Hold inventory` label appears |
| 02 | "paid" | `Get paid` label appears |
| 03 | "gap" | trap zone fades in |
| 03 | "cycle" | counter ticker starts |
| 04 | "floats" | green wash fills top pipeline |
| 04 | "drowns" | red wash fills bottom pipeline |
| 05 | "DIO" | first numeral lands |
| 05 | "DPO" | minus sign + last numeral |
| 06 | "faster" | inventory tick slides |
| 06 | "sooner" | get-paid tick slides |
| 06 | "later" | pay-supplier tick slides |
