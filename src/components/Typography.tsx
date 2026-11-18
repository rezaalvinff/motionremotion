import React from 'react';
import {interpolate} from 'remotion';
import {DISPLAY_FONT, TEXT_FONT} from '../lib/fonts';
import {BRAND_RED} from '../lib/layout';
import {EASE, progress} from '../lib/motion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type LineStyle = 'eyebrow' | 'display' | 'title' | 'sub' | 'support';

const STYLES: Record<LineStyle, React.CSSProperties> = {
  eyebrow: {fontFamily: DISPLAY_FONT, fontWeight: 600, fontSize: 34, letterSpacing: '0.32em', lineHeight: 1.1},
  display: {fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 118, letterSpacing: '-0.015em', lineHeight: 0.98},
  title: {fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 74, letterSpacing: '-0.01em', lineHeight: 1.04},
  sub: {fontFamily: TEXT_FONT, fontWeight: 500, fontSize: 46, letterSpacing: '-0.005em', lineHeight: 1.2},
  support: {fontFamily: DISPLAY_FONT, fontWeight: 600, fontSize: 40, letterSpacing: '0.02em', lineHeight: 1.2},
};

type MaskLineProps = {
  frame: number;
  /** Local frame the line starts to reveal. */
  at: number;
  /** Local frame the line starts to leave (optional). */
  exitAt?: number;
  variant: LineStyle;
  /** Snappier, slightly skewed entrance for energetic moments. */
  energetic?: boolean;
  color?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/**
 * One line of copy revealed through a mask (slides up from below its own
 * baseline). Layout never changes while animating, so nothing shifts.
 */
export const MaskLine: React.FC<MaskLineProps> = ({
  frame,
  at,
  exitAt,
  variant,
  energetic = false,
  color = '#fff',
  style,
  children,
}) => {
  const inDur = energetic ? 13 : 22;
  const p = progress(frame, at, inDur, EASE.out);
  const out = exitAt === undefined ? 0 : progress(frame, exitAt, 14, EASE.in);
  const y = interpolate(p, [0, 1], [112, 0]) - out * 112;
  const blur = (1 - p) * (energetic ? 10 : 6) + out * 6;
  const skew = energetic ? (1 - p) * -10 : 0;
  const tracking = variant === 'display' && !energetic ? (1 - p) * 0.06 : 0;
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.14em', marginBottom: '-0.14em', paddingTop: '0.04em'}}>
      <div
        style={{
          ...STYLES[variant],
          color,
          transform: `translateY(${y}%) skewX(${skew}deg)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
          opacity: interpolate(p, [0, 0.35], [0, 1], clamp) * (1 - out),
          whiteSpace: 'nowrap',
          ...(tracking ? {letterSpacing: `calc(${STYLES[variant].letterSpacing} + ${tracking}em)`} : null),
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Short brand-red rule that draws on before a headline. */
export const AccentRule: React.FC<{frame: number; at: number; exitAt?: number; width?: number}> = ({
  frame,
  at,
  exitAt,
  width = 84,
}) => {
  const p = progress(frame, at, 18, EASE.out);
  const out = exitAt === undefined ? 0 : progress(frame, exitAt, 12, EASE.in);
  return (
    <div
      style={{
        height: 7,
        width,
        background: BRAND_RED,
        transform: `scaleX(${p * (1 - out)})`,
        transformOrigin: out > 0 ? 'right center' : 'left center',
        marginBottom: 26,
        boxShadow: '0 2px 18px rgba(230,0,18,0.35)',
      }}
    />
  );
};

/** Soft text shadow that keeps white type legible over bright skies. */
export const TEXT_SHADOW = '0 2px 24px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25)';
