import {getStaticFiles, staticFile} from 'remotion';

/**
 * Returns the URL of the first candidate that exists in public/, or null.
 * Lets optional audio (music, SFX) be added later by just dropping a file in.
 */
export const findStaticFile = (candidates: readonly string[]): string | null => {
  const names = new Set(getStaticFiles().map((f) => f.name));
  for (const c of candidates) {
    if (names.has(c)) return staticFile(c);
  }
  return null;
};
