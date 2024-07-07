import { WebPlugin } from '@capacitor/core';

import type { CapacitorKeepAwakePlugin } from './definitions';

export class CapacitorKeepAwakeWeb
  extends WebPlugin
  implements CapacitorKeepAwakePlugin {
  keepAwake(): Promise<{ isKeepAwake: boolean; }> {
    return Promise.resolve({ isKeepAwake: false });
  }
  allowSleep(): Promise<{ isKeepAwake: boolean; }> {
    return Promise.resolve({ isKeepAwake: false });
  }

}
