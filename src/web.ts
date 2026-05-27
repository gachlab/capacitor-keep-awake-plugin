import { WebPlugin } from '@capacitor/core';

import type { KeepAwakePlugin } from './definitions';

export class KeepAwakeWeb extends WebPlugin implements KeepAwakePlugin {
  private wakeLock: WakeLockSentinel | null = null;
  private intentionalRelease = false;

  async dontAllowSleep(): Promise<{ isAllowedSleep: boolean }> {
    if ('wakeLock' in navigator) {
      try {
        this.wakeLock = await navigator.wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          const wasIntentional = this.intentionalRelease;
          this.wakeLock = null;
          this.intentionalRelease = false;
          if (!wasIntentional) {
            // The browser dropped the lock on its own (hidden tab, low battery…).
            const reason =
              typeof document !== 'undefined' && document.visibilityState === 'hidden' ? 'visibility' : 'browser';
            this.notifyListeners('wakeLockReleased', { reason, timestamp: Date.now() });
          }
        });
      } catch {
        // Wake Lock request failed (e.g., low battery)
      }
    }
    return { isAllowedSleep: this.wakeLock === null };
  }

  async allowSleep(): Promise<{ isAllowedSleep: boolean }> {
    if (this.wakeLock) {
      this.intentionalRelease = true;
      await this.wakeLock.release();
      this.wakeLock = null;
    }
    return { isAllowedSleep: true };
  }

  async isKeepAwake(): Promise<{ isKeepAwake: boolean }> {
    return { isKeepAwake: this.wakeLock !== null };
  }
}
