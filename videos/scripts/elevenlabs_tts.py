"""
ElevenLabs TTS + word-timing generator for Made-Plain reels.

Usage:
    python scripts/elevenlabs_tts.py <reel_dir>

Where <reel_dir> is the path to a reel folder containing `script.json`,
e.g. `src/reels/compounding`.

For each scene the script:
  * Calls /v1/text-to-speech/{voice_id}/with-timestamps to get audio +
    per-character alignment.
  * Saves <scene-id>.mp3 and <scene-id>.json into <reel_dir>/voiceover/.
  * Groups characters into words and aggregates everything into
    <reel_dir>/voiceover/manifest.json (the file Remotion reads).

It's idempotent: a scene whose `text` + voice settings are unchanged
since the last run is skipped. Delete the corresponding mp3 to force
re-generation.

Requires only the standard library + `requests` (and a `.env` file with
ELEVENLABS_API_KEY).
"""
from __future__ import annotations

import base64
import hashlib
import json
import os
import sys
from pathlib import Path
from typing import Any

import urllib.request
import urllib.error


# ─────────────────────────────────────────────────────────────────────
# .env loader (no external dep)
# ─────────────────────────────────────────────────────────────────────

def load_dotenv(env_path: Path) -> None:
    if not env_path.exists():
        return
    for raw in env_path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


# ─────────────────────────────────────────────────────────────────────
# ElevenLabs API call
# ─────────────────────────────────────────────────────────────────────

ELEVEN_BASE = "https://api.elevenlabs.io"


def synth_with_timestamps(
    *,
    api_key: str,
    voice_id: str,
    model_id: str,
    text: str,
    voice_settings: dict[str, Any] | None,
) -> dict[str, Any]:
    """POST /v1/text-to-speech/{voice}/with-timestamps and return parsed JSON."""
    url = f"{ELEVEN_BASE}/v1/text-to-speech/{voice_id}/with-timestamps"
    payload: dict[str, Any] = {"text": text, "model_id": model_id}
    if voice_settings:
        payload["voice_settings"] = voice_settings

    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        method="POST",
        headers={
            "xi-api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:  # pragma: no cover
        msg = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"ElevenLabs HTTP {e.code}: {msg}") from None


# ─────────────────────────────────────────────────────────────────────
# Alignment → word grouping
# ─────────────────────────────────────────────────────────────────────

def chars_to_words(alignment: dict[str, Any]) -> list[dict[str, Any]]:
    """Group per-character alignment into per-word timings.

    ElevenLabs returns:
      {
        characters: ["1", "%", " ", "a", " ", "d", "a", "y", "."],
        character_start_times_seconds: [...],
        character_end_times_seconds:   [...],
      }
    """
    chars: list[str] = alignment.get("characters", [])
    starts: list[float] = alignment.get("character_start_times_seconds", [])
    ends: list[float] = alignment.get("character_end_times_seconds", [])

    words: list[dict[str, Any]] = []
    current = ""
    current_start: float | None = None
    current_end: float | None = None

    def flush() -> None:
        nonlocal current, current_start, current_end
        if current and current_start is not None and current_end is not None:
            words.append(
                {
                    "word": current,
                    "startSec": round(current_start, 4),
                    "endSec": round(current_end, 4),
                }
            )
        current = ""
        current_start = None
        current_end = None

    for ch, s, e in zip(chars, starts, ends):
        if ch.isspace():
            flush()
            continue
        if current_start is None:
            current_start = s
        current_end = e
        current += ch
    flush()
    return words


def total_duration(alignment: dict[str, Any]) -> float:
    ends = alignment.get("character_end_times_seconds") or [0.0]
    return float(ends[-1])


# ─────────────────────────────────────────────────────────────────────
# Per-scene caching
# ─────────────────────────────────────────────────────────────────────

def scene_signature(text: str, voice_id: str, model_id: str, vs: dict[str, Any] | None) -> str:
    h = hashlib.sha256()
    h.update(text.encode("utf-8"))
    h.update(b"|")
    h.update(voice_id.encode())
    h.update(b"|")
    h.update(model_id.encode())
    h.update(b"|")
    h.update(json.dumps(vs or {}, sort_keys=True).encode())
    return h.hexdigest()[:16]


# ─────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────

def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("usage: elevenlabs_tts.py <reel_dir>", file=sys.stderr)
        return 2

    repo_root = Path(__file__).resolve().parents[1]
    load_dotenv(repo_root / ".env")

    reel_dir = (Path.cwd() / argv[1]).resolve()
    if not reel_dir.is_dir():
        # Try resolving against repo_root
        reel_dir = (repo_root / argv[1]).resolve()
    if not reel_dir.is_dir():
        print(f"reel directory not found: {argv[1]}", file=sys.stderr)
        return 2

    script_path = reel_dir / "script.json"
    if not script_path.exists():
        print(f"missing {script_path}", file=sys.stderr)
        return 2

    api_key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not api_key or api_key == "your_key_here":
        print("ELEVENLABS_API_KEY missing — set it in videos/.env", file=sys.stderr)
        return 2

    script = json.loads(script_path.read_text(encoding="utf-8"))
    voice_id = script.get("voice_id") or os.environ.get("ELEVENLABS_VOICE_ID", "pNInz6obpgDQGcFmaJgB")
    model_id = script.get("model_id") or os.environ.get("ELEVENLABS_MODEL_ID", "eleven_multilingual_v2")
    voice_settings = script.get("voice_settings")
    pad_seconds = float(script.get("pad_seconds", 0.4))
    fps = int(script.get("fps", 30))

    voice_dir = reel_dir / "voiceover"
    voice_dir.mkdir(parents=True, exist_ok=True)

    cache_path = voice_dir / "_cache.json"
    cache: dict[str, str] = {}
    if cache_path.exists():
        try:
            cache = json.loads(cache_path.read_text(encoding="utf-8"))
        except Exception:
            cache = {}

    manifest_scenes: list[dict[str, Any]] = []
    cursor_frames = 0

    for scene in script["scenes"]:
        sid = scene["id"]
        text = scene["text"].strip()
        sig = scene_signature(text, voice_id, model_id, voice_settings)
        mp3_path = voice_dir / f"{sid}.mp3"
        align_path = voice_dir / f"{sid}.json"

        cached_sig = cache.get(sid)
        needs_synth = not (mp3_path.exists() and align_path.exists() and cached_sig == sig)

        if needs_synth:
            print(f"[synth] {sid}: {text[:60]!r}{'…' if len(text) > 60 else ''}")
            result = synth_with_timestamps(
                api_key=api_key,
                voice_id=voice_id,
                model_id=model_id,
                text=text,
                voice_settings=voice_settings,
            )
            audio_b64 = result.get("audio_base64") or result.get("audio")
            if not audio_b64:
                raise RuntimeError(f"no audio returned for scene {sid}")
            audio_bytes = base64.b64decode(audio_b64)
            mp3_path.write_bytes(audio_bytes)
            alignment = result.get("alignment") or result.get("normalized_alignment") or {}
            align_path.write_text(json.dumps(alignment, indent=2), encoding="utf-8")
            cache[sid] = sig
            cache_path.write_text(json.dumps(cache, indent=2), encoding="utf-8")
        else:
            print(f"[cache] {sid}")
            alignment = json.loads(align_path.read_text(encoding="utf-8"))

        words = chars_to_words(alignment)
        speech_seconds = total_duration(alignment)
        scene_seconds = speech_seconds + pad_seconds
        scene_frames = int(round(scene_seconds * fps))

        # Convert word times to frames
        words_with_frames = [
            {
                **w,
                "startFrame": int(round(w["startSec"] * fps)),
                "endFrame": int(round(w["endSec"] * fps)),
            }
            for w in words
        ]

        manifest_scenes.append(
            {
                "id": sid,
                "audio": f"{sid}.mp3",
                "text": text,
                "speechSeconds": round(speech_seconds, 4),
                "durationSeconds": round(scene_seconds, 4),
                "durationFrames": scene_frames,
                "startFrame": cursor_frames,
                "words": words_with_frames,
            }
        )
        cursor_frames += scene_frames

    manifest = {
        "fps": fps,
        "voiceId": voice_id,
        "modelId": model_id,
        "totalSeconds": round(cursor_frames / fps, 4),
        "totalFrames": cursor_frames,
        "scenes": manifest_scenes,
    }
    (voice_dir / "manifest.json").write_text(
        json.dumps(manifest, indent=2), encoding="utf-8"
    )
    print(f"\nwrote {voice_dir / 'manifest.json'}")
    print(f"total: {manifest['totalSeconds']:.2f}s ({manifest['totalFrames']} frames @ {fps}fps)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
