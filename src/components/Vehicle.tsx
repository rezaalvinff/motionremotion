import React from 'react';
import {Img, staticFile} from 'remotion';
import {VEHICLES, type VehicleKey} from '../config/assets';
import {useSafeId} from './useSafeId';

export type VehicleGrade = {brightness?: number; contrast?: number; saturate?: number; sepia?: number};

export type VehicleLight = {
  /** CSS gradient angle pointing FROM the light source across the body. */
  angle: number;
  color: string;
  strength: number;
  blend?: 'screen' | 'soft-light' | 'overlay';
  /** How far across the body the light reaches (0-100 %). */
  reach?: number;
};

export type VehicleShadow = {
  /** Ambient occlusion under the body (0-1). */
  contact: number;
  /** Cast shadow offset in cut-out pixels (direction away from the sun). */
  castX: number;
  castY: number;
  cast: number;
};

type Props = {
  vehicle: VehicleKey;
  /** Screen position of the near front tyre contact point. */
  x: number;
  y: number;
  /** On-screen width of the whole cut-out. */
  width: number;
  grade?: VehicleGrade;
  light?: VehicleLight;
  shadow?: VehicleShadow;
  /** Floor reflection opacity (glossy floors only). */
  reflection?: number;
  /** 0→1 progress of a specular sweep across the body, null = off. */
  glint?: number | null;
  opacity?: number;
};

/**
 * The real vehicle photo (background removed, pixels untouched) grounded in a
 * scene: contact shadows, cast shadow, optional floor reflection, and a light
 * layer that only tints within the car's own silhouette.
 */
export const Vehicle: React.FC<Props> = ({
  vehicle,
  x,
  y,
  width,
  grade = {},
  light,
  shadow = {contact: 0.85, castX: 40, castY: 10, cast: 0.3},
  reflection = 0,
  glint = null,
  opacity = 1,
}) => {
  const v = VEHICLES[vehicle];
  const src = staticFile(v.src);
  const k = width / v.w;
  const {farFront: ff, nearFront: nf, nearRear: nr} = v.contacts;
  const fr: [number, number] = [ff[0] + (nr[0] - nf[0]), ff[1] + (nr[1] - nf[1])];
  const quad = [ff, nf, nr, fr];
  const cx = quad.reduce((a, p) => a + p[0], 0) / 4;
  const cy = quad.reduce((a, p) => a + p[1], 0) / 4;
  const poly = (grow: number, dx = 0, dy = 0) =>
    quad.map(([px, py]) => `${cx + (px - cx) * grow + dx},${cy + (py - cy) * grow + dy}`).join(' ');

  const ids = {
    ao: useSafeId('ao'),
    cast: useSafeId('cast'),
    tyre: useSafeId('tyre'),
    fill: useSafeId('fill'),
    white: useSafeId('white'),
  };

  const filter = `brightness(${grade.brightness ?? 1}) contrast(${grade.contrast ?? 1}) saturate(${
    grade.saturate ?? 1
  }) sepia(${grade.sepia ?? 0})`;

  // Mirror about the (sloped) ground line through the two near tyre contacts.
  const slope = (nr[1] - nf[1]) / (nr[0] - nf[0]);
  const y0 = nf[1] + 2;
  const reflectionMatrix = `matrix(1, ${2 * slope}, 0, -1, 0, ${2 * y0 - 2 * slope * nf[0]})`;

  const imgBase: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: v.w, height: v.h};
  const mask = (m: string): React.CSSProperties => ({WebkitMaskImage: m, maskImage: m});
  const g = glint === null ? null : -20 + glint * 140;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - nf[0] * k,
        top: y - nf[1] * k,
        width: v.w,
        height: v.h,
        transform: `scale(${k})`,
        transformOrigin: '0 0',
        opacity,
      }}
    >
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <defs>
          <filter id={ids.ao} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={v.w * 0.014} />
          </filter>
          <filter id={ids.cast} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={v.w * 0.035} />
          </filter>
          <filter id={ids.tyre} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={v.w * 0.005} />
          </filter>
          <filter id={ids.fill} colorInterpolationFilters="sRGB">
            <feFlood floodColor={light?.color ?? '#fff'} />
            <feComposite in2="SourceAlpha" operator="in" />
          </filter>
          <filter id={ids.white} colorInterpolationFilters="sRGB">
            <feFlood floodColor="#ffffff" />
            <feComposite in2="SourceAlpha" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* Cast shadow (sun direction) */}
      <svg width={v.w} height={v.h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <polygon
          points={poly(1.18, shadow.castX, shadow.castY)}
          fill="#000"
          opacity={shadow.cast}
          filter={`url(#${ids.cast})`}
        />
      </svg>

      {/* Floor reflection */}
      {reflection > 0 ? (
        <Img
          src={src}
          style={{
            ...imgBase,
            transform: reflectionMatrix,
            transformOrigin: '0 0',
            filter: `${filter} blur(${v.w * 0.003}px) brightness(0.75)`,
            opacity: reflection,
            ...mask('linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 16%, rgba(0,0,0,0) 42%)'),
          }}
        />
      ) : null}

      {/* Ambient occlusion + tyre contacts */}
      <svg width={v.w} height={v.h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <polygon points={poly(1.06)} fill="#000" opacity={shadow.contact * 0.85} filter={`url(#${ids.ao})`} />
        <g filter={`url(#${ids.tyre})`} opacity={shadow.contact}>
          <ellipse cx={nf[0]} cy={nf[1] - 2} rx={v.w * 0.05} ry={v.w * 0.009} fill="#000" />
          <ellipse cx={nr[0]} cy={nr[1] - 2} rx={v.w * 0.045} ry={v.w * 0.008} fill="#000" />
          <ellipse cx={ff[0] + v.w * 0.02} cy={ff[1] - 2} rx={v.w * 0.035} ry={v.w * 0.007} fill="#000" />
        </g>
      </svg>

      {/* The car itself */}
      <Img src={src} style={{...imgBase, filter}} />

      {/* Directional light that matches the plate's sun, clipped to the body */}
      {light ? (
        <Img
          src={src}
          style={{
            ...imgBase,
            filter: `url(#${ids.fill})`,
            mixBlendMode: light.blend ?? 'screen',
            opacity: light.strength,
            ...mask(`linear-gradient(${light.angle}deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) ${light.reach ?? 55}%)`),
          }}
        />
      ) : null}

      {/* Specular sweep */}
      {g !== null ? (
        <Img
          src={src}
          style={{
            ...imgBase,
            filter: `url(#${ids.white})`,
            mixBlendMode: 'soft-light',
            opacity: 0.9,
            ...mask(
              `linear-gradient(105deg, rgba(0,0,0,0) ${g - 9}%, rgba(0,0,0,1) ${g}%, rgba(0,0,0,0) ${g + 9}%)`,
            ),
          }}
        />
      ) : null}
    </div>
  );
};
