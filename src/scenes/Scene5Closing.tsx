import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Shade} from '../components/Atmosphere';
import {CommentCta, DipoLogo} from '../components/Brand';
import {CopyBlock} from '../components/CopyBlock';
import {MaskLine} from '../components/Typography';
import {CUE, SCENE} from '../config/timeline';
import {SAFE} from '../lib/layout';
import {EASE, progress} from '../lib/motion';
import {PlazaSet} from './PlazaSet';

/**
 * Scene 5 — Closing (21.0–25.0 s). Same line-up, the camera eases in, and the
 * question goes to the viewer. Mitsubishi DIPO lock-up and comment CTA.
 */
export const Scene5Closing: React.FC = () => {
  const f = useCurrentFrame();
  const at = (abs: number) => abs - SCENE.closing.from;
  const dim = progress(f, 0, 20, EASE.out);
  return (
    <AbsoluteFill>
      <PlazaSet abs={f + SCENE.closing.from} labels={1} />
      <AbsoluteFill style={{background: `rgba(4,6,10,${0.14 * dim})`}} />
      <Shade edge="top" reach={46} />
      <Shade edge="bottom" reach={30} opacity={0.8} />
      <CopyBlock top={SAFE.top + 10}>
        <DipoLogo frame={f} at={4} height={58} />
      </CopyBlock>
      <CopyBlock top={SAFE.top + 130}>
        <MaskLine frame={f} at={at(CUE.closingQuestion)} variant="title" style={{fontSize: 76}}>
          KALAU KAMU,
        </MaskLine>
        <MaskLine frame={f} at={at(CUE.closingQuestion2)} variant="title" style={{fontSize: 76}}>
          PILIH YANG MANA?
        </MaskLine>
        <div style={{height: 26}} />
        <MaskLine frame={f} at={at(CUE.closingQuestion2) + 22} variant="support">
          XPANDER <span style={{fontWeight: 500, fontStyle: 'italic', opacity: 0.85}}>atau</span> DESTINATOR?
        </MaskLine>
      </CopyBlock>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1330, display: 'flex', justifyContent: 'center'}}>
        <CommentCta frame={f} at={at(CUE.closingQuestion2) + 36} text="Tulis pilihanmu di komentar!" />
      </div>
    </AbsoluteFill>
  );
};
