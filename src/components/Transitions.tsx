import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EASE} from '../lib/motion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Light-motivated transition: a bloom grows from the plate's sun, washes the
 * frame at `peak` (where the hard cut hides) and clears.
 */
export const LightBloom: React.FC<{
  peak: number;
  inFrames: number;
  outFrames: number;
  originX: number;
  originY: number;
  color?: string;
  maxOpacity?: number;
}> = ({peak, inFrames, outFrames, originX, originY, color = '255,226,186', maxOpacity = 0.96}) => {
  const f = useCurrentFrame();
  if (f < peak - inFrames || f > peak + outFrames) return null;
  const grow = interpolate(f, [peak - inFrames, peak], [0, 1], {...clamp, easing: EASE.in});
  const clear = interpolate(f, [peak, peak + outFrames], [1, 0], {...clamp, easing: EASE.out});
  const a = f <= peak ? grow : clear;
  const radius = 300 + a * 2100;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          mixBlendMode: 'screen',
          background: `radial-gradient(circle ${radius}px at ${originX}px ${originY}px, rgba(${color},${a}) 0%, rgba(${color},${
            a * 0.7
          }) 45%, rgba(${color},0) 100%)`,
        }}
      />
      <AbsoluteFill style={{background: `rgba(${color},${a * maxOpacity * 0.92})`}} />
    </AbsoluteFill>
  );
};
