import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { KeepAwakeWeb } from '../web';

describe('KeepAwakeWeb', () => {
  let plugin: KeepAwakeWeb;

  beforeEach(() => {
    plugin = new KeepAwakeWeb();
  });

  describe('without Wake Lock API', () => {
    it('dontAllowSleep returns isAllowedSleep true when API unavailable', async () => {
      const result = await plugin.dontAllowSleep();
      assert.deepStrictEqual(result, { isAllowedSleep: true });
    });

    it('allowSleep returns isAllowedSleep true', async () => {
      const result = await plugin.allowSleep();
      assert.deepStrictEqual(result, { isAllowedSleep: true });
    });

    it('isKeepAwake returns false when no lock held', async () => {
      const result = await plugin.isKeepAwake();
      assert.deepStrictEqual(result, { isKeepAwake: false });
    });
  });

  describe('with Wake Lock API', () => {
    let mockRelease: ReturnType<typeof mock.fn>;
    let mockRequest: ReturnType<typeof mock.fn>;
    let mockSentinel: { release: ReturnType<typeof mock.fn>; addEventListener: ReturnType<typeof mock.fn> };

    beforeEach(() => {
      mockRelease = mock.fn(async () => undefined);
      mockSentinel = {
        release: mockRelease,
        addEventListener: mock.fn(),
      };
      mockRequest = mock.fn(async () => mockSentinel);
      Object.defineProperty(navigator, 'wakeLock', {
        value: { request: mockRequest },
        writable: true,
        configurable: true,
      });
    });

    it('dontAllowSleep acquires wake lock', async () => {
      const result = await plugin.dontAllowSleep();
      assert.deepStrictEqual(mockRequest.mock.calls[0].arguments, ['screen']);
      assert.deepStrictEqual(result, { isAllowedSleep: false });
    });

    it('isKeepAwake returns true after dontAllowSleep', async () => {
      await plugin.dontAllowSleep();
      const result = await plugin.isKeepAwake();
      assert.deepStrictEqual(result, { isKeepAwake: true });
    });

    it('allowSleep releases wake lock', async () => {
      await plugin.dontAllowSleep();
      const result = await plugin.allowSleep();
      assert.ok(mockRelease.mock.callCount() > 0);
      assert.deepStrictEqual(result, { isAllowedSleep: true });
    });

    it('isKeepAwake returns false after allowSleep', async () => {
      await plugin.dontAllowSleep();
      await plugin.allowSleep();
      const result = await plugin.isKeepAwake();
      assert.deepStrictEqual(result, { isKeepAwake: false });
    });

    it('dontAllowSleep handles request failure gracefully', async () => {
      Object.defineProperty(navigator, 'wakeLock', {
        value: {
          request: mock.fn(async () => {
            throw new Error('Not allowed');
          }),
        },
        writable: true,
        configurable: true,
      });
      const result = await plugin.dontAllowSleep();
      assert.deepStrictEqual(result, { isAllowedSleep: true });
    });

    it('emits wakeLockReleased when the system releases the lock', async () => {
      let releaseHandler: (() => void) | undefined;
      mockSentinel.addEventListener = mock.fn((event: string, cb: () => void) => {
        if (event === 'release') releaseHandler = cb;
      });
      const events: Array<{ reason: string; timestamp: number }> = [];
      await plugin.addListener('wakeLockReleased', (e) => events.push(e));
      await plugin.dontAllowSleep();

      releaseHandler?.();

      assert.strictEqual(events.length, 1);
      assert.strictEqual(events[0].reason, 'browser');
      assert.strictEqual(typeof events[0].timestamp, 'number');
    });

    it('does not emit wakeLockReleased on an explicit allowSleep', async () => {
      let releaseHandler: (() => void) | undefined;
      mockSentinel.addEventListener = mock.fn((event: string, cb: () => void) => {
        if (event === 'release') releaseHandler = cb;
      });
      const events: unknown[] = [];
      await plugin.addListener('wakeLockReleased', (e) => events.push(e));
      await plugin.dontAllowSleep();
      await plugin.allowSleep();

      // Browsers also fire 'release' as a result of our own release() call.
      releaseHandler?.();

      assert.strictEqual(events.length, 0);
    });
  });
});
