import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Dust, Shade, SunGlow} from '../components/Atmosphere';
import {CopyBlock} from '../components/CopyBlock';
import {Plate} from '../components/Plate';
import {AccentRule, MaskLine} from '../components/Typography';
import {PLATES} from '../config/assets';
import {plateTransform, toScreen} from '../lib/camera';
import {EASE, keyframes} from '../lib/motion';

export const RESIDENTIAL_SUN = {x: 30, y: 560};

/**
 * Scene 1 — Opening (0–3.6 s). Establishing shot of the family home, slow
 * push-in with the sun blooming through the trees. One statement, nothing else.
 */
export const Scene1Opening: React.FC = () => {
  const f = useCurrentFrame();
  const plate = PLATES.residential;
  const t = plateTransform(plate, {
    zoom: keyframes(f, [0, 108], [1.12, 1.2], EASE.soft),
    cx: keyframes(f, [0, 108], [462, 480], EASE.soft),
    cy: keyframes(f, [0, 108], [800, 770], EASE.soft),
  });
  const exposure = interpolate(f, [0, 12], [0.62, 1], {extrapolateRight: 'clamp', easing: EASE.out});
  const sun = toScreen(t, RESIDENTIAL_SUN.x, RESIDENTIAL_SUN.y);
  const textDrift = interpolate(f, [0, 108], [14, -16]);

  return (
    <AbsoluteFill>
      <Plate plate={plate} t={t} filter={`brightness(${exposure}) saturate(1.04)`} />
      {/* Parallax: the bloom drifts slower than the plate, dust faster. */}
      <SunGlow x={sun.x - 40 + f * 0.25} y={sun.y} size={900} intensity={0.55 + 0.1 * Math.sin(f * 0.08)} />
      <Dust frame={f} seed="s1" count={22} parallaxX={f * 0.6} parallaxY={-f * 0.9} opacity={0.8} />
      <Shade edge="bottom" reach={46} opacity={0.95} />
      <CopyBlock top={1188} style={{transform: `translateY(${textDrift}px)`}}>
        <AccentRule frame={f} at={6} exitAt={90} />
        <MaskLine frame={f} at={10} exitAt={92} variant="title" style={{fontSize: 64, fontWeight: 700, letterSpacing: '0.04em'}}>
          SETIAP KELUARGA
        </MaskLine>
        <MaskLine frame={f} at={18} exitAt={95} variant="title" style={{fontSize: 80}}>
          PUNYA CERITANYA.
        </MaskLine>
      </CopyBlock>
    </AbsoluteFill>
  );
};
