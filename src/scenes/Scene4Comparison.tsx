import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Shade} from '../components/Atmosphere';
import {CopyBlock} from '../components/CopyBlock';
import {AccentRule, MaskLine} from '../components/Typography';
import {SCENE} from '../config/timeline';
import {SAFE} from '../lib/layout';
import {EASE, progress} from '../lib/motion';
import {PlazaSet} from './PlazaSet';

/**
 * Scene 4 — Comparison (17.6–21.0 s). Out of the light flash the camera pulls
 * back across the plaza to reveal both cars side by side at golden hour.
 */
export const Scene4Comparison: React.FC = () => {
  const f = useCurrentFrame();
  const exit = SCENE.comparison.duration - 14;
  return (
    <AbsoluteFill>
      <PlazaSet abs={f + SCENE.comparison.from} glints labels={progress(f, 40, 20, EASE.out)} />
      <Shade edge="top" reach={40} />
      <CopyBlock top={SAFE.top + 40}>
        <AccentRule frame={f} at={16} exitAt={exit} />
        <MaskLine frame={f} at={20} exitAt={exit} variant="title">
          DUA PILIHAN
        </MaskLine>
        <MaskLine frame={f} at={28} exitAt={exit + 2} variant="title">
          UNTUK KELUARGA.
        </MaskLine>
      </CopyBlock>
    </AbsoluteFill>
  );
};
