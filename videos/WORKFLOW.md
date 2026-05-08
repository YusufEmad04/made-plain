# Made Plain — Reel Production Workflow

This is the **standard** for every new reel. No reel ships unless these steps
have been performed in order.

> Why so rigid? Because narration drives timing. We commit to the words
> first, let the voice decide how long each scene lasts, then animate
> against that fixed clock. Every sync issue we used to have came from
> animating first and squeezing audio in afterward.

> **Prerequisite — read the Remotion skill first.** Before writing any
> composition code, read the Remotion skill file at
> `c:\Users\Acer\.copilot\skills\remotion-best-practices\SKILL.md`.
> It contains up-to-date patterns and known gotchas that may differ from
> your training data. No exceptions.

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
├── index.tsx            # Thin Remotion composition that imports manifest
├── data.ts              # Palette, constants, scene ids, typed helpers
├── timing.ts            # wordCue helpers and shared timing utilities
├── primitives.tsx       # Reusable SVG/React visual primitives for this reel
└── scenes/
  ├── 01-title.tsx     # One scene component per file for substantial reels
  └── 02-…
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
- **Examples** — every abstract noun, label, or category named in the
  narration must be paired with at least one concrete, named example
  the viewer can picture. "Margin" alone is not allowed; "margin —
  the $2 left after a $10 sale costs you $8" is. Examples can appear
  as on-screen captions, micro-illustrations, named glyphs, or short
  spoken parentheticals — but they must appear. If a scene introduces
  a term without an example, the plan is not done.

Don't assign frame counts yet. The voiceover decides them.

Before moving to `script.json`, audit the scenario as a third-person viewer
watching the finished reel for the first time. Ask whether the hook is clear,
the story is easy to follow, the visual beats actually help the explanation,
the ending lands, and any scene feels slow, confusing, repetitive, or too
abstract. Improve `PLAN.md` before extracting the script.

**After completing `PLAN.md`, use the `askQuestions` tool to present the plan
to the user and ask for feedback. Do not proceed to Step 2 until the user
explicitly approves.**

### 2. Script (`script.json`)

Distill the narration from the plan into a machine-readable script.
Schema:

```jsonc
{
  "voice_id": "pNInz6obpgDQGcFmaJgB",   // optional, falls back to env
  "model_id": "eleven_multilingual_v2", // optional, falls back to env
  "voice_settings": {
    "stability": 0.7,          // tested default — consistent, reproducible
    "similarity_boost": 0.4,   // tested default — clean output, less artifacts
    "style": 0.7,              // tested default — expressive but not theatrical
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

Write the narration as a plain-text preview (`script-preview.txt`) first,
then use the `askQuestions` tool to share it with the user and ask for
feedback. The user may edit the preview and ask to re-review. **Do not
create `script.json` until the user explicitly approves the narration.**
Once approved, write `script.json` manually from the approved text.

**Script tone:** Write every line as a knowledgeable friend explaining
something clearly — never as an ad. Avoid promotional language
("unlock your potential", "game-changing", "discover the secret to…"),
hype phrases, and complex or jargon-heavy vocabulary. Use short, direct
sentences. If a first-time viewer would need to pause and re-read a line,
rewrite it.

**After the user approves the script, use the
`askQuestions` tool to confirm before generating audio.** This is the last
checkpoint before API credits are spent.

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

**After voiceover is generated, use the `askQuestions` tool to ask the user
to listen to the mp3s and confirm they are satisfied before proceeding to
animation.**

### 4. Remotion composition (`index.tsx`)

The composition imports the manifest and lays out scenes mechanically.
For anything beyond a tiny demo, `index.tsx` must stay thin: imports,
composition metadata, the manifest-driven `<Sequence>` map, and scene
routing only. Do **not** put the entire video, every primitive, and every
scene in one file. Split substantial reels into:

- `data.ts` for typed constants, engine labels, colors, and scene ids.
- `timing.ts` for `wordCue` and shared animation helpers.
- `primitives.tsx` for reusable local SVG/React primitives.
- `scenes/<scene-id>.tsx` for the actual scene components.

This makes smoke-test fixes possible without hunting through a giant file,
keeps per-scene layout ownership clear, and prevents one reel from becoming
unreviewable.

The thin composition shape should look like this:

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

**After the composition is written, use the `askQuestions` tool to ask the
user to preview in Remotion Studio before the final render.**

### 5. Studio + render

```powershell
cd videos
npx remotion studio                      # preview
npx remotion render <id> out/<slug>.mp4  # final
```

---

## House rules

- **Always pause between steps using `askQuestions`.** After completing each
  step in the pipeline, use the `askQuestions` tool to present the output to
  the user and ask for explicit approval before moving to the next step. Never
  run the full pipeline start-to-end without interaction. The user must be able
  to give feedback, request changes, or reject the current output at every stage.
- **2D animations explain concepts — not text alone.** Every concept
  must be shown through motion: animated diagrams, flowing arrows,
  morphing shapes, building charts, icons that appear and transform.
  A scene that is just text on a background or a static labelled box
  is not finished. Ask "can this be animated into a 2D visual?"
  before settling for text.
- **Text must be reel-readable.** Output is a vertical short-form video
  watched on a phone. Font sizes must be large enough to read at a
  glance. Avoid small labels, fine print, and multi-line text blocks.
  Keep on-screen copy short — one idea per line, one beat at a time.
  No long sentences on screen.
- **No crowding. No blank voids. No overflow. No overlap.**
  Every scene must be visually balanced: elements spaced to breathe
  without leaving large empty areas, all text contained within its
  layout bounds, and no element rendered on top of another unintentionally.
  Verify all four conditions at every smoke-test stage.
- **Voiceover and visuals must be perfectly in sync.** Every animation
  beat — a shape appearing, a label fading in, a number counting up —
  must align with the word or phrase in the narration that introduces
  it. Use the `words` array from the manifest to schedule every reveal.
  Never let visuals run ahead of or behind the audio.
- **Use the internet for assets.** If a scene needs an icon,
  illustration, reference image, data point, or any external resource,
  use a web-search or Tavily tool to find it rather than inventing or
  omitting it.
- **Never hardcode durations.** If you're tempted to type
  `durationInFrames={75}`, you forgot step 3.
- **One mp3 per scene.** Don't concatenate. Scene mp3s are the
  unit of editing.
- **Word timings drive beats.** Important reveals fire on the
  word, not on a fixed offset.
- **Brand visuals are mandatory.** Every concept reel uses the
  SVG primitives in `src/brand/svg.tsx`. New primitives go there
  before they appear in a reel.
- **Examples are mandatory.** Never explain a concept as pure theory.
  Every term, category, or abstraction the narration introduces must
  ship with a concrete example — a named product, a real number, a
  recognizable scenario — visible on screen or spoken aloud. If a
  viewer cannot answer "like what?" after hearing a line, the line is
  not finished. This applies at plan, script, and animation stages.
- **Split substantial Remotion code.** If a reel has multiple scenes,
  custom primitives, or more than ~250 lines of scene code, `index.tsx`
  is not allowed to contain everything. Keep it as a manifest router and
  move primitives/scenes into separate files before rendering.
- **No commits with `.env`.** The `.gitignore` enforces this.

---

## Adding a new reel — checklist

- [ ] Read the Remotion skill file before writing any composition code
- [ ] `mkdir videos/src/reels/<slug>` + `voiceover/`
- [ ] Write `PLAN.md`
- [ ] Audit and improve `PLAN.md` as a third-person viewer before scripting
- [ ] Verify every abstract term in `PLAN.md` ships with a concrete example
- [ ] Write `script-preview.txt` and ask for user approval via `askQuestions`
- [ ] Write `script.json` from the approved narration
- [ ] Ask for user confirmation before generating audio
- [ ] `python scripts/elevenlabs_tts.py src/reels/<slug>`
- [ ] Verify each `voiceover/*.mp3` plays cleanly
- [ ] Ask for user confirmation after generating audio
- [ ] Write `index.tsx` driven by `manifest.json`
- [ ] Register the composition in `src/Root.tsx`
- [ ] Smoke-render stills at the start, midpoint, end of each scene
- [ ] Verify at each smoke stage: no crowding, no blank voids, no text overflow, no element overlap, text is large enough to read on a phone
- [ ] `npx remotion render <id> out/<slug>.mp4`
