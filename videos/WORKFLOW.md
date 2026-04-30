# Made Plain — Reel Production Workflow

This is the **standard** for every new reel. No reel ships unless these steps
have been performed in order.

> Why so rigid? Because narration drives timing. We commit to the words
> first, let the voice decide how long each scene lasts, then animate
> against that fixed clock. Every sync issue we used to have came from
> animating first and squeezing audio in afterward.

---

## Folder layout

Every reel lives in its own folder under `videos/src/reels/<slug>/`:

```
videos/src/reels/<slug>/
├── PLAN.md              # Detailed scenario — second by second
├── script.json          # Narration script, one entry per scene
├── voiceover/
│   ├── 01-title.mp3
│   ├── 01-title.json    # Per-character/word alignment from ElevenLabs
│   ├── 02-…             # one mp3 + json per scene
│   └── manifest.json    # Aggregated durations + word timings
└── index.tsx            # Remotion composition that imports manifest
```

The composition's per-scene `<Sequence durationInFrames>` values are
**read from `manifest.json`** — never hardcoded.

---

## The five-step pipeline

### 1. Scenario plan (`PLAN.md`)

Write the reel second-by-second. For each scene, document:

- **Scene id** — `01-title`, `02-paths`, … (kebab-case, zero-padded).
- **Visual description** — what the viewer sees, frame by frame. Name
  the SVG primitives you'll use (`Bucket`, `GrowBar`, `DropStream`, …).
- **On-screen text** — typeset captions, headlines, numerals.
- **Narration** — the line(s) the voiceover will say in this scene.
- **Sync notes** — which word triggers which animation beat.

Don't assign frame counts yet. The voiceover decides them.

### 2. Script (`script.json`)

Distill the narration from the plan into a machine-readable script.
Schema:

```jsonc
{
  "voice_id": "pNInz6obpgDQGcFmaJgB",   // optional, falls back to env
  "model_id": "eleven_multilingual_v2", // optional, falls back to env
  "voice_settings": {
    "stability": 0.45,
    "similarity_boost": 0.75,
    "style": 0.35,
    "use_speaker_boost": true
  },
  "pad_seconds": 0.4,                   // silence appended to each scene
  "scenes": [
    { "id": "01-title", "text": "1% a day. That's all it takes." },
    { "id": "02-paths", "text": "Two paths look identical on day one." }
  ]
}
```

`pad_seconds` gives each scene a small breath at the end — better
than packing audio against the next scene's first word.

### 3. Voiceover (`scripts/elevenlabs_tts.py`)

Run the generator from the repo root:

```powershell
cd videos
python scripts/elevenlabs_tts.py src/reels/<slug>
```

For every scene the script:

1. POSTs to `/v1/text-to-speech/{voice_id}/with-timestamps` with the
   scene's text and the configured voice settings.
2. Decodes the base64 audio and saves it as `<scene-id>.mp3`.
3. Saves the per-character alignment JSON as `<scene-id>.json`.
4. Groups characters into words and computes a word-timing table.
5. Re-runs ffprobe (if available) or trusts the alignment to compute
   exact MP3 duration.

Then it writes `voiceover/manifest.json`:

```jsonc
{
  "fps": 30,
  "totalSeconds": 18.42,
  "totalFrames": 553,
  "scenes": [
    {
      "id": "01-title",
      "audio": "01-title.mp3",
      "text": "1% a day. That's all it takes.",
      "durationSeconds": 2.14,
      "durationFrames": 64,
      "startFrame": 0,
      "words": [
        { "word": "1%", "startSec": 0.05, "endSec": 0.41,
          "startFrame": 1, "endFrame": 12 },
        …
      ]
    },
    …
  ]
}
```

The script is **idempotent** — it skips scenes whose `text` and
`voice_id` are unchanged since the last run (hash-checked). To force
a re-render of one scene, delete its mp3.

### 4. Remotion composition (`index.tsx`)

The composition imports the manifest and lays out scenes
mechanically:

```tsx
import manifest from "./voiceover/manifest.json";

export const CompoundingReel = () => (
  <AbsoluteFill>
    <PaperBackground />
    {manifest.scenes.map((scene, i) => (
      <Sequence
        key={scene.id}
        from={scene.startFrame}
        durationInFrames={scene.durationFrames}
      >
        <Audio src={staticFile(`reels/compounding/voiceover/${scene.audio}`)} />
        <SceneRouter id={scene.id} words={scene.words} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
```

Per-scene React components receive the `words` array and use
**word-aligned animation**: a chart bar starts growing on the
syllable that names it; a coin lands when the narrator says
"pay you".

### 5. Studio + render

```powershell
cd videos
npx remotion studio                      # preview
npx remotion render <id> out/<slug>.mp4  # final
```

---

## House rules

- **Never hardcode durations.** If you're tempted to type
  `durationInFrames={75}`, you forgot step 3.
- **One mp3 per scene.** Don't concatenate. Scene mp3s are the
  unit of editing.
- **Word timings drive beats.** Important reveals fire on the
  word, not on a fixed offset.
- **Brand visuals are mandatory.** Every concept reel uses the
  SVG primitives in `src/brand/svg.tsx`. New primitives go there
  before they appear in a reel.
- **No commits with `.env`.** The `.gitignore` enforces this.

---

## Adding a new reel — checklist

- [ ] `mkdir videos/src/reels/<slug>` + `voiceover/`
- [ ] Write `PLAN.md`
- [ ] Write `script.json`
- [ ] `python scripts/elevenlabs_tts.py src/reels/<slug>`
- [ ] Verify each `voiceover/*.mp3` plays cleanly
- [ ] Write `index.tsx` driven by `manifest.json`
- [ ] Register the composition in `src/Root.tsx`
- [ ] Smoke-render stills at the start, midpoint, end of each scene
- [ ] `npx remotion render <id> out/<slug>.mp4`
