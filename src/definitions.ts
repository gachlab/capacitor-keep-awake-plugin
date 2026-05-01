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
}
