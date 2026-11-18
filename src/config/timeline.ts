/**
 * Single source of truth for timing. All values are frames at 30 fps.
 *
 * Scene lengths follow the brief (≈ 0-4 / 4-10 / 10-16 / 16-21 / 21-25 s) but are
 * shifted so that every scene lands exactly on its voice-over line. The supplied
 * VO reads the Xpander line for ~8 s, so scene 2 is longer than 6 s.
 */
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const SCENE = {
  opening: {from: 0, duration: 108}, // 0.0 – 3.6 s
  xpander: {from: 108, duration: 252}, // 3.6 – 12.0 s  (lifestyle cut-away at 9.2 s)
  destinator: {from: 360, duration: 168}, // 12.0 – 17.6 s
  comparison: {from: 528, duration: 102}, // 17.6 – 21.0 s
  closing: {from: 630, duration: 120}, // 21.0 – 25.0 s
} as const;

export const DURATION_IN_FRAMES =
  SCENE.closing.from + SCENE.closing.duration; // 750 = 25 s

/** Inside scene 2: frame (local) where the Xpander hero cuts to the family shot. */
export const XPANDER_FAMILY_CUT = 168; // absolute 276 = 9.2 s, in the VO pause

/**
 * Voice-over is the single supplied file, played in four phrases so each
 * sentence sits on its scene. src* values are in seconds of the source file
 * (measured from the pauses in the recording).
 */
export const VO_SEGMENTS = [
  // "Setiap keluarga punya kebutuhan yang berbeda."
  {at: 12, srcStart: 0.0, srcEnd: 3.05},
  // "Untuk menemani aktivitas sehari-hari, ada Mitsubishi Xpander.
  //  Nyaman untuk keluarga, dari kesibukan harian sampai waktu bersama."
  {at: 108, srcStart: 3.45, srcEnd: 11.9},
  // "Dan saat waktunya liburan, Mitsubishi Destinator siap menemani perjalanan keluarga."
  {at: 366, srcStart: 12.7, srcEnd: 18.4},
  // "Kalau kamu, pilih yang mana?"
  {at: 638, srcStart: 18.85, srcEnd: 20.68},
] as const;

/** Absolute frames of VO cues used to time typography. */
export const CUE = {
  openingLine: 12,
  xpanderName: 180, // "…ada Mitsubishi Xpander" ≈ 6.05 s
  xpanderClaim: 240, // "Nyaman untuk keluarga" ≈ 8.1 s
  destinatorName: 422, // "Mitsubishi Destinator" ≈ 14.1 s
  destinatorClaim: 462, // "siap menemani…" ≈ 15.4 s
  closingQuestion: 640, // "Kalau kamu," ≈ 21.35 s
  closingQuestion2: 664, // "pilih yang mana?" ≈ 22.2 s
};

/** Sound-effect cue points (absolute frames). */
export const SFX_CUES = {
  whoosh: [268, 352, 520],
  bassImpact: [110, 422],
  riser: {from: 484, to: 528},
  finalImpact: [640],
};
