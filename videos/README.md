# Made Plain — Video Studio

Remotion 4.x project for branded reels and ads. Lives in this folder so the
video toolchain stays isolated from the Next.js app.

## Run

```powershell
cd videos
npm install
npm run studio       # opens Remotion Studio at http://localhost:3000
```

## Render

```powershell
npm run render:kit-ad
npm run render:cac
npm run render:pricing
npm run render:all
```

Outputs land in `videos/out/`.

## Compositions

All reels are 1080×1920 (9:16) at 30fps so they slot directly into Instagram /
TikTok / YouTube Shorts.

| ID | Length | What it is |
|---|---|---|
| `KitAd` | 15s | Pitches the kit — eyebrow, two-line claim, seven pieces, $99. |
| `CACPayback` | 15s | Concept reel — explains CAC payback with Sahelli's real numbers. |
| `PricingPosition` | 15s | Concept reel — pricing as positioning, then unit-economics. |

## Brand motion

The standardized motion primitives — `<Eyebrow>`, `<InkWipeLine>`, `<DotMark>`,
`<Hairline>`, `<EditorialDivider>`, `<MarkerHighlight>`, `<TabularTicker>` —
live in `src/brand/motion.tsx`. Their editorial intent is documented in
[`design-system/motion.md`](../design-system/motion.md).

## Tokens

`src/brand/tokens.ts` mirrors `app/globals.css`. If a CSS variable changes
on the website, change it there too. One source of truth, two surfaces.
