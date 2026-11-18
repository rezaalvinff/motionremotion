import React from 'react';
import {Img, staticFile} from 'remotion';
import {LOGOS} from '../config/assets';
import {TEXT_FONT} from '../lib/fonts';
import {INK} from '../lib/layout';
import {EASE, progress} from '../lib/motion';

/** Official Mitsubishi DIPO lock-up (supplied PNG, transparent). */
export const DipoLogo: React.FC<{frame: number; at: number; height?: number}> = ({frame, at, height = 60}) => {
  const p = progress(frame, at, 24, EASE.out);
  const logo = LOGOS.mitsubishiDipo;
  return (
    <Img
      src={staticFile(logo.src)}
      style={{
        height,
        width: (height * logo.w) / logo.h,
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px)`,
        filter: `drop-shadow(0 2px 14px rgba(0,0,0,0.35))`,
      }}
    />
  );
};

/** Comment call-to-action pill. */
export const CommentCta: React.FC<{frame: number; at: number; text: string}> = ({frame, at, text}) => {
  const p = progress(frame, at, 20, EASE.out);
  const pulse = 1 + 0.018 * Math.max(0, Math.sin((frame - at - 20) * 0.16)) * (frame > at + 20 ? 1 : 0);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 18,
        padding: '22px 38px 22px 30px',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.96)',
        boxShadow: '0 18px 50px rgba(0,0,0,0.35)',
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px) scale(${(0.94 + 0.06 * p) * pulse})`,
        transformOrigin: 'center',
      }}
    >
      <svg width={42} height={42} viewBox="0 0 24 24" fill="none">
        <path
          d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5v-8Z"
          fill="#E60012"
        />
        <circle cx="8.5" cy="9.5" r="1.2" fill="#fff" />
        <circle cx="12" cy="9.5" r="1.2" fill="#fff" />
        <circle cx="15.5" cy="9.5" r="1.2" fill="#fff" />
      </svg>
      <span style={{fontFamily: TEXT_FONT, fontWeight: 600, fontSize: 38, color: INK, letterSpacing: '-0.01em'}}>
        {text}
      </span>
    </div>
  );
};
