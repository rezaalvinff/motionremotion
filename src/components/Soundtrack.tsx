import React from 'react';
import {Html5Audio, Sequence, interpolate, staticFile} from 'remotion';
import {OPTIONAL_AUDIO, VOICE_OVER} from '../config/assets';
import {DURATION_IN_FRAMES, FPS, SFX_CUES, VO_SEGMENTS} from '../config/timeline';
import {findStaticFile} from '../lib/optional-asset';

const VO_GAIN = 1.0;
const MUSIC_BED = 0.5; // music level with no voice
const MUSIC_UNDER_VO = 0.16; // ducked level under the voice

const voRanges = VO_SEGMENTS.map((s) => [s.at, s.at + Math.round((s.srcEnd - s.srcStart) * FPS)] as const);

/** Music volume per frame: fade in/out + side-chain style ducking under the VO. */
const musicVolume = (f: number) => {
  let duck = 0;
  for (const [a, b] of voRanges) {
    duck = Math.max(
      duck,
      interpolate(f, [a - 8, a, b, b + 12], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    );
  }
  const level = MUSIC_BED + (MUSIC_UNDER_VO - MUSIC_BED) * duck;
  const fade = interpolate(f, [0, 12, DURATION_IN_FRAMES - 45, DURATION_IN_FRAMES], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return level * fade;
};

const Sfx: React.FC<{src: string | null; at: number; volume: number; name: string}> = ({src, at, volume, name}) =>
  src ? (
    <Sequence from={at} name={name} layout="none">
      <Html5Audio src={src} volume={volume} />
    </Sequence>
  ) : null;

export const Soundtrack: React.FC = () => {
  const vo = staticFile(VOICE_OVER);
  const music = findStaticFile(OPTIONAL_AUDIO.music);
  const whoosh = findStaticFile(OPTIONAL_AUDIO.whoosh);
  const bass = findStaticFile(OPTIONAL_AUDIO.bassImpact);
  const riser = findStaticFile(OPTIONAL_AUDIO.riser);
  const finalImpact = findStaticFile(OPTIONAL_AUDIO.finalImpact);

  return (
    <>
      {VO_SEGMENTS.map((s, i) => (
        <Sequence key={i} from={s.at} name={`VO ${i + 1}`} layout="none">
          <Html5Audio
            src={vo}
            trimBefore={Math.round(s.srcStart * FPS)}
            durationInFrames={Math.round((s.srcEnd - s.srcStart) * FPS)}
            volume={(f) =>
              VO_GAIN *
              interpolate(f, [0, 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
            }
          />
        </Sequence>
      ))}

      {music ? <Html5Audio src={music} volume={musicVolume} name="Music" /> : null}

      {SFX_CUES.whoosh.map((at, i) => (
        <Sfx key={`w${i}`} src={whoosh} at={at - 4} volume={0.55} name="SFX whoosh" />
      ))}
      {SFX_CUES.bassImpact.map((at, i) => (
        <Sfx key={`b${i}`} src={bass} at={at} volume={0.7} name="SFX bass impact" />
      ))}
      {riser ? (
        <Sequence from={SFX_CUES.riser.from} durationInFrames={SFX_CUES.riser.to - SFX_CUES.riser.from + 6} name="SFX riser" layout="none">
          <Html5Audio src={riser} volume={0.45} />
        </Sequence>
      ) : null}
      {SFX_CUES.finalImpact.map((at, i) => (
        <Sfx key={`f${i}`} src={finalImpact} at={at} volume={0.75} name="SFX final impact" />
      ))}
    </>
  );
};
