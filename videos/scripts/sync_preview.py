"""
sync_preview.py  —  Sync script-preview.txt → script.json

Usage:
    python scripts/sync_preview.py src/reels/engines-of-growth-ar

The script reads script-preview.txt, extracts the text for each scene,
and updates the "text" field in script.json. All other JSON fields
(voice settings, model, etc.) are left untouched.
"""

import json
import re
import sys
from pathlib import Path


def parse_preview(txt: str) -> dict[str, str]:
    """Return {scene_id: text} from the preview file."""
    scenes: dict[str, str] = {}

    # Split on blank lines to get blocks
    blocks = re.split(r"\n{2,}", txt.strip())

    for block in blocks:
        lines = block.strip().splitlines()
        if len(lines) < 2:
            continue
        scene_id = lines[0].strip()
        # Must look like a scene id: word chars and hyphens, e.g. "01-problem"
        if not re.fullmatch(r"[\w-]+", scene_id):
            continue
        text = " ".join(line.strip() for line in lines[1:] if line.strip())
        if text:
            scenes[scene_id] = text

    return scenes


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python scripts/sync_preview.py <reel-dir>")
        sys.exit(1)

    reel_dir = Path(sys.argv[1])
    preview_path = reel_dir / "script-preview.txt"
    json_path = reel_dir / "script.json"

    if not preview_path.exists():
        print(f"ERROR: {preview_path} not found")
        sys.exit(1)
    if not json_path.exists():
        print(f"ERROR: {json_path} not found")
        sys.exit(1)

    txt = preview_path.read_text(encoding="utf-8")
    preview_scenes = parse_preview(txt)

    if not preview_scenes:
        print("ERROR: No scenes found in preview file. Check the format.")
        sys.exit(1)

    data = json.loads(json_path.read_text(encoding="utf-8"))

    changed = []
    for scene in data["scenes"]:
        scene_id = scene["id"]
        if scene_id in preview_scenes:
            new_text = preview_scenes[scene_id]
            if scene["text"] != new_text:
                scene["text"] = new_text
                changed.append(scene_id)

    json_path.write_text(
        json.dumps(data, ensure_ascii=False, indent=4),
        encoding="utf-8",
    )

    if changed:
        print(f"Updated {len(changed)} scene(s): {', '.join(changed)}")
    else:
        print("No changes — script.json is already up to date.")


if __name__ == "__main__":
    main()
