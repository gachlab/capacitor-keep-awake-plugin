import type { PluginListenerHandle } from '@capacitor/core';

export interface KeepAwakePlugin {
  /**
   * Prevents the device screen from sleeping.
   * @returns Whether sleep is currently allowed.
   */
  dontAllowSleep(): Promise<{ isAllowedSleep: boolean }>;

  /**
   * Allows the device screen to sleep again.
   * @returns Whether sleep is currently allowed.
   */
  allowSleep(): Promise<{ isAllowedSleep: boolean }>;

  /**
   * Returns the current keep-awake state.
   * @returns Whether sleep is currently allowed.
   */
  isKeepAwake(): Promise<{ isKeepAwake: boolean }>;

  /**
   * Emitted when an active wake lock is released by the system rather than by
   * an explicit `allowSleep()` call — so consumers learn that the screen may
   * now sleep without their consent, with the moment it happened for auditing.
   *
   * This is primarily a **web** signal: browsers silently drop the Screen Wake
   * Lock when the page becomes hidden (`reason: 'visibility'`) or under system
   * pressure such as low battery (`reason: 'browser'`); the lock must be
   * re-requested afterwards. On Android/iOS the OS-level keep-awake is firm
   * while the activity/scene lives, so there is no silent release to report and
   * the event does not fire there today (`reason: 'system'` is reserved for a
   * future native break detector).
   *
   * `timestamp` is the epoch time in milliseconds when the release was observed.
   */
  addListener(
    eventName: 'wakeLockReleased',
    listenerFunc: (event: { reason: 'browser' | 'visibility' | 'system'; timestamp: number }) => void,
  ): Promise<PluginListenerHandle>;

  /**
   * Removes all listeners for this plugin.
   */
  removeAllListeners(): Promise<void>;
}
