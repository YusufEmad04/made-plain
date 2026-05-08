# Engines of Growth — Scenario Plan v5

## Goal

Rebuild the reel as a clear teaching piece, not an advertisement. The viewer should understand the three engines of growth from first principles:

- **Sticky / retention:** customers keep paying because they stay.
- **Viral / audience growth:** users bring more users, creating an audience or network that has value.
- **Paid / unit economics:** you buy customers only when the value they return is greater than what it cost to acquire them.

The revision prioritizes comprehension over speed. The video still moves, but each scene teaches one idea at a time with large, labeled visuals.

## Iteration Review Applied

This plan was reviewed as a first-time viewer before scripting. The review is saved in `PLAN_V5_REVIEW.md`. The following fixes were applied from that critique:

- Scene 02 reveals engines one at a time instead of becoming a dense three-column slide.
- Scene 07 defines CAC and LTV with short ledger rows, not paragraph captions.
- Scene 08 uses full-screen failure panels one after another, not a cramped row grid.
- Scene 09 shows one diagnostic question and one answer at a time.
- The top progress strip is compact and secondary. The main diagram owns the frame.
- Primary teaching text must be 76px or larger; diagram labels 42px or larger; no essential text under 34px.

## What Changed From v4

1. **No logo-like avatars.** Examples are neutral category cards (`STREAMING SUBSCRIPTION`, `GYM MEMBERSHIP`, `SOCIAL APP`, `MATTRESS STORE`) so the reel feels educational, not promotional.
2. **No mystery metaphors.** Every metaphor is translated on screen at the moment it appears: tap = new customers, leaks = churn, water level = active paying customers.
3. **Definitions before acronyms.** CAC and LTV are spelled out before the shorthand appears. K is defined as "new users per user."
4. **One main diagram per beat.** The top framework is reduced to a compact progress strip so the main teaching area has enough room.
5. **Trap becomes three short failure stories.** Instead of crowded rows of engine cards, each failure shows a simple equation going wrong.
6. **Large reel-safe typography.** Primary text 72-118px. Secondary teaching labels 38-52px. Tiny decorative labels removed.
7. **Split Remotion implementation.** `index.tsx` will be a thin manifest router; scenes and primitives live in separate files.

## Visual System

### Canvas

- 1080×1920, 30fps.
- Dark Made Plain paper background.
- Safe margins: 80px horizontal, 90px vertical.
- Main teaching area: center 1220px of height.
- Bottom caption/summary zone: 300px.

### Progress Strip

The old full flywheel + three pedestals took too much screen. v5 uses a compact strip at the top:

```
GROWTH ENGINES
[ STICKY ] [ VIRAL ] [ PAID ]
NEW>LOST   K>1      LTV>CAC
```

- Active engine lights in its color.
- Inactive engines are dim.
- The strip stays small and never competes with the main diagram.

### Layout Discipline

Every scene must use exactly one of these layouts:

1. One large diagram + one large sentence.
2. Two-number comparison + one consequence line.
3. One question card + one answer tile.

If a scene needs more than that, split the beat instead of shrinking text. The progress strip is optional in scenes 01-02 and compact thereafter.

### Engine Colors

- Sticky blue: `#5B8FB9`
- Viral magenta: `#C13584`
- Paid gold: `#D4A24E`
- Success green: brand `colors.pos`
- Failure red: brand `colors.neg`

## Scene List

### 01 — The Problem: Not all growth is the same

**Purpose:** Stop the scroll and set the mental frame.

**Visual:** A large wheel in the center. Three different hands push it from three sides: blue, magenta, gold. The wrong hand pushes and the wheel jams. The correct hand lights the wheel.

**On-screen text:**

- `NOT ALL GROWTH IS THE SAME.`
- `The engine has to match the business.`

**Narration:**

"Growth is not one thing. A subscription app, a social app, and a mattress store do not grow the same way. Each one needs a different engine. Pick the wrong engine, and the wheel can move fast while the business goes nowhere."

**Sync notes:**

- "subscription app" → blue label appears.
- "social app" → magenta label appears.
- "mattress store" → gold label appears.
- "wrong engine" → wheel jams red.
- "goes nowhere" → wheel spins but center dot stays locked.

---

### 02 — The Framework: Three engines, three questions

**Purpose:** Give the viewer a map before details.

**Visual:** Three big columns, not tiny cards, revealed sequentially:

1. `STICKY` — question: `Do customers stay?`
2. `VIRAL` — question: `Do users bring users?`
3. `PAID` — question: `Does one customer return more than it cost to get them?`

Each column has one large icon: loop arrow, branching users, ledger. Only the current column is fully bright. After all three are introduced, they shrink into the compact progress strip used for the rest of the reel.

**On-screen text:**

- `Sticky: NEW CUSTOMERS > CHURN`
- `Viral: NEW USERS PER USER > 1`
- `Paid: CUSTOMER VALUE > ACQUISITION COST`

**Narration:**

"There are three common engines. Sticky growth means customers keep staying. Viral growth means users bring more users. Paid growth means you can buy customers profitably. Each engine has one question, and one inequality."

**Sync notes:**

- Each engine lights as named.
- Each question appears before its inequality.
- The three columns are never fully text-heavy at the same time until they are already summarized.

---

### 03 — Sticky: retention and churn

**Purpose:** Fix the bucket metaphor by explicitly mapping it to business reality.

**Visual:** Two halves:

- Left: labeled bucket diagram.
- Right: active customer counter.

Labels are large and anchored to the diagram:

- `NEW CUSTOMERS JOIN` above the tap.
- `ACTIVE PAYING CUSTOMERS` inside the water.
- `CHURN / CANCELS` at the leak.

Numbers animate:

- Start: `100 active customers`.
- New joins: `+20`.
- Churn: `-8`.
- End: `112 active customers`.
- Inequality: `20 new > 8 churn`.

**On-screen text:**

- `STICKY = customers stay long enough to pay again.`
- `NEW > CHURN`

**Narration:**

"Sticky growth is retention. Think of active customers as the water level. New customers join at the top. Churn is customers cancelling at the bottom. If twenty customers join this month and eight cancel, the active customer base grows. Sticky works when new customers are greater than churn."

**Sync notes:**

- "active customers" → water label appears.
- "new customers" → tap label and +20 appear.
- "churn" → leak label and -8 appear.
- "greater than" → inequality snaps green.

---

### 04 — Sticky Example: why churn destroys future months

**Purpose:** Show why retention matters, not just what it is.

**Visual:** A neutral `STREAMING SUBSCRIPTION` customer card. The customer pays `$12` each month on a six-month calendar.

Beat A: customer stays.

- `$12` lands on Jan, Feb, Mar.
- Total grows to `$36`.

Beat B: customer cancels after March.

- Customer exits through a `CANCEL` door.
- Apr, May, Jun turn red and show `missed $12`.
- Footer: `Churn removes future months.`

**On-screen text:**

- `They did not lose one payment.`
- `They lost the remaining relationship.`

**Narration:**

"Here is why churn hurts. A streaming subscription does not only earn today. It earns again next month, and the month after that. If the customer cancels in March, April, May, and June disappear too. Retention protects the future payments."

**Sync notes:**

- "next month" → Feb bill.
- "month after" → Mar bill.
- "cancels" → customer exits.
- "disappear" → future months strike red.

---

### 05 — Viral: K and audience growth

**Purpose:** Explain virality in plain words.

**Visual:** One user token in the middle. Arrows branch to invited users.

Two modes shown side-by-side, but sequentially:

1. Green mode: `K = 1.3` → one user creates more than one new user on average; crowd grows.
2. Red mode: `K = 0.6` → each user creates less than one; the chain fades.

Big plain definition:

`K = new users each user brings, on average`

**On-screen text:**

- `VIRAL = users bring users.`
- `K > 1 means the audience compounds.`

**Narration:**

"Viral growth means users bring users. The important number is K: how many new users one user brings on average. If K is above one, the audience can compound. If K is below one, the chain fades, even if the product is good."

**Sync notes:**

- "users bring users" → first branch.
- "K" → definition plate appears.
- "above one" → green branch expands.
- "below one" → red branch fades.

---

### 06 — Viral Example: why audience businesses need scale

**Purpose:** Explain the goal of viral platforms: audience or network density.

**Visual:** A social app screen with two panels:

- Small audience: `120 users` → advertiser card says `too small` and walks away.
- Large audience: `1,200,000 users` → advertiser card pays because there is attention to buy.

A value chain draws slowly:

`USERS → ATTENTION → PLATFORM → PAYING SIDE`

Use `PAYING SIDE` instead of only advertisers so it covers ads, creators, sellers, and marketplace demand.

**On-screen text:**

- `Users may pay $0.`
- `The audience creates the value.`
- `No audience → no paying side.`

**Narration:**

"For many social and audience businesses, users may pay nothing. The value is the audience itself: attention, network activity, or demand in one place. When the audience is small, the paying side has nothing to buy. Viral growth matters because it builds the thing the business sells."

**Sync notes:**

- "pay nothing" → `$0` over user panel.
- "audience itself" → crowd scales up.
- "paying side" → buyer card appears.
- "nothing to buy" → buyer walks away from small panel.

---

### 07 — Paid: CAC, LTV, and profit

**Purpose:** Define CAC and LTV clearly and show the math.

**Visual:** A big ledger with three rows:

1. `CAC` row: `cost to get one customer`. Example: `-$40`.
2. `LTV` row: `value from that customer over time`. Example: `+$120`.
3. `Profit after acquisition` = `+$80`.

Then a red counterexample flips in:

- `CAC -$90`
- `LTV +$60`
- `Loss -$30`
- Footer: `Buying more customers buys more losses.`

**On-screen text:**

- `PAID = acquire customers profitably.`
- `LTV must be bigger than CAC.`

**Narration:**

"Paid growth means you spend money to acquire a customer. CAC means Customer Acquisition Cost: ads, sales, commissions, or promotions used to win one customer. LTV means Lifetime Value: what that customer pays over the relationship. Paid works only when LTV is bigger than CAC. If it costs ninety dollars to get sixty dollars back, growth is just buying losses."

**Sync notes:**

- "CAC means" → CAC definition row expands.
- "LTV means" → LTV definition row expands.
- "bigger" → profit row turns green.
- "ninety" / "sixty" → red counterexample.
- The long formal terms appear once as a clear definition reveal, then the shorter acronyms carry the math.

---

### 08 — The Trap: wrong engine, concrete failure stories

**Purpose:** Show why the wrong engine is not just ineffective; it can make the business worse.

**Visual:** Three large story panels, one after another, not all simultaneously.

**Panel A: Subscription with churn**

- Ads pour `+50 signups` into a subscription app.
- `-45 cancel before month 2` drains out.
- Message: `Ads cannot fix a retention leak.`

**Panel B: Social app with no sharing**

- Paid ad buys one user at a time into an empty room.
- `K = 0.4` appears.
- Message: `Buying users is not the same as building an audience.`

**Panel C: Product with bad unit economics**

- T-shirt order: `Revenue $25`, `cost + shipping $30`.
- Viral lightning multiplies orders.
- Loss counter accelerates: `-5 → -500 → -5,000`.
- Message: `Viral demand multiplies bad math.`

**Narration:**

"The wrong engine creates traps. A subscription app can pour money into ads, but if customers cancel before month two, ads only refill a leaking base. A social app can buy isolated users, but that is not the same as building an audience. And if each product sale loses money, going viral only multiplies the loss."

**Sync notes:**

- Each failure gets full screen for several seconds.
- No small trap rows.
- Message line is always at least 52px.
- The scene ends with a simple three-line summary: `Sticky leak`, `Viral stall`, `Paid loss`.

---

### 09 — Which engine is yours?

**Purpose:** Give a practical diagnostic that feels calm and useful.

**Visual:** One question card at a time. A large pointer moves to one of three engine answer tiles.

Question 1:

`Does the same customer pay again and again?`

- Yes → Sticky. Check: `new customers > churn`.

Question 2:

`Do users create the audience or network that makes money possible?`

- Yes → Viral. Check: `K > 1`.

Question 3:

`Do you win customers one at a time with marketing or sales?`

- Yes → Paid. Check: `LTV > CAC`.

**Narration:**

"To choose yours, ask calmly. Does the same customer pay again and again? Start with sticky: new customers must beat churn. Do users create the audience or network that makes money possible? Start with viral: K must be above one. Do you win customers one at a time with marketing or sales? Start with paid: LTV must beat CAC."

**Sync notes:**

- Each question appears alone.
- Engine answer tile grows large, then settles.
- Avoid moving three examples at once.

---

### 10 — Outro: one engine, one inequality

**Purpose:** Leave the viewer with the framework and a self-application prompt.

**Visual:** Three inequalities appear one at a time in huge type:

- `NEW CUSTOMERS > CHURN`
- `K > 1`
- `LTV > CAC`

Then they collapse into:

`YOUR ENGINE: ____ > ____`

Small Made Plain mark.

**Narration:**

"Do not chase every kind of growth. Pick the engine your business actually needs. Then make its inequality true."

**Sync notes:**

- Hold final blank inequality for silent tail.

## Script Target

- Target length: 2:25 to 2:45 including padding.
- Narration target: roughly 400-430 words.
- Voice tone: calm explainer, less hype.
- Avoid sales words like "unlock," "secret," "dominates," "crushes," or "growth hack."

## Remotion Implementation Plan

```
engines-of-growth/
├── index.tsx
├── data.ts
├── timing.ts
├── primitives.tsx
├── scenes/
│   ├── 01-problem.tsx
│   ├── 02-framework.tsx
│   ├── 03-sticky.tsx
│   ├── 04-sticky-example.tsx
│   ├── 05-viral.tsx
│   ├── 06-viral-example.tsx
│   ├── 07-paid.tsx
│   ├── 08-trap.tsx
│   ├── 09-diagnostic.tsx
│   └── 10-outro.tsx
└── voiceover/
```

### Shared primitives

- `SceneShell` — applies background, padding, progress strip.
- `ProgressStrip` — compact engine map at top.
- `BigHeadline` — reel-safe text.
- `DefinitionCard` — large definition box.
- `Inequality` — large comparison row with success/failure state.
- `CustomerToken` — polished abstract person.
- `BucketModel` — labeled sticky diagram.
- `CalendarRevenue` — month boxes with payments or missed payments.
- `BranchingUsers` — K-based user growth diagram.
- `AudiencePanel` — small vs large audience panels.
- `Ledger` — CAC/LTV paid-growth math.
- `TrapPanel` — full-screen failure story panel.
- `QuestionCard` — diagnostic question + answer tile.

## Verification Rules

1. Smoke-render at least one frame per scene after TTS.
2. Smoke-render high-risk frames: sticky churn, viral small/large audience, paid loss counterexample, each trap panel, diagnostic question switches, final blank inequality.
3. Reject any still where primary teaching text is under 76px, diagram text is under 42px, essential text is under 34px, clipped, overlapped, or too close to the edge.
4. Keep only one main diagram on screen at a time.
5. Smoke-render every reveal phase in the trap and diagnostic scenes, not just midpoints.
6. Typecheck before render.
7. Final render to `out/engines-of-growth.mp4`.
