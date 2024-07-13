import { WebPlugin } from '@capacitor/core';

import type { KeepAwakePlugin } from './definitions';

export class KeepAwakeWeb extends WebPlugin implements KeepAwakePlugin {
  dontAllowSleep(): Promise<{ isAllowdSleep: boolean; }> {
    throw new Error('Method not implemented for Web.');
  }
  allowSleep(): Promise<{ isAllowdSleep: boolean; }> {
    throw new Error('Method not implemented for Web.');
  }
 
}
