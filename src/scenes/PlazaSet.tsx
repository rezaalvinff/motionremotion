import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Dust, SunGlow} from '../components/Atmosphere';
import {Plate} from '../components/Plate';
import {Vehicle, type VehicleGrade, type VehicleLight, type VehicleShadow} from '../components/Vehicle';
import {PLATES, VEHICLES, type VehicleKey} from '../config/assets';
import {SCENE} from '../config/timeline';
import {camAbout, plateTransform, toScreen} from '../lib/camera';
import {DISPLAY_FONT} from '../lib/fonts';
import {BRAND_RED} from '../lib/layout';
import {EASE, progress} from '../lib/motion';

const plate = PLATES.modernPlaza;
const SUN = {x: 215, y: 668};

/** Reference framing (end of the pull-back) in which the line-up was composed. */
const REF_ZOOM = 1.06;
const REF = plateTransform(plate, {zoom: REF_ZOOM, cx: 480, cy: 741});
const GROUND_Y = 1213; // screen y of the tyre contacts in the reference framing

/** Both cars side by side at the same depth, nothing overlapping. */
const LINEUP: Array<{key: VehicleKey; label: string; x: number; width: number}> = [
  {key: 'xpander', label: 'XPANDER', x: 286, width: 492},
  {key: 'destinator', label: 'DESTINATOR', x: 790, width: 486},
];

const world = (sx: number, sy: number) => ({x: (sx - REF.left) / REF.s, y: (sy - REF.top) / REF.s});
const ANCHOR = world(540, 1100);

// Keep paint colours true: only a light warm cast, the sunset comes from the rim light.
const GRADE: VehicleGrade = {brightness: 0.95, contrast: 1.05, saturate: 1.0, sepia: 0.035};
const LIGHT: VehicleLight = {angle: 90, color: '#ffa04a', strength: 0.32, blend: 'screen', reach: 30};
const SHADOW: VehicleShadow = {contact: 0.95, castX: 150, castY: 24, cast: 0.45};

/** Camera across scenes 4 and 5 (absolute frames): pull-back reveal, then a slow push. */
const zoomAt = (abs: number) =>
  abs < 610
    ? interpolate(abs, [SCENE.comparison.from, 610], [1.3, REF_ZOOM], {extrapolateLeft: 'clamp', easing: EASE.out})
    : interpolate(abs, [610, 750], [REF_ZOOM, 1.1], {extrapolateRight: 'clamp', easing: EASE.soft});

/**
 * The plaza at sunset with both vehicles on the polished stone. Shared by the
 * comparison and closing scenes so the camera move is continuous.
 */
export const PlazaSet: React.FC<{abs: number; glints?: boolean; labels: number}> = ({abs, glints = false, labels}) => {
  const zoom = zoomAt(abs);
  const t = plateTransform(plate, camAbout(plate, zoom, ANCHOR.x, ANCHOR.y, 540, 1100));
  const sun = toScreen(t, SUN.x, SUN.y);
  const local = abs - SCENE.comparison.from;

  return (
    <AbsoluteFill>
      <Plate plate={plate} t={t} filter="saturate(1.05) contrast(1.03)" />
      <SunGlow x={sun.x} y={sun.y} size={1100} intensity={0.6 + 0.08 * Math.sin(abs * 0.06)} />
      {LINEUP.map((car, i) => {
        const w = world(car.x, GROUND_Y);
        const p = toScreen(t, w.x, w.y);
        const width = (car.width / REF.s) * t.s;
        const v = VEHICLES[car.key];
        const k = width / v.w;
        const left = p.x - v.contacts.nearFront[0] * k;
        const g = glints ? progress(local, 18 + i * 12, 34, EASE.inOut) : 0;
        return (
          <React.Fragment key={car.key}>
            <Vehicle
              vehicle={car.key}
              x={p.x}
              y={p.y}
              width={width}
              grade={GRADE}
              light={LIGHT}
              shadow={SHADOW}
              reflection={0.3}
              glint={glints && g > 0 && g < 1 ? g : null}
            />
            <div
              style={{
                position: 'absolute',
                left: left + width / 2 - 200,
                width: 400,
                top: p.y + 34 * (t.s / REF.s),
                textAlign: 'center',
                opacity: labels,
                transform: `translateY(${(1 - labels) * 14}px)`,
              }}
            >
              <div style={{width: 34, height: 3, background: BRAND_RED, margin: '0 auto 12px'}} />
              <div
                style={{
                  fontFamily: DISPLAY_FONT,
                  fontWeight: 700,
                  fontSize: 26,
                  letterSpacing: '0.3em',
                  color: 'rgba(255,255,255,0.94)',
                  textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                  paddingLeft: '0.3em',
                }}
              >
                {car.label}
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <Dust frame={abs} seed="plaza" count={16} drift={[0.35, -0.2]} color="255,200,150" opacity={0.6} />
    </AbsoluteFill>
  );
};
