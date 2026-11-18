import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {Vignette} from './components/Atmosphere';
import {Soundtrack} from './components/Soundtrack';
import {LightBloom} from './components/Transitions';
import {SCENE} from './config/timeline';
import {Scene1Opening} from './scenes/Scene1Opening';
import {Scene2Xpander} from './scenes/Scene2Xpander';
import {Scene3Destinator} from './scenes/Scene3Destinator';
import {Scene4Comparison} from './scenes/Scene4Comparison';
import {Scene5Closing} from './scenes/Scene5Closing';

export const MitsubishiFamilyPromo: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000'}}>
    <Series>
      <Series.Sequence durationInFrames={SCENE.opening.duration} premountFor={20} name="1 Opening">
        <Scene1Opening />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE.xpander.duration} premountFor={20} name="2 Xpander">
        <Scene2Xpander />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE.destinator.duration} premountFor={20} name="3 Destinator">
        <Scene3Destinator />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE.comparison.duration} premountFor={20} name="4 Comparison">
        <Scene4Comparison />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE.closing.duration} premountFor={20} name="5 Closing">
        <Scene5Closing />
      </Series.Sequence>
    </Series>

    {/* Opening → Xpander: sun bloom from the top-left where the sun sits. */}
    <LightBloom peak={SCENE.xpander.from} inFrames={12} outFrames={16} originX={40} originY={560} />
    {/* Destinator → plaza: warm flash at the top of the riser. */}
    <LightBloom
      peak={SCENE.comparison.from}
      inFrames={10}
      outFrames={22}
      originX={540}
      originY={1100}
      color="255,214,170"
    />
    <Vignette />
    <Soundtrack />
  </AbsoluteFill>
);
