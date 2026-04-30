# Bottleneck — Theory of Constraints

**Hook:** Your business runs at the speed of its slowest part.
**Length target:** ~45-55 seconds.
**Visual signature:** Editorial factory line. Stations as boxes; arrows for flow; queue dots for WIP buildup. Ochre warning + red bottleneck pulse.

## Scenes

### 01 — Title
A cold open: bold typography. "A chain is only as strong as…" / "…its weakest link."
Animation: `InkWipeLine` for both lines; the second is in accent.

### 02 — Factory line draws on
Eyebrow: "EVERY BUSINESS · IS A LINE". Three Stations draw on left-to-right with FlowArrows between, equal capacity. Labels: DESIGN · BUILD · SHIP. Rates: "100/min · 100/min · 100/min". Throughput counter top-right counts up to 100/min.

Sync notes:
- "design" → first station fades in
- "build" → second station fades in
- "ship" → third station fades in

### 03 — One station weakens
The middle station's rate drops to 40/min (text crossfades). Its border turns ochre.
Queue dots accumulate before it. Output arrow thins to a trickle.
Throughput counter drops 100 → 40.

Sync notes:
- "slowest" → middle station ochre + label "BOTTLENECK"
- "queue" / "pile" → QueueDots stagger in
- "drops" → counter ticks down

### 04 — The tempting fix
Top-half: Worker speeds up DESIGN (rate 100 → 200/min). Pulse on first station (positive green).
Bottom-half: Throughput counter… stays at 40.
Punchline: "Faster non-bottleneck = more inventory. Same output."

Sync notes:
- "faster" → first station rate increases visibly
- "still" / "same" → throughput counter pulses but stays
- "more inventory" → queue dots grow longer

### 05 — Fix the bottleneck
Middle station rate climbs 40 → 100/min. Red pulse halo. Queue drains visibly.
Throughput counter jumps 40 → 100.

Sync notes:
- "fix" → red pulse begins
- "this one" → station rate counter ticks up
- "jumps" / "throughput" → counter animates 40 → 100

### 06 — The rule
Editorial typeset rule:
> **Throughput is set by the bottleneck.**
> Improving anything else is theatre.

Sync notes:
- "throughput" → first line wipes in
- "bottleneck" → MarkerHighlight on the word
- "theatre" / "everything else" → second line fades in

### 07 — Outro
DotMark + "made plain" + closing line: *"Find the slow link. Then break it."*

## Word→animation cheat sheet

| Scene | Word cue | Effect |
|---|---|---|
| 02 | design | station 1 in |
| 02 | build | station 2 in |
| 02 | ship | station 3 in |
| 03 | slowest / weakest | station 2 → ochre, BOTTLENECK label |
| 03 | queue / pile | queue dots stack |
| 04 | faster | station 1 rate up |
| 04 | same / still | counter shake (no change) |
| 05 | fix / unblock | red pulse on station 2 |
| 05 | jumps / throughput | counter 40 → 100 |
| 06 | bottleneck | MarkerHighlight |

## House rules
- Durations from `voiceover/manifest.json` only.
- Use `Station`, `QueueDots`, `FlowArrow` primitives from `brand/svg.tsx`.
- Throughput counter is `font-variant-numeric: tabular-nums`.
- Bottleneck color: `colors.warn` (ochre) for "slow" state; `colors.neg` for active pulse.
