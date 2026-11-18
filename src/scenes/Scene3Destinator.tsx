import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Shade, SunGlow} from '../components/Atmosphere';
import {CopyBlock} from '../components/CopyBlock';
import {DirectionalBlur} from '../components/DirectionalBlur';
import {Plate} from '../components/Plate';
import {AccentRule, MaskLine} from '../components/Typography';
import {Vehicle} from '../components/Vehicle';
import {PLATES} from '../config/assets';
import {CUE, SCENE} from '../config/timeline';
import {camAbout, plateTransform} from '../lib/camera';
import {SAFE} from '../lib/layout';
import {EASE, keyframes, progress, whipTransform, wobble} from '../lib/motion';

/** Road vanishing point in the mountain plate (source px) and where it sits on screen. */
const VANISH = {wx: 330, wy: 880, sx: 300, sy: 1160};
/** Destinator held in frame by the tracking camera (screen px). */
const CAR = {x: 530, y: 1440, width: 940};

/**
 * Scene 3 — Mitsubishi Destinator (12.0–17.6 s). Tracking shot: the camera
 * leads the car down the mountain road, so the road streams away behind it
 * (radial motion blur) while the car stays locked in frame.
 */
export const Scene3Destinator: React.FC = () => {
  const f = useCurrentFrame();
  const d = SCENE.destinator.duration;
  const at = (abs: number) => abs - SCENE.destinator.from;
  const plate = PLATES.mountainRoad;

  const zoom = interpolate(f, [0, d], [1.34, 1.06]);
  const t = plateTransform(plate, camAbout(plate, zoom, VANISH.wx, VANISH.wy, VANISH.sx, VANISH.sy));

  const whipIn = 1 - progress(f, 0, 11, EASE.out);
  const punch = keyframes(f, [at(CUE.destinatorName) - 2, at(CUE.destinatorName) + 3, at(CUE.destinatorName) + 26], [0, 1, 0], EASE.out);
  const riser = progress(f, d - 44, 44, EASE.in);
  const shakeX = wobble(f, 1, 2.2 + riser * 5);
  const shakeY = wobble(f, 2, 1.6 + riser * 4);
  const bounce = wobble(f * 1.6, 7, 1.3);
  const exit = d - 22;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DirectionalBlur x={whipIn * 90}>
        <AbsoluteFill style={{transform: whipTransform(whipIn)}}>
          <AbsoluteFill
            style={{
              transform: `translate(${shakeX}px, ${shakeY}px) scale(${(1 + punch * 0.045) * (1 + riser * 0.14)})`,
              transformOrigin: `${CAR.x}px ${CAR.y - 200}px`,
              filter: riser > 0.01 ? `brightness(${1 + riser * 0.35})` : undefined,
            }}
          >
            <Plate
              plate={plate}
              t={t}
              filter="saturate(1.06) contrast(1.03)"
              zoomBlur={{amount: 0.014 + riser * 0.06 + punch * 0.02, x: VANISH.sx, y: VANISH.sy, samples: 5}}
            />
            <SunGlow x={60} y={150} size={1000} intensity={0.35} color="255,246,220" />
            <Vehicle
              vehicle="destinator"
              x={CAR.x}
              y={CAR.y + bounce}
              width={CAR.width}
              grade={{brightness: 1.03, contrast: 1.05, saturate: 1.05}}
              light={{angle: 160, color: '#fff4e0', strength: 0.22, blend: 'screen', reach: 45}}
              shadow={{contact: 0.95, castX: 55, castY: 22, cast: 0.42}}
              glint={f >= at(CUE.destinatorName) && f <= at(CUE.destinatorName) + 30 ? progress(f, at(CUE.destinatorName), 30, EASE.inOut) : null}
            />
          </AbsoluteFill>
          <Shade edge="top" reach={40} />
          <CopyBlock top={SAFE.top + 30}>
            <AccentRule frame={f} at={at(CUE.destinatorName) - 6} exitAt={exit} />
            <MaskLine frame={f} at={at(CUE.destinatorName) - 3} exitAt={exit} variant="eyebrow" energetic>
              MITSUBISHI
            </MaskLine>
            <div style={{height: 10}} />
            <MaskLine frame={f} at={at(CUE.destinatorName)} exitAt={exit + 2} variant="display" energetic>
              DESTINATOR
            </MaskLine>
            <div style={{height: 22}} />
            <MaskLine frame={f} at={at(CUE.destinatorClaim)} exitAt={exit + 4} variant="sub">
              Siap untuk Liburan Keluarga
            </MaskLine>
          </CopyBlock>
        </AbsoluteFill>
      </DirectionalBlur>
    </AbsoluteFill>
  );
};
