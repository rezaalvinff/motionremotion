import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useSafeId} from './useSafeId';

/**
 * Directional motion blur (SVG Gaussian with separate x/y deviation).
 * Used selectively for whip pans; the DOM stays identical when amount is 0.
 */
export const DirectionalBlur: React.FC<{x: number; y?: number; children: React.ReactNode}> = ({
  x,
  y = 0,
  children,
}) => {
  const id = useSafeId('dblur');
  const active = x > 0.2 || y > 0.2;
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id={id} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation={`${x} ${y}`} edgeMode="duplicate" />
        </filter>
      </svg>
      <AbsoluteFill style={{filter: active ? `url(#${id})` : 'none'}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
