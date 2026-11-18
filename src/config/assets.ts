/**
 * Every file the video uses, with its path relative to `public/`.
 * Pixel sizes are the real dimensions of the files and drive all layout math.
 */

export type PlateAsset = {src: string; w: number; h: number};

export const PLATES = {
  residential: {src: 'images/residential-bg.png', w: 941, h: 1672},
  family: {src: 'images/family.png', w: 1122, h: 1402},
  mountainRoad: {src: 'images/mountain-road.png', w: 1122, h: 1402},
  modernPlaza: {src: 'images/modern-plaza.png', w: 1122, h: 1402},
} satisfies Record<string, PlateAsset>;

/**
 * Vehicle cut-outs, masked from the original photos (images/xpander.png and
 * images/destinator.png). Pixels are untouched; only the showroom background
 * was removed. Contact points are tyre/ground contacts in cut-out pixels and
 * are used to ground the car (shadows, reflections, placement).
 */
export type VehicleAsset = {
  src: string;
  w: number;
  h: number;
  /** Real-world body height in metres (used to keep relative scale honest). */
  heightM: number;
  contacts: {
    farFront: [number, number];
    nearFront: [number, number];
    nearRear: [number, number];
  };
};

export const VEHICLES = {
  xpander: {
    src: 'images/cutouts/xpander-cutout.png',
    w: 1201,
    h: 591,
    heightM: 1.75,
    contacts: {farFront: [136, 574], nearFront: [590, 583], nearRear: [1046, 554]},
  },
  destinator: {
    src: 'images/cutouts/destinator-cutout.png',
    w: 1339,
    h: 680,
    heightM: 1.78,
    contacts: {farFront: [143, 650], nearFront: [655, 672], nearRear: [1179, 636]},
  },
} satisfies Record<string, VehicleAsset>;

export type VehicleKey = keyof typeof VEHICLES;

export const LOGOS = {
  mitsubishiDipo: {src: 'logos/mitsubishi-dipo-logo.png', w: 781, h: 202},
};

export const VOICE_OVER = 'audio/voice-over.wav';

/**
 * Optional audio. Drop files with one of these names into public/audio/ and they
 * are picked up automatically on the next preview/render. Missing files are
 * simply skipped (nothing is faked).
 */
export const OPTIONAL_AUDIO = {
  music: ['audio/background-music.mp3', 'audio/background-music.wav', 'audio/background-music.m4a'],
  whoosh: ['audio/sfx/whoosh.mp3', 'audio/sfx/whoosh.wav'],
  bassImpact: ['audio/sfx/bass-impact.mp3', 'audio/sfx/bass-impact.wav'],
  riser: ['audio/sfx/riser.mp3', 'audio/sfx/riser.wav'],
  finalImpact: ['audio/sfx/final-impact.mp3', 'audio/sfx/final-impact.wav'],
};
