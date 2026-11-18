# Mitsubishi Family Promo — Remotion

Vertical 9:16 promo (1080×1920, 30 fps, 25 s, H.264) for Mitsubishi Xpander & Destinator.
Theme: **Setiap Keluarga Punya Ceritanya.**

Final render: `out/mitsubishi-family-promo.mp4`

## Commands

```bash
npm install
npm run dev        # Remotion Studio preview
npm run render     # renders out/mitsubishi-family-promo.mp4
```

## Timeline

| Scene | Time | Component |
|---|---|---|
| 1 Opening | 0.0 – 3.6 s | `src/scenes/Scene1Opening.tsx` |
| 2 Xpander (+ family cut-away at 9.2 s) | 3.6 – 12.0 s | `src/scenes/Scene2Xpander.tsx` |
| 3 Destinator | 12.0 – 17.6 s | `src/scenes/Scene3Destinator.tsx` |
| 4 Comparison | 17.6 – 21.0 s | `src/scenes/Scene4Comparison.tsx` |
| 5 Closing | 21.0 – 25.0 s | `src/scenes/Scene5Closing.tsx` |

All timing (scene lengths, voice-over phrase placement, text cues, SFX cues) lives in
`src/config/timeline.ts`. Scene lengths are aligned to the supplied voice-over, whose
Xpander line runs ~8 s.

## Assets (`public/`)

| Path | Source |
|---|---|
| `images/xpander.png`, `images/destinator.png` | Original unit photos |
| `images/cutouts/*-cutout.png` | Same photos with the showroom background masked out (pixels untouched) |
| `images/residential-bg.png`, `family.png`, `mountain-road.png`, `modern-plaza.png` | Backgrounds |
| `logos/mitsubishi-dipo-logo.png` | Mitsubishi DIPO logo (transparent) |
| `audio/voice-over.wav` | Voice-over |
| `fonts/` | Montserrat + Inter (bundled, no network needed) |

### Adding music and sound effects

Drop files with these names in and re-render — they are detected automatically
(`src/config/assets.ts` → `OPTIONAL_AUDIO`). Music is ducked under the voice-over.

- `public/audio/background-music.mp3` (or `.wav` / `.m4a`)
- `public/audio/sfx/whoosh.mp3` — whip pans (9.0 s, 11.9 s, 17.4 s)
- `public/audio/sfx/bass-impact.mp3` — Xpander reveal (3.7 s), Destinator title (14.1 s)
- `public/audio/sfx/riser.mp3` — into the comparison (16.1 → 17.6 s)
- `public/audio/sfx/final-impact.mp3` — closing question (21.3 s)

## Structure

```
src/
  config/      assets.ts (paths + sizes), timeline.ts (all timing)
  lib/         camera math, easing, fonts, safe area
  components/  Plate (camera on a photo), Vehicle (grounded car: shadows,
               reflection, light), Typography, Atmosphere, Transitions, Brand, Soundtrack
  scenes/      one component per scene; PlazaSet shared by scenes 4–5
```
