"""
tts_test.py  —  Test ElevenLabs voice settings without touching production files.

Reads voice_id, model_id, and the scene texts from script.json, but lets you
override any setting here. Output goes to a separate "voiceover-test/" folder
so the real voiceover/ is never touched.

Usage:
    python scripts/tts_test.py

Edit the SETTINGS block below to experiment, then re-run.
"""

from __future__ import annotations

import base64
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path


# ─────────────────────────────────────────────────────────────────────
# ✏️  EDIT THIS BLOCK TO EXPERIMENT
# ─────────────────────────────────────────────────────────────────────

# Reel to use as input. Path is relative to the videos/ folder.
REEL_DIR = "src/reels/engines-of-growth-ar"

# Which scenes to test. Use None to run ALL scenes.
TEST_SCENES: list[str] | None = ["01-problem", "08-trap", "04-sticky-example"]

# Override voice settings. Set a value to None to use the value from script.json.
# Current production defaults (from script.json) are shown on the right.
OVERRIDES = {
    "stability":         0.7,  # 0.0 – 1.0  |  higher = more consistent, lower = more expressive  |  default: 0.5
    "similarity_boost":  0.4,  # 0.0 – 1.0  |  higher = closer to reference voice                 |  default: 0.78
    "style":             0.7,  # 0.0 – 1.0  |  higher = more dramatic                             |  default: 0.28
    "use_speaker_boost": True,  # True / False                                                      |  default: True
}

# Override voice or model entirely (or leave as None to use script.json values).
VOICE_ID_OVERRIDE: str | None = None
MODEL_ID_OVERRIDE: str | None = None

# ─────────────────────────────────────────────────────────────────────


def load_dotenv(env_path: Path) -> None:
    if not env_path.exists():
        return
    for raw in env_path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def synth(*, api_key: str, voice_id: str, model_id: str, text: str,
          voice_settings: dict) -> bytes:
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    payload = {
        "text": text,
        "model_id": model_id,
        "voice_settings": voice_settings,
    }
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        method="POST",
        headers={
            "xi-api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return resp.read()
    except urllib.error.HTTPError as e:
        msg = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"ElevenLabs HTTP {e.code}: {msg}") from None


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    load_dotenv(repo_root / ".env")

    api_key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not api_key:
        print("ERROR: ELEVENLABS_API_KEY not set in videos/.env")
        sys.exit(1)

    reel_dir = (repo_root / REEL_DIR).resolve()
    if not reel_dir.is_dir():
        print(f"ERROR: directory not found: {REEL_DIR}")
        sys.exit(1)

    script = json.loads((reel_dir / "script.json").read_text(encoding="utf-8"))

    voice_id = VOICE_ID_OVERRIDE or script["voice_id"]
    model_id = MODEL_ID_OVERRIDE or script["model_id"]

    # Merge script.json settings with overrides (skip None overrides)
    base_settings: dict = dict(script.get("voice_settings") or {})
    effective_settings = {
        **base_settings,
        **{k: v for k, v in OVERRIDES.items() if v is not None},
    }

    # Pick scenes to test
    scenes = script["scenes"]
    if TEST_SCENES is not None:
        scenes = [s for s in scenes if s["id"] in TEST_SCENES]
        if not scenes:
            print(f"ERROR: none of {TEST_SCENES} found in script.json")
            sys.exit(1)

    # Output folder — separate from production voiceover/
    out_dir = reel_dir / "voiceover-test"
    out_dir.mkdir(exist_ok=True)

    print(f"\nVoice ID : {voice_id}")
    print(f"Model    : {model_id}")
    print(f"Settings : {json.dumps(effective_settings, indent=2)}")
    print(f"Output   : {out_dir}\n")

    for scene in scenes:
        scene_id = scene["id"]
        text = scene["text"]
        out_path = out_dir / f"{scene_id}.mp3"

        print(f"  [{scene_id}] synthesizing...", end=" ", flush=True)
        audio = synth(
            api_key=api_key,
            voice_id=voice_id,
            model_id=model_id,
            text=text,
            voice_settings=effective_settings,
        )
        out_path.write_bytes(audio)
        kb = len(audio) / 1024
        print(f"done  ({kb:.0f} KB)  →  {out_path.name}")

    print(f"\n✓ {len(scenes)} file(s) saved to {out_dir}")
    print("Open the mp3(s) to listen and compare, then adjust OVERRIDES above.")


if __name__ == "__main__":
    main()
