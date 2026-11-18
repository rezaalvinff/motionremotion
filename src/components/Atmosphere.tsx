import React from 'react';
import {AbsoluteFill, random} from 'remotion';

/** Darkens the frame edges a touch, like a real lens. */
export const Vignette: React.FC<{strength?: number}> = ({strength = 0.42}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 85% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** Gradient behind copy at the top (or bottom) of the frame. */
export const Shade: React.FC<{edge: 'top' | 'bottom'; opacity?: number; reach?: number; color?: string}> = ({
  edge,
  opacity = 1,
  reach = 44,
  color = '6,9,14',
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      opacity,
      background: `linear-gradient(to ${edge === 'top' ? 'bottom' : 'top'}, rgba(${color},0.72) 0%, rgba(${color},0.38) ${
        reach * 0.5
      }%, rgba(${color},0) ${reach}%)`,
    }}
  />
);

/** Warm bloom anchored to the sun in the plate. */
export const SunGlow: React.FC<{x: number; y: number; size: number; intensity: number; color?: string}> = ({
  x,
  y,
  size,
  intensity,
  color = '255,196,120',
}) => (
  <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: intensity}}>
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${color},0.95) 0%, rgba(${color},0.45) 22%, rgba(${color},0.12) 48%, rgba(${color},0) 70%)`,
      }}
    />
  </AbsoluteFill>
);

/**
 * Sun-lit dust drifting in front of the camera – a foreground depth layer
 * that moves faster than the plate (parallax).
 */
export const Dust: React.FC<{
  frame: number;
  seed: string;
  count?: number;
  drift?: [number, number];
  parallaxX?: number;
  parallaxY?: number;
  color?: string;
  opacity?: number;
}> = ({frame, seed, count = 26, drift = [0.25, -0.35], parallaxX = 0, parallaxY = 0, color = '255,236,200', opacity = 1}) => (
  <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity}}>
    {new Array(count).fill(0).map((_, i) => {
      const r = (k: string) => random(`${seed}-${i}-${k}`);
      const depth = 0.4 + r('d') * 0.9;
      const size = 3 + depth * 9;
      const x = ((r('x') * 1180 + frame * drift[0] * depth + parallaxX * depth) % 1180 + 1180) % 1180 - 50;
      const y = ((r('y') * 2020 + frame * drift[1] * depth + parallaxY * depth) % 2020 + 2020) % 2020 - 50;
      const tw = 0.45 + 0.55 * Math.abs(Math.sin(frame * (0.03 + r('t') * 0.05) + r('p') * 6));
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: size,
            height: size,
            borderRadius: '50%',
            background: `rgba(${color},${0.55 * tw})`,
            filter: `blur(${1 + (1.3 - depth) * 3}px)`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);
