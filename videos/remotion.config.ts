import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(1);
// Per-reel folders under src/reels host their own voiceover/ assets.
// Pointing the public dir there lets each composition load its mp3s
// via `staticFile("<slug>/voiceover/<scene>.mp3")`.
Config.setPublicDir("./src/reels");
