export interface CapacitorKeepAwakePlugin {
  keepAwake(): Promise<{ isKeepAwake: boolean }>;
  allowSleep(): Promise<{ isKeepAwake: boolean }>;
}
