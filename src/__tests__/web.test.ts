import { describe, it, expect, beforeEach, vi } from 'vitest';
import { KeepAwakeWeb } from '../web';

describe('KeepAwakeWeb', () => {
  let plugin: KeepAwakeWeb;

  beforeEach(() => {
    plugin = new KeepAwakeWeb();
  });

  describe('without Wake Lock API', () => {
    it('dontAllowSleep returns isAllowedSleep true when API unavailable', async () => {
      const result = await plugin.dontAllowSleep();
      expect(result).toEqual({ isAllowedSleep: true });
    });

    it('allowSleep returns isAllowedSleep true', async () => {
      const result = await plugin.allowSleep();
      expect(result).toEqual({ isAllowedSleep: true });
    });

    it('isKeepAwake returns false when no lock held', async () => {
      const result = await plugin.isKeepAwake();
      expect(result).toEqual({ isKeepAwake: false });
    });
  });

  describe('with Wake Lock API', () => {
    const mockRelease = vi.fn().mockResolvedValue(undefined);
    let mockSentinel: { release: typeof mockRelease; addEventListener: ReturnType<typeof vi.fn> };

    beforeEach(() => {
      mockRelease.mockClear();
      mockSentinel = {
        release: mockRelease,
        addEventListener: vi.fn(),
      };
      Object.defineProperty(navigator, 'wakeLock', {
        value: { request: vi.fn().mockResolvedValue(mockSentinel) },
        writable: true,
        configurable: true,
      });
    });

    it('dontAllowSleep acquires wake lock', async () => {
      const result = await plugin.dontAllowSleep();
      expect(navigator.wakeLock.request).toHaveBeenCalledWith('screen');
      expect(result).toEqual({ isAllowedSleep: false });
    });

    it('isKeepAwake returns true after dontAllowSleep', async () => {
      await plugin.dontAllowSleep();
      const result = await plugin.isKeepAwake();
      expect(result).toEqual({ isKeepAwake: true });
    });

    it('allowSleep releases wake lock', async () => {
      await plugin.dontAllowSleep();
      const result = await plugin.allowSleep();
      expect(mockRelease).toHaveBeenCalled();
      expect(result).toEqual({ isAllowedSleep: true });
    });

    it('isKeepAwake returns false after allowSleep', async () => {
      await plugin.dontAllowSleep();
      await plugin.allowSleep();
      const result = await plugin.isKeepAwake();
      expect(result).toEqual({ isKeepAwake: false });
    });

    it('dontAllowSleep handles request failure gracefully', async () => {
      (navigator.wakeLock.request as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Not allowed'),
      );
      const result = await plugin.dontAllowSleep();
      expect(result).toEqual({ isAllowedSleep: true });
    });
  });
});
