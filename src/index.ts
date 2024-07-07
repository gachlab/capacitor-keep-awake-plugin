import { registerPlugin } from '@capacitor/core';

import type { CapacitorKeepAwakePlugin } from './definitions';

const CapacitorKeepAwake = registerPlugin<CapacitorKeepAwakePlugin>(
  'CapacitorKeepAwake',
  {
    web: () => import('./web').then(m => new m.CapacitorKeepAwakeWeb()),
  },
);

export * from './definitions';
export { CapacitorKeepAwake };
