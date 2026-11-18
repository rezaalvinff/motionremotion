import {Easing, interpolate} from 'remotion';

/** House easing curves – used everywhere so motion feels like one system. */
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-like settle
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  soft: Easing.bezier(0.33, 0, 0.2, 1),
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0→1 progress between two frames with an easing curve. */
export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = EASE.out,
) => interpolate(frame, [start, start + duration], [0, 1], {...clamp, easing});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Piecewise keyframes with clamping and one easing for every segment. */
export const keyframes = (
  frame: number,
  frames: number[],
  values: number[],
  easing: (t: number) => number = EASE.inOut,
) => interpolate(frame, frames, values, {...clamp, easing});

/** Deterministic smooth pseudo-noise (sum of sines) for handheld/vehicle shake. */
export const wobble = (frame: number, seed: number, amp: number) =>
  amp *
  (0.6 * Math.sin(frame * 0.37 + seed * 1.7) +
    0.3 * Math.sin(frame * 0.91 + seed * 3.1) +
    0.1 * Math.sin(frame * 2.3 + seed * 5.3));

/**
 * Whip-pan offset for a layer: slides sideways (-1…1) and scales up just enough
 * that the frame edge never shows, so the cut under the blur is seamless.
 */
export const whipTransform = (amount: number, distance = 220) =>
  `translateX(${amount * distance}px) scale(${1 + (Math.abs(amount) * distance * 2) / 1080 + Math.abs(amount) * 0.02})`;
