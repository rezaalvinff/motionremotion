import {useId} from 'react';

/** React ids contain ":" which breaks `url(#id)` references. */
export const useSafeId = (prefix: string) => `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
