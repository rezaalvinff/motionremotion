import {HEIGHT, WIDTH} from '../config/timeline';
import type {PlateAsset} from '../config/assets';

/**
 * A "plate" is a background photo filmed by a virtual camera.
 * Camera = which source pixel sits in the frame centre (cx, cy) and a zoom
 * relative to the minimum cover scale. All subjects placed "in the world" use the
 * same transform, so cars stay locked to the ground as the camera moves.
 */
export type Cam = {cx: number; cy: number; zoom: number};

export type PlateTransform = {s: number; left: number; top: number};

export const coverScale = (p: PlateAsset) => Math.max(WIDTH / p.w, HEIGHT / p.h);

export const plateTransform = (p: PlateAsset, cam: Cam): PlateTransform => {
  const s = coverScale(p) * Math.max(1, cam.zoom);
  const halfW = WIDTH / 2 / s;
  const halfH = HEIGHT / 2 / s;
  const cx = Math.min(Math.max(cam.cx, halfW), p.w - halfW);
  const cy = Math.min(Math.max(cam.cy, halfH), p.h - halfH);
  return {s, left: WIDTH / 2 - cx * s, top: HEIGHT / 2 - cy * s};
};

export const toScreen = (t: PlateTransform, x: number, y: number) => ({
  x: t.left + x * t.s,
  y: t.top + y * t.s,
});

/** Camera that keeps world point (wx, wy) at screen point (sx, sy) for a zoom. */
export const camAbout = (
  p: PlateAsset,
  zoom: number,
  wx: number,
  wy: number,
  sx: number,
  sy: number,
): Cam => {
  const s = coverScale(p) * zoom;
  return {zoom, cx: wx + (WIDTH / 2 - sx) / s, cy: wy + (HEIGHT / 2 - sy) / s};
};
