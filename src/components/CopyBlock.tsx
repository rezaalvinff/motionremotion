import React from 'react';
import {SAFE} from '../lib/layout';
import {TEXT_SHADOW} from './Typography';

/** Positions a stack of copy inside the safe area. */
export const CopyBlock: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  top,
  children,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      left: SAFE.left,
      top,
      width: SAFE.right - SAFE.left,
      textShadow: TEXT_SHADOW,
      ...style,
    }}
  >
    {children}
  </div>
);
