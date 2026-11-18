import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/** Fonts are bundled in public/fonts so renders never depend on the network. */
export const DISPLAY_FONT = 'Montserrat';
export const TEXT_FONT = 'Inter';

const faces: Array<[string, string, string]> = [
  [DISPLAY_FONT, '500', 'montserrat-latin-500-normal.woff2'],
  [DISPLAY_FONT, '600', 'montserrat-latin-600-normal.woff2'],
  [DISPLAY_FONT, '700', 'montserrat-latin-700-normal.woff2'],
  [DISPLAY_FONT, '800', 'montserrat-latin-800-normal.woff2'],
  [TEXT_FONT, '400', 'inter-latin-400-normal.woff2'],
  [TEXT_FONT, '500', 'inter-latin-500-normal.woff2'],
  [TEXT_FONT, '600', 'inter-latin-600-normal.woff2'],
];

let started = false;
export const ensureFonts = () => {
  if (started) return;
  started = true;
  for (const [family, weight, file] of faces) {
    loadFont({family, weight, url: staticFile(`fonts/${file}`), format: 'woff2'});
  }
};
