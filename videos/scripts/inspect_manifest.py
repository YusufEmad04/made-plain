import json, sys
m = json.load(open(sys.argv[1], encoding="utf-8"))
for s in m["scenes"]:
    print(f"{s['id']:20s} {s['speechSeconds']:6.2f}s  {s['durationFrames']:4d}f  start={s['startFrame']}")
print(f"TOTAL: {m['totalSeconds']}s  {m['totalFrames']}f")
