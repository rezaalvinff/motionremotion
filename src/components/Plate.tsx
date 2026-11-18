import React from 'react';
import {Img, staticFile} from 'remotion';
import type {PlateAsset} from '../config/assets';
import type {PlateTransform} from '../lib/camera';

type Props = {
  plate: PlateAsset;
  t: PlateTransform;
  filter?: string;
  /**
   * Radial (zoom) motion blur: extra copies scaled around a screen point.
   * amount = total scale spread, e.g. 0.03 = 3 %.
   */
  zoomBlur?: {amount: number; x: number; y: number; samples?: number};
};

const layerStyle = (plate: PlateAsset, left: number, top: number, s: number): React.CSSProperties => ({
  position: 'absolute',
  left: 0,
  top: 0,
  width: plate.w,
  height: plate.h,
  transform: `translate(${left}px, ${top}px) scale(${s})`,
  transformOrigin: '0 0',
  willChange: 'transform',
});

/** A background photo filmed by the virtual camera. */
export const Plate: React.FC<Props> = ({plate, t, filter, zoomBlur}) => {
  const src = staticFile(plate.src);
  const samples = zoomBlur && zoomBlur.amount > 0.002 ? zoomBlur.samples ?? 5 : 0;
  const copies = [];
  for (let i = 1; i <= samples; i++) {
    const f = 1 + (zoomBlur!.amount * i) / samples;
    const left = zoomBlur!.x + (t.left - zoomBlur!.x) * f;
    const top = zoomBlur!.y + (t.top - zoomBlur!.y) * f;
    copies.push(
      <Img
        key={i}
        src={src}
        style={{...layerStyle(plate, left, top, t.s * f), opacity: 1 / (i + 1)}}
      />,
    );
  }
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', filter}}>
      <Img src={src} style={layerStyle(plate, t.left, t.top, t.s)} />
      {copies}
    </div>
  );
};
