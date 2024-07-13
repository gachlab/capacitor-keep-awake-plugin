export interface KeepAwakePlugin {
  dontAllowSleep(): Promise<{ isAllowdSleep: boolean }>;
  allowSleep(): Promise<{ isAllowdSleep: boolean }>;
}
