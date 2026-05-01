import { WebPlugin } from '@capacitor/core';

import type { KeepAwakePlugin } from './definitions';

export class KeepAwakeWeb extends WebPlugin implements KeepAwakePlugin {
  private wakeLock: WakeLockSentinel | null = null;

  async dontAllowSleep(): Promise<{ isAllowedSleep: boolean }> {
    if ('wakeLock' in navigator) {
      try {
        this.wakeLock = await navigator.wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          this.wakeLock = null;
        });
      } catch {
        // Wake Lock request failed (e.g., low battery)
      }
    }
    return { isAllowedSleep: this.wakeLock === null };
  }

  async allowSleep(): Promise<{ isAllowedSleep: boolean }> {
    if (this.wakeLock) {
      await this.wakeLock.release();
      this.wakeLock = null;
    }
    return { isAllowedSleep: true };
  }

  async isKeepAwake(): Promise<{ isKeepAwake: boolean }> {
    return { isKeepAwake: this.wakeLock !== null };
  }
}
