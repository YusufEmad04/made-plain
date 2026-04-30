/**
 * Made Plain — brand tokens for video.
 *
 * Mirrors `app/globals.css` and `design-system/tokens.md` so the videos look
 * like a moving extension of the website, not a separate visual world.
 *
 * Default palette = dark mode (paper = ink-near-black). Reels read better
 * on phones at night, and the editor's-desk feel survives hard compression.
 */

export const colors = {
  paper: "#13110E",
  ink: "#F1ECDF",
  accent: "#E5572A",
  accentInk: "#13110E",
  sand: "#1F1B14",
  card: "#1A1712",
  line: "rgba(241, 236, 223, 0.12)",
  mute: "#A09A8E",
  mute2: "#7E776A",
  pos: "#3B7A57",
  warn: "#B8860B",
  neg: "#9C3D2D",
} as const;

/** Light palette — used on the kit ad price card for contrast. */
export const colorsLight = {
  paper: "#F6F1E7",
  ink: "#13110E",
  accent: "#D14B1F",
  accentInk: "#FFFFFF",
  sand: "#E8DCC2",
  card: "#FBF7EE",
  line: "rgba(31, 27, 20, 0.12)",
  mute: "#5A544A",
  mute2: "#7E776A",
} as const;

/** Reel canvas — 9:16. */
export const REEL = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

/**
 * Editorial spacing scale (px). Same 8-point grid as the site.
 */
export const space = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 24,
  s6: 32,
  s7: 48,
  s8: 64,
  s9: 96,
  s10: 128,
} as const;

/**
 * Easing curves used across the brand. Mirrors `--ease-smooth`, `--ease-quart`
 * and `--ease-spring` in globals.css. Express as cubic bezier control points.
 */
export const ease = {
  smooth: [0.32, 0.72, 0.0, 1.0] as const,
  quart: [0.16, 1.0, 0.3, 1.0] as const,
  spring: [0.34, 1.56, 0.64, 1.0] as const,
};

/** Spring presets for Remotion `spring()`. */
export const spring = {
  smooth: { damping: 200 } as const,
  snappy: { damping: 20, stiffness: 200 } as const,
  bouncy: { damping: 8 } as const,
  heavy: { damping: 15, stiffness: 80, mass: 2 } as const,
};
