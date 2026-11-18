import React from 'react';
import {Composition} from 'remotion';
import {MitsubishiFamilyPromo} from './MitsubishiFamilyPromo';
import {DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH} from './config/timeline';
import {ensureFonts} from './lib/fonts';

ensureFonts();

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MitsubishiFamilyPromo"
    component={MitsubishiFamilyPromo}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
