import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Dust, Shade, SunGlow} from '../components/Atmosphere';
import {CopyBlock} from '../components/CopyBlock';
import {DirectionalBlur} from '../components/DirectionalBlur';
import {Plate} from '../components/Plate';
import {AccentRule, MaskLine} from '../components/Typography';
import {Vehicle} from '../components/Vehicle';
import {PLATES} from '../config/assets';
import {CUE, SCENE, XPANDER_FAMILY_CUT} from '../config/timeline';
import {plateTransform, toScreen} from '../lib/camera';
import {SAFE} from '../lib/layout';
import {EASE, keyframes, progress, whipTransform} from '../lib/motion';
import {RESIDENTIAL_SUN} from './Scene1Opening';

/** Where the Xpander is parked in the residential plate (source pixels). */
const XPANDER_SPOT = {x: 468, y: 1206, width: 640};

const XpanderHero: React.FC<{f: number}> = ({f}) => {
  const plate = PLATES.residential;
  const zoom = keyframes(f, [0, 40, XPANDER_FAMILY_CUT], [1.0, 1.05, 1.11], EASE.soft);
  const t = plateTransform(plate, {zoom, cx: 470, cy: 900});
  // The car is nearer than the house: it grows a little faster on the dolly-in.
  const e = 1 + (zoom - 1) * 0.3;
  const p = toScreen(t, XPANDER_SPOT.x, XPANDER_SPOT.y);
  const sun = toScreen(t, RESIDENTIAL_SUN.x, RESIDENTIAL_SUN.y);
  // Push-through into the family cut-away.
  const push = progress(f, XPANDER_FAMILY_CUT - 8, 8, EASE.in);
  return (
    <AbsoluteFill style={{transform: `scale(${1 + push * 0.1})`, filter: push > 0.01 ? `blur(${push * 5}px)` : undefined}}>
      <Plate plate={plate} t={t} filter="saturate(1.04) contrast(1.02)" />
      <SunGlow x={sun.x} y={sun.y} size={760} intensity={0.45} />
      <Vehicle
        vehicle="xpander"
        x={540 + (p.x - 540) * e}
        y={960 + (p.y - 960) * e}
        width={XPANDER_SPOT.width * t.s * e}
        grade={{brightness: 1.0, contrast: 1.04, saturate: 1.03, sepia: 0.06}}
        light={{angle: 125, color: '#ffcf8a', strength: 0.4, blend: 'soft-light', reach: 62}}
        shadow={{contact: 0.92, castX: 80, castY: 16, cast: 0.38}}
        glint={f >= 10 && f <= 52 ? progress(f, 10, 42, EASE.inOut) : null}
      />
      <Dust frame={f + 108} seed="s2" count={18} parallaxX={f * 0.8} parallaxY={-f * 0.5} opacity={0.65} />
    </AbsoluteFill>
  );
};

const FamilyCutaway: React.FC<{f: number}> = ({f}) => {
  const plate = PLATES.family;
  const local = f - XPANDER_FAMILY_CUT;
  const t = plateTransform(plate, {
    zoom: keyframes(local, [0, 84], [1.0, 1.07], EASE.soft),
    cx: keyframes(local, [0, 84], [478, 498], EASE.soft),
    cy: 655,
  });
  const settle = 1 - progress(local, 0, 14, EASE.out);
  return (
    <AbsoluteFill style={{transform: `scale(${1 + settle * 0.08})`, filter: settle > 0.01 ? `blur(${settle * 5}px)` : undefined}}>
      <Plate plate={plate} t={t} filter="saturate(1.03) contrast(1.03)" />
      <SunGlow x={40} y={260} size={900} intensity={0.35} />
    </AbsoluteFill>
  );
};

/**
 * Scene 2 — Mitsubishi Xpander (3.6–12.0 s). Hero shot of the Xpander parked
 * at home, then a lifestyle cut-away of the family on the VO pause. The copy
 * block persists across the cut so the claim stays tied to the car.
 */
export const Scene2Xpander: React.FC = () => {
  const f = useCurrentFrame();
  const at = (abs: number) => abs - SCENE.xpander.from;
  const whip = progress(f, SCENE.xpander.duration - 9, 9, EASE.in);
  const exit = SCENE.xpander.duration - 20;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DirectionalBlur x={whip * 90}>
        <AbsoluteFill style={{transform: whipTransform(-whip)}}>
          {f < XPANDER_FAMILY_CUT ? <XpanderHero f={f} /> : <FamilyCutaway f={f} />}
          <Shade edge="top" reach={42} />
          <CopyBlock top={SAFE.top + 30}>
            <AccentRule frame={f} at={at(CUE.xpanderName) - 8} exitAt={exit} />
            <MaskLine frame={f} at={at(CUE.xpanderName) - 4} exitAt={exit} variant="eyebrow">
              MITSUBISHI
            </MaskLine>
            <div style={{height: 10}} />
            <MaskLine frame={f} at={at(CUE.xpanderName)} exitAt={exit + 2} variant="display">
              XPANDER
            </MaskLine>
            <div style={{height: 22}} />
            <MaskLine frame={f} at={at(CUE.xpanderClaim)} exitAt={exit + 4} variant="sub">
              Nyaman untuk Keluarga
            </MaskLine>
          </CopyBlock>
        </AbsoluteFill>
      </DirectionalBlur>
    </AbsoluteFill>
  );
};
