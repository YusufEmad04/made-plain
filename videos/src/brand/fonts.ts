/**
 * Centralized font loading. Matches the website:
 *   - Inter Tight  → display/UI
 *   - Newsreader   → editorial body/italics
 *   - JetBrains Mono → numerals & code
 */
import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadNewsreader } from "@remotion/google-fonts/Newsreader";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

const interTight = loadInterTight("normal", {
  weights: ["500", "600", "700", "900"],
  subsets: ["latin"],
});

const newsreader = loadNewsreader("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

const newsreaderItalic = loadNewsreader("italic", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

const jetbrains = loadJetBrainsMono("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});

export const fonts = {
  display: interTight.fontFamily,
  body: newsreader.fontFamily,
  bodyItalic: newsreaderItalic.fontFamily,
  mono: jetbrains.fontFamily,
};

export const waitForFonts = () =>
  Promise.all([
    interTight.waitUntilDone(),
    newsreader.waitUntilDone(),
    newsreaderItalic.waitUntilDone(),
    jetbrains.waitUntilDone(),
  ]);
