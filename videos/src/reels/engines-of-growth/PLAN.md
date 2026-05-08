# Engines of Growth — Scenario Plan v4

**Goal:** Teach the three engines of growth — **STICKY**, **VIRAL**, **PAID** — and the one inequality each must satisfy. The viewer learns not just *how* each engine works, but *why* a specific business model requires it. The motif is a single **flywheel** at the top of frame, slowly turning as each of three engines proves itself; each engine has its own color (blue / magenta / gold) so the viewer can track them at a glance through the trap and diagnostic.

- **Format:** 1080×1920, 9:16, 30fps · Voice: Laura · Pad 0.6s
- **Length target:** ~1:55, **8 scenes**
- **Posted to:** Facebook · Instagram · LinkedIn · TikTok (scrolling-feed context — first 1.5s decides whether the viewer stops, visuals must work even with sound off)

## What changed v3 → v4 (animation critique pass)

User said: *"critique everything, especially the 2D animations. Do they explain concepts well? Think as a 3rd-person viewer — is the video informative?"*

1. **Scene 01 hook reopens with a HARD STOP.** v3 had a "small flywheel spinning gently" which doesn't stop a thumb on TikTok. v4 opens on a beautiful fast-spinning flywheel that **stops dead with a thud and a red ✗ on frame 5**. The scroll-stopper.
2. **Per-engine color coding.** STICKY = blue (water), VIRAL = magenta (energy), PAID = gold (money). Used consistently from scene 03 on so when all three engines reappear small in the trap and outro, the viewer identifies them at a glance.
3. **Persistent spine made explicit.** The flywheel + three pedestals stay visible at top of frame throughout scenes 03-07, dimmed, with the active engine highlighted.
4. **Sticky calendar beat: cause→effect made one motion.** Each month the `$` literally floats from the customer's head up into the calendar slot. No mental bridging required.
5. **Viral monetization beat now uses a 4-node VALUE CHAIN diagram** (`USERS → ATTENTION → PLATFORM → ADVERTISER`) drawing on as the stadium fills. The most counter-intuitive insight in the reel is now diagrammatic, not just narrated.
6. **K coefficient now visualized as a DIAL GAUGE** swinging between green (>1) and red (<1) zones. "Half a seed" was ambiguous; a swinging needle is universal.
7. **Paid "over time" replaced with a 12-month calendar** where a `$` lands each quarter. Concrete instead of generic-clock.
8. **Pick-your-engine: text-heavy diagnostic replaced with three real-company avatars** (Netflix, Facebook, Casper) physically sliding into their matched engine slot as conditions are named.
9. **Scene transitions specified** so the reel feels continuous, not slideshow.
10. **Outro held-silence frame** added — last ~1.5s sits on the empty `▢ > ▢` so the viewer's mind fills it in for their own business.

What stayed unchanged from v3: total length (~1:55), narration word count (~291), the 8-scene structure, every WHY beat (audience-IS-the-product for viral, lose-every-future-month for sticky, 8-years-no-return for paid).

---

## The motif: one flywheel, three engines

A persistent visual spine that runs from scene 02 to the end:

- **Top of frame:** A circular flywheel labeled `GROWTH`. Starts dead still in scene 01. Each engine that proves itself gives the wheel a quarter-turn. By the end of scene 05 it's spinning steadily and stays spinning through the trap, pick, and outro.
- **Below the flywheel:** Three pedestals — one per engine — visible top-of-frame from scene 02 onward.
- Each engine has plain-word + formal-name + the one inequality on its face:

| | Plain (large, terracotta) | Formal (mono, muted) | Gauge | Engine color |
| --- | --- | --- | --- | --- |
| 1 | **STICKY** | `RETENTION` | `NEW IN  >  LOST OUT` | **Blue** (water) |
| 2 | **VIRAL** | `VIRALITY` | `K  >  1` | **Magenta** (energy) |
| 3 | **PAID** | `UNIT ECONOMICS` | `LTV  >  CAC` | **Gold** (money) |

**Persistence rule:** During scenes 03-07, the flywheel + three pedestals stay visible at the top of the frame, dimmed. The active engine in each scene lights up in its color; the other two stay greyed. This is what makes the spine a spine — the viewer always sees the framework, never just the current piece.

---

## SVG primitives (local — to be defined in `index.tsx`)

- **`Flywheel`** — circular wheel with motion-blur spin, sudden-stop / dust-puff state, quarter-turn / full-turn cues, sad-wobble state, steady-spin state.
- **`EnginePedestal`** — props: `kind: 'sticky'|'viral'|'paid'`, `state: 'preview'|'dim'|'active'|'red'`, `mini` boolean for small reappearances in trap and pick.
- **`LeakyBucket`** — tap on top, leak holes at bottom, water level marker, `+ NEW` / `– LOST` counters.
- **`MonthCalendar`** — props: `months: 6|12|96`, slot fill state per month (`empty`|`paid`|`lost`), used in sticky scene 03 and paid scene 05.
- **`DoublingChain`** — seeds with faces; spawns descendants per K value; magenta theme.
- **`KDial`** — half-circle dial, needle, green zone `> 1`, red zone `< 1`.
- **`Stadium`** — audience grid filling/draining; backdrop for the value chain.
- **`ValueChain`** — 4 nodes (`USERS`, `ATTENTION`, `PLATFORM`, `ADVERTISER`) with directional arrows; node lighting cues; broken-arrow state.
- **`AdvertiserGlyph`** — figure walking in with check labeled `$$$ AD SPEND`, walking out with uncashed check on broken state.
- **`CoinSlotMachine`** — boxy machine, `CAC` slot left, `LTV` chute right, customer pop-out from top, broken-state with bills falling out the bottom into a `– LOSS` puddle.
- **`CompanyAvatar`** — small branded card (Netflix `N`, Facebook `f`, Casper mattress); slides into slots in scene 07.
- **`MiniFlywheel`** — small static flywheel for trap row indicators; freezes / stutters on bad-engine reveal.

These are local because they encode this reel's lesson tightly. If they prove useful in later reels, promote them to `src/brand/svg.tsx`.

---

## Color palette (engine spine)

- **STICKY · blue** — `#5B8FB9` (water blue, calm)
- **VIRAL · magenta** — `#C13584` (energetic, "spreads")
- **PAID · gold** — `#D4A24E` (money, "coin")
- **Failure red** — `#9C3D2D` (existing brand)
- **Success green** — `#3B7A57` (existing brand)
- **Background paper** — `#13110E` (existing)
- **Ink cream text** — `#F1ECDF` (existing)
- **Accent terracotta** — `#E5572A` (used only for plain-word headlines, matches house style)

---

## Committed copy

| # | Eyebrow | Headline | Sub | Narration |
| --- | --- | --- | --- | --- |
| 01 hook | `§ DAY 4 · HOW BUSINESSES GROW` | **Most businesses don't fail from no growth.** | *They fail from the wrong kind.* | "Most businesses don't fail from no growth. They fail from the wrong kind. Three engines actually grow a business. Pick the wrong one — and you spin in circles." |
| 02 flywheel | `§ THE FLYWHEEL` | **Growth is a wheel.** | *Three engines can spin it. You need one.* | "Growth is a wheel. Stop pushing — it stops. Three engines can keep it spinning. You only need one. The right one for what you sell." |
| 03 sticky | `§ ENGINE 1 · STICKY` | **New in. Old stay.** | *Retention.* | "Sticky. A bucket with a tap on top and leaks at the bottom. New in faster than out — fills. Netflix's engine — they get paid every month you stay. Leave in March, they lose every future month, not just one. Spotify. Your gym. Retention." |
| 04 viral | `§ ENGINE 2 · VIRAL` | **Each brings more than one.** | *Virality.* | "Viral. One person invites friends, who invite more. If each brings more than one — that's K — the chain doubles forever. Below one, dies. Facebook's engine — users pay nothing. Advertisers pay for the audience. The audience IS the product. No virality, no audience, no money." |
| 05 paid | `§ ENGINE 3 · PAID` | **One dollar in. More back.** | *Unit economics.* | "Paid. Spend thirty to win one customer. They pay back ninety. Casper's engine — you buy one mattress, then nothing for eight years. Only way to grow: pay for the next one. And every sale's math has to work. LTV bigger than CAC." |
| 06 trap | `§ THE TRAP` | **Most run the wrong engine.** | *Watch.* | "Most pick the wrong one. A subscription app pours into ads — losing fifteen percent of users monthly. Filling a leaky bucket. A social app chases ad cost — but nobody invites anyone. A T-shirt store hopes for viral — when every shirt loses ten dollars. Wrong engine. No growth." |
| 07 pick | `§ PICK YOURS` | **Which engine is yours?** | *Two questions.* | "Two questions. How does your customer pay you? Monthly — sticky. Once and gone — paid. And where does your money come from? Users pay nothing, advertisers pay? Viral. Match the engine. Make that gauge true." |
| 08 outro | `§ START HERE` | **One engine. One inequality.** | *Make it true.* | "One engine. One inequality. Make that one true — and the wheel turns on its own." |

**Total: ~291 words → ~111s narration + ~5s pads = ~1:55 reel.**

---

## Scenes

### Scene 01 — Hook (~9s) · the scroll-stopper

**Frames 1–5 (the hook hook):** Beautiful, full-color flywheel spinning fast at center frame, motion-blurred, almost cinematic. Then on frame ~5 it **STOPS DEAD** with a thud — visible shudder, dust puff. A red ✗ stamps over it. **This is the stop-the-scroll moment.** Without this, the rest of the reel never gets watched.

**After the freeze:** Three faint engine silhouettes fade in beneath the dead wheel — a leaking bucket, a chain of seeds, a coin slot. Visually distinct so the brain registers "three different things" before any are named.

Headline `Most businesses don't fail from no growth.` wipes in. Sub `They fail from the wrong kind.` italics in.

**Sync:**
- frame 1-5 → fast spin
- "fail" → dead stop + thud + red ✗
- "wrong kind" → wheel makes one wobbly, comically failed attempt to spin again, then gives up
- "three engines" → three silhouettes pulse together in their engine colors (blue, magenta, gold) — first color preview
- "spin in circles" → wheel makes a small useless loop and dies

---

### Scene 02 — The flywheel (~9s) · the framework lands

**Transition from scene 01:** The dead wheel rises up to the top of frame and locks into its permanent home. Now full color, labeled `GROWTH`, but still still. Below it, three pedestals slide up from the bottom and lock into place, each in their engine color (blue / magenta / gold) but currently dim and unlabeled.

A **clearly-readable** human silhouette (large enough to see on a phone — at least 12% of frame height) walks into frame, gives the flywheel one solid push. It turns half a rotation. The figure walks out. The wheel slows, sags, stops with a small dust puff.

This single beat sells the entire premise: growth is something that needs constant force or it dies.

Headline `Growth is a wheel.` Sub *"Three engines can spin it. You need one."*

**Sync:**
- "wheel" → flywheel locks at top
- "stop pushing — it stops" → human walks off; wheel slows and dies
- "three engines" → the three pedestals each pulse with their preview icon (leaking bucket, doubling seed, coin slot) in their engine color
- "the right one for what you sell" → all three pedestals dim back; a `?` appears for ~1s above them — the central question is now planted

---

### Scene 03 — Engine 1 · Sticky · Retention (~17s) · BLUE engine

**Transition:** Camera doesn't cut. The leftmost pedestal at the top of frame **lifts forward and grows** into the centerpiece below. The flywheel and the other two pedestals stay visible at the top, dimmed.

The pedestal unfolds into the **bucket diagram**, all in blue tones:
- A blue tap above a tall wooden bucket
- Visible holes near the bottom
- A water-level marker

Plain-word **STICKY** drops above in big terracotta. Formal name `RETENTION` beneath in mono. Inequality slot to the right: `NEW IN  >  LOST OUT`.

#### Beat 1 — HOW (~5s)
- "tap on top" → tap flips on; blue droplets fall in. Counter `+ NEW` ticks.
- "leaks at the bottom" → grey droplets drain out the holes. Counter `– LOST` ticks.
- "new in faster than out — fills" → inequality `NEW IN > LOST OUT` snaps in green ✓; water rises past the holes; bucket halos green.

#### Beat 2 — WHY (~7s) — the cause-effect linkage
The bucket slides left. To its right unfolds a **calendar of months** — Jan, Feb, Mar, Apr, May, Jun. Inside the bucket, a single small customer figure with a tiny `$` sign over their head appears.

- "Netflix's engine" → calendar appears, customer in bucket lights up.
- "they get paid every month you stay" → each month, a `$10` bill **literally floats from the customer's head up into the next calendar slot**, one at a time. Bills stack visibly: `$10 → $20 → $30 → $40`.
- "leave in March" → customer figure slips out through one of the bucket's holes. The April–June calendar slots flash red and turn into strikethrough `– $10` losses. Total stamps on screen: `– $80 future, gone`.

The lesson lands without explanatory words: a churned customer isn't $10 lost — it's a stack of future bills, vaporized.

#### Beat 3 — Examples + close (~5s)
- "Spotify" → blue chip `SPOTIFY · keep paying = keep playing` lands beside the bucket
- "your gym" → blue chip `THE GYM · auto-renew, forgot to cancel`
- "retention" → formal label `RETENTION` glows blue; **the flywheel at the top of frame turns its first quarter** — the first proof the engine works.

---

### Scene 04 — Engine 2 · Viral · Virality (~18s) · MAGENTA engine

**Transition:** The bucket and calendar visibly shrink and slide back into the leftmost pedestal at top, dimming. The middle pedestal then lifts forward and grows into the centerpiece. Smooth, fluid, no cut.

The pedestal unfolds into the **doubling chain**, all in magenta. A single round seed with a tiny face sits centered.

Plain-word **VIRAL** above in terracotta. Formal `VIRALITY` beneath. Inequality slot: `K  >  1`.

#### Beat 1 — HOW (~6s)
- "one person invites friends" → two thin lines shoot out from the seed; two new seeds bloom. `1 → 2`.
- "who invite more" → from each, two more bloom. `2 → 4 → 8`.
- "each brings more than one — that's K" → a label crystallizes inline: `K = how many new people each person brings, on average`. **K is defined in plain words on screen.**
- "the chain doubles forever" → fast cascade `8 → 16 → 32 → 64`; seeds tile the screen in magenta.

A **K-dial gauge** appears beside the chain — half-circle dial with a needle, green zone marked `> 1` on the right and red zone marked `< 1` on the left. Needle swings to `K = 1.4` in green. Inequality `K > 1` snaps in green ✓.

- "below one, dies" → quick cut: chain resets to one seed; **dial needle swings to red, K = 0.6**. The single seed tries to bloom but only one weak descendant emerges; chain dies in two steps.

#### Beat 2 — WHY (~7s) — the audience-IS-the-product punchline
The seed cloud zooms out. The seeds become tiny figures inside a **massive stadium**, full because virality filled it. Magenta lighting throughout.

A **value-chain diagram** draws on at the bottom of the frame:

```
USERS  →  ATTENTION  →  PLATFORM  →  ADVERTISER
(free)                  (sells it)    ($$$ pays)
```

Each node lights up in sequence as Laura speaks:
- "users pay nothing" → USERS node lights with a small `$0` chip floating above it
- "advertisers pay for the audience" → an **advertiser figure** walks in from the right with a check labeled `$$$ AD SPEND`. Walks past the audience. Hands the check to the PLATFORM node. The ATTENTION arrow pulses; the PLATFORM and ADVERTISER nodes both light up.
- "the audience IS the product" → a high-contrast banner **freezes briefly across the chain**: `THE PRODUCT = AUDIENCE ATTENTION   ·   THE CUSTOMER = THE ADVERTISER`. **This is the line the viewer must leave with.**
- "no virality, no audience, no money" → audience fades to grey; value chain breaks (arrows turn dashed red); advertiser turns and walks away with the uncashed check. Bleak. Then it reverses: audience returns full color, chain restores, advertiser walks back, hands the check over. All in 1.5s.

#### Beat 3 — Examples + close (~3s)
- "Facebook" → magenta chip `FACEBOOK · "tag your friends"` lands
- "TikTok" → magenta chip `TIKTOK · the For You loop`
- "virality" → formal label `VIRALITY` glows magenta; **flywheel turns its second quarter**.

---

### Scene 05 — Engine 3 · Paid · Unit Economics (~17s) · GOLD engine

**Transition:** The stadium and value chain shrink and slide back into the middle pedestal at top. The rightmost pedestal then lifts forward. Gold takes over the palette.

The pedestal unfolds into the **coin-slot machine**: boxy, dead-center. Coin slot LEFT face labeled `CAC`. Payout chute RIGHT face labeled `LTV`.

Plain-word **PAID** above. Formal `UNIT ECONOMICS` beneath. Inequality: `LTV  >  CAC`.

#### Beat 1 — HOW (~5s)
- "spend thirty" → a `$30` gold coin spins and drops into the LEFT slot. Red `– $30` counter above the slot.
- "to win one customer" → customer glyph springs out the top like a vending prize.

A **12-month calendar** appears beneath the machine — Jan through Dec.

- "pays back ninety" → as Laura says "pays back," from the RIGHT chute three `$30` bills pop out one at a time, **and as each bill lands it stamps onto a calendar quarter** (Jan-Mar → `$30`, Apr-Jun → `$30`, Jul-Sep → `$30`). Green `+ $90` counter totals up. The "over time" is now CONCRETE — a year, in months, with a stamp per quarter.

Inequality `LTV > CAC` snaps in green ✓.

#### Beat 2 — WHY (~7s)
The customer glyph that sprang out the machine walks across the frame to the right, completes a transaction, gets a **DONE** stamp, and walks off-screen.

A big calendar spins forward fast — `YEAR 1 → YEAR 8`. The customer doesn't return. **Tumbleweeds blow past** the empty space.

- "you buy one mattress" → mattress glyph appears under the customer briefly, then lingers as a faded ghost in the empty space.
- "then nothing for eight years" → calendar spins; tumbleweeds; deafening silence visually.
- *(Two small inserts, no narration: a phone glyph reading `0 SHARES`. An empty social bubble reading `0 INVITES`. The other two engines are explicitly off the table.)*
- "only way to grow: pay for the next one" → coin machine fires again; another `$30` coin in; another customer pops out. The cycle is **manual, paid every time**.
- "every sale's math has to work" → flash visual: inequality flips to `$50 IN > $40 OUT` red; machine clunks; bills fall out the bottom into a `– LOSS` puddle. Then resets to the working `LTV > CAC` and the puddle drains. *(Quick — 1s. Pre-empts "what if my CAC is too high?")*

#### Beat 3 — LTV/CAC labels + close (~5s)
As Laura says "LTV bigger than CAC," tiny inline labels expand briefly beside the slot and chute:
- `LTV` → "Lifetime Value · what they pay you total"
- `CAC` → "Customer Acquisition Cost · what you paid to get them"

They collapse back to acronyms after ~2s. Examples land:
- gold chip `CASPER · one mattress, gone for years`
- gold chip `WARBY PARKER · five frames, then quiet`
- gold chip `DOORDASH · pay $15 to win, earn $40 over the year`

Final beat: **flywheel completes its full revolution**. Progress arc closes; full green pulse.

---

### Scene 06 — The trap (~19s) · color coding pays off

**Transition:** The big-engine view collapses back to its pedestal. The flywheel slides up and shrinks. The frame restructures into **three horizontal rows** stacked top-to-bottom — same composition family as the *Three Jobs* trap.

Each row contains:
- Small business glyph (left)
- The engine the business is running, **glowing in red** (the wrong choice)
- The engine that's actually broken, sitting greyed beside it in **its own color** (so the viewer knows at a glance: "the broken side is the BLUE engine — the sticky one")
- Caption: plain-words above, **the reason** below
- Mini flywheel for that business on the right — frozen

| Row | Business glyph | Running (red glow) | Broken (engine color, faded) | Plain caption | Reason caption |
| --- | --- | --- | --- | --- | --- |
| A | small SaaS app | PAID coin slot pumping (red) | STICKY bucket gushing (blue, faded) | *Filling a leaky bucket.* | `Revenue is monthly. Each leak = years of future cash, gone.` |
| B | chat bubble | PAID chasing CAC (red) | VIRAL one dying seed (magenta, faded) | *Filling a stadium one seat at a time.* | `Money comes from advertisers. No audience = no advertisers. CAC won't get you there.` |
| C | folded T-shirt | VIRAL hoping for a hit (red) | PAID machine $50 in / $40 out (gold, faded) | *Praying for lightning when the math is broken.* | `Each sale loses $10. Going viral makes losses bigger, not better.` |

Because of color coding, a viewer scanning quickly sees: row A's broken-side is blue (sticky), row B's is magenta (viral), row C's is gold (paid). They don't have to re-read labels.

Narration walks down the rows in order:
- "subscription app pours into ads, losing fifteen percent monthly" → row A: paid pulses red; bucket gushes; `– 15% / mo` chip lands.
- "filling a leaky bucket" → red ring pulses around the bucket.
- "social app chases ad cost — but nobody invites anyone" → row B: paid pulses red; dying seed shrivels; `K = 0.4` red chip lands; tiny stick figure walks into vast empty stadium with one paid ticket *(absurdity is visual)*.
- "T-shirt store hopes for viral — every shirt loses ten dollars" → row C: viral pulses red; coin machine spits red `– $10 / sale`.
- *(Wordless 1.5s flourish on row C: a viral lightning strike fires the chain, seeds explode, but the loss counter accelerates `– $10 → – $1,000 → – $10,000`. Going viral with broken economics multiplies the loss. Strong wordless punchline.)*
- "wrong engine. No growth." → all three mini flywheels freeze in sync; footer wipes in: *"Wrong engine. No growth."* All three rows pulse red once together.

---

### Scene 07 — Pick your engine (~12s) · avatars do the diagnostic

**Transition:** The trap rows clear from top to bottom. The flywheel returns to center, small and waiting. The three engine slots reappear at the bottom in their colors: blue / magenta / gold.

Headline `Which engine is yours?` Sub *"Two questions."*

**Three real-company avatars** appear at the top of the diagnostic area — small, recognizable, branded color/wordmark only:
- A red **N** card (Netflix)
- A blue **f** card (Facebook)
- A small **mattress** card labeled `CASPER`

**Question 1 fires (4s):**
- Big text wipes in: `1 · How does your customer pay you?`
- Beneath: two answer chips — `Monthly` and `Once, then gone.`
- "monthly — sticky" → the **Netflix N card slides down and locks into the blue STICKY slot**. The slot lights up blue. ✓.
- "once and gone — paid" → the **Casper mattress card slides down and locks into the gold PAID slot**. The slot lights up gold. ✓.

The Facebook card stays floating, unmatched. The viewer instantly notices: question 1 doesn't catch it.

**Question 2 fires (5s):**
- Question 1's text fades. New text: `2 · Where does your money come from?`
- Beneath: answer chip — `Users pay nothing. Advertisers pay.`
- "users pay nothing, advertisers pay — viral" → the **Facebook f card slides down and locks into the magenta VIRAL slot**. The slot lights up magenta. ✓.
- A small label flashes briefly: *"The audience IS the product."*

Now all three slots are filled with the right business avatars. The flywheel above gives a satisfying full rotation.

- "match the engine. Make that gauge true." → each engine's gauge pulses big in its color: `NEW > LOST · K > 1 · LTV > CAC`. The two unselected engines for each example dim hard, hammering the focus message.

---

### Scene 08 — Outro (~7s + 1.5s held silence) · the silent handoff

**Transition:** The avatars and slots collapse. The flywheel returns to center stage, full size, **turning steadily** — clean continuous spin, not stuttering.

A single inequality floats above it: `▢  >  ▢` — empty placeholders, intentionally blank.

Headline `One engine. One inequality.` wipes in. The placeholders cycle through the three real inequalities, each shown in their engine color for ~0.6s:
- `NEW IN  >  LOST OUT` (blue)
- `K  >  1` (magenta)
- `LTV  >  CAC` (gold)

…then the inequalities fade back to the empty `▢  >  ▢` shape.

Sub *"Make it true."* italics in. Narration ends.

**The held silence (~1.5s):** the empty `▢  >  ▢` holds on screen with the flywheel spinning behind it. No movement other than the wheel. **This silent frame is the most important moment of the reel** — the viewer's brain fills the placeholders in for their own business.

**DotMark** settles. **MADE PLAIN** wordmark fades in. End.

---

## Length budget

| Scene | Words | Speech (~158 wpm) | + 0.6s pad | Visual budget |
| --- | --- | --- | --- | --- |
| 01 hook | 27 | 10.3s | 10.9s | 9-10s |
| 02 flywheel | 26 | 9.9s | 10.5s | 9s |
| 03 sticky | 46 | 17.5s | 18.1s | 17s (5+7+5) |
| 04 viral | 47 | 17.8s | 18.4s | 18s (6+7+5) |
| 05 paid | 45 | 17.1s | 17.7s | 17s (5+7+5) |
| 06 trap | 49 | 18.6s | 19.2s | 19s |
| 07 pick | 35 | 13.3s | 13.9s | 12s |
| 08 outro | 16 | 6.1s | 6.7s + 1.5s held silence ≈ 8.2s | 8s |
| **Total** | **291** | **110.6s** | **~117s = 1:57** | |

Right at the 2-minute brief. ~5s of margin if Laura runs slow.

---

## Examples & WHY audit

| Concept | Example shown | The WHY (visible or spoken) |
| --- | --- | --- |
| Sticky | Netflix · Spotify · gym | Revenue is monthly; one churned customer = stack of future months gone (calendar visual makes this visceral) |
| Retention math | Customer in bucket with `$` floating up to monthly calendar; future months turn red on churn | Visual shows: leaks aren't $10 loss, they're $80+ loss |
| Viral | Facebook · TikTok | Users pay nothing; audience is the product sold to advertisers; without virality there is no audience |
| K coefficient | Defined inline + dial gauge with green/red zones | Viewer leaves knowing what K means AND seeing >1 vs <1 unambiguously |
| Audience-as-product | 4-node value chain `USERS → ATTENTION → PLATFORM → ADVERTISER` + freeze-frame banner: "THE PRODUCT = AUDIENCE ATTENTION · THE CUSTOMER = THE ADVERTISER" | The most counterintuitive insight is now diagrammatic, not just narrated |
| Paid | Casper · Warby Parker · DoorDash | Customer is one-and-done; only growth lever is paid acquisition |
| LTV / CAC | Spelled out inline (~2s glossary) + shown as `$30 in / $90 out` stamping onto calendar quarters | Viewer can repeat the definitions and sees "over time" concretely |
| 8-year mattress | DONE stamp + 8-year calendar fast-forward + tumbleweeds + `0 SHARES` + `0 INVITES` | Viewer SEES why retention and virality aren't options for Casper |
| Trap A | Color-coded: paid pumping red, sticky leaking blue + reason caption | Viewer understands why ads aren't the fix |
| Trap B | Stick figure walking into empty stadium with one paid ticket + `K = 0.4` | Absurdity makes the point wordlessly |
| Trap C | Lightning strike + viral chain + accelerating losses `– $10 → – $10,000` | Viewer SEES that viral with broken economics multiplies the loss |
| Diagnostic | Real-company avatars (Netflix, Facebook, Casper) physically slide into matched engine slots | Show, don't list — diagnostic is visual not textual |
| Outro | Empty `▢ > ▢` held in silence for ~1.5s with flywheel spinning behind | Forces the viewer's mind to fill in their own engine |

No abstract term ships alone. No engine is assigned to a company without showing *why that company depends on it*.

---

## House rules

- Every `<Sequence>` reads `manifest.startFrame` / `durationFrames`.
- Word timings drive every beat (`wordCue`).
- Headlines 110-130px, sub italics 48-60px, mono labels 36-44px.
- The flywheel + three pedestals at top of frame are the spine — visible scenes 02-08.
- Each engine has a fixed color (blue / magenta / gold) used wherever that engine appears.
- Every abstract claim ships with a visible thing.

## Verification

1. After TTS: confirm `manifest.totalFrames` ≈ 3400-3550 (~115s + held-silence).
2. Smoke-render mid-scene stills covering each scene, plus the held-silence frame at the end of scene 08.
3. Look for: the spine (flywheel + three pedestals at top of frame) is visible and correctly dimmed throughout scenes 03-07; the active engine is clearly highlighted; the value chain in scene 04 is legible at phone scale; the trap rows in scene 06 don't overflow the frame; the avatars in scene 07 land in the correct slots.
4. `npx tsc --noEmit`.
5. `npx remotion render EnginesOfGrowth out/engines-of-growth.mp4`.

## The 12 viewer-question acceptance test

After watching, can the viewer answer all of these without hesitation?

1. **What are the three engines?** → Sticky, viral, paid.
2. **Formal names?** → Retention, virality, unit economics.
3. **Inequality for each?** → NEW > LOST · K > 1 · LTV > CAC.
4. **Why does Netflix care about retention?** → Paid every month you stay; one lost customer = years of future cash gone.
5. **Why does Facebook need virality?** → Users pay nothing. Advertisers pay for the audience. Without virality, no audience, no revenue.
6. **Why does Casper need paid?** → Buy once, gone for 8 years, won't share. Only lever is paid.
7. **What does K mean?** → How many new people each user brings, on average.
8. **LTV and CAC?** → Lifetime Value and Customer Acquisition Cost.
9. **What if I have a hybrid model?** → Pick the dominant one. Forget the others until then.
10. **Wrong engine — what happens?** → You spin a wheel that won't turn.
11. **Going viral with bad unit economics?** → Multiplies the loss, not the win.
12. **How do I know which engine is mine?** → Two questions: how does my customer pay me, AND where does my money come from?

If a viewer answers all 12, the reel did its job.
