# V7 Critique — what is still wrong in V6

## Concrete problems from screenshots

### Scene 01 — "Growth is not one thing"
- The labels `stay`, `share`, `pay back` sit too high inside their cards and visually crowd the icon.
- The bottom box `PICK THE ENGINE` overflows: the text is sized 70 but the box is only 550 wide. The word "ENGINE" pokes outside the right edge.
- No concrete brand name. Subscription / social app / product store are still abstract.

### Scene 02 — "Three engines, three tests"
- The "oval filled with liquid" gauge for each engine is meaningless. Liquid level does not represent any quantity in the script.
- Test labels are abstract (BASE / CROWD / PROFIT) — the viewer cannot connect the visual back to NEW>CHURN, K>1, LTV>CAC.
- No brand examples for the three engines.

### Scene 06 — "Why audience"
- `THE AUDIENCE IS THE PRODUCT` text overflows the rectangle on the right.
- The bottom `LessonBand` ("Viral growth builds what the business sells access to.") is laid on top of that box — the two stack and overlap.
- Marketplace and media examples are generic shapes — no Amazon / eBay / YouTube / Instagram named.

### Scene 07 — "Paid"
- CAC is shown as five static coins inside a red box. There is no animation of money being spent to acquire a customer.
- LTV is a tiny green box with a liquid-fill bar. It does not communicate "pays over time".
- The little CAC vs LTV "scale" widget collides with the LTV box on the left.
- Bottom message overlaps the engines title strip on the wrap-around frame.
- No real examples (Netflix, Spotify, an e-commerce ad) to anchor the math.

### Scene 08 — "Wrong engine, wrong fix"
- The "leak" trap: the bucket is a trapezoid but the liquid fill is a rectangle — the liquid is not the container's shape.
- `MORE DEMAND, MORE LOSS` overflows on the loss-trap diagram.
- All three traps still feel like the same boxed-text design — each needs its own tiny animated diagram.
- No brand examples (e.g. an ad-pumped subscription that still churns).

### Scene 10 — "Outro"
- `MAKE YOUR EQUATION TRUE` at fontSize 64 with side padding overflows its container at 1080×1920.

## Cross-cutting

- Scenes cut to the next one at the exact moment the audio ends. There is no breath. Animations finish and the viewer is yanked away before they can read the diagram.
- Examples are weak. Required by `WORKFLOW.md`: "every abstract noun must be paired with at least one concrete, named example." Most engines still only get a generic shape.
- The video still leans on big text + boxes more than diagrammatic, moving illustrations.

## Targets for V7

1. **Tail pauses** — increase `pad_seconds` so each scene gets ~0.75s of silence at the end. The animation lands, the viewer reads, then the scene ends.
2. **Brand examples everywhere** — Spotify / Netflix (sticky), TikTok / Instagram (viral), Amazon / Shopify ads (paid), eBay / Etsy (marketplace), YouTube (media).
3. **Test visuals** — replace gauges with three actual mini-diagrams: tilting scale (NEW>CHURN), branching tree (K>1), dollar funnel (LTV>CAC).
4. **CAC funnel + LTV timeline** — animate dollars going in to acquire one figure, then a horizontal month timeline where the acquired customer pays each month and a running total counts up.
5. **Trap fixes** — clip liquid to the trapezoid, shrink the over-wide labels, and give each trap a unique mini-diagram.
6. **Outro fit** — shrink and re-balance the final box so nothing overflows.
7. **Layout overflow audit** — every text inside an SVG `<rect>` must be measured before render and shrunk if it exceeds 90% of the rect width.
