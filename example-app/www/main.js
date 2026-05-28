// SPDX-License-Identifier: MIT
// Copyright (c) 2026 gachlab
//
// Minimal host page exercising the keep-awake plugin on web/Android/iOS.
//
// On load, runs the sequence dontAllowSleep → isKeepAwake → allowSleep →
// isKeepAwake and logs each isKeepAwake result with a tag so the e2e harness
// can assert the JS↔native round-trip from logcat:
//   [KEEPAWAKE-E2E] isKeepAwake:true   (real OS flag is now set)
//   [KEEPAWAKE-E2E] isKeepAwake:false  (real OS flag is now cleared)
// The wakeLockReleased event is web-only (browsers can drop the lock
// silently) and is covered by web unit tests; native has no silent release.

/* global Capacitor */

document.addEventListener('DOMContentLoaded', async () => {
  const KeepAwake = Capacitor.Plugins.KeepAwake;

  const out = document.getElementById('log');
  const stateEl = document.querySelector('[data-testid="keep-awake-state"]');
  const lastEvEl = document.querySelector('[data-testid="last-event"]');

  const log = (label, data) => {
    const line =
      `[${new Date().toISOString().slice(11, 19)}] ${label}` +
      (data === undefined ? '' : ' ' + JSON.stringify(data));
    out.textContent = line + '\n' + out.textContent;
    lastEvEl.textContent = label;
  };

  async function safe(label, fn) {
    try {
      const r = await fn();
      log(label, r);
      return r;
    } catch (e) {
      log(label + ' ERROR', { message: e?.message ?? String(e) });
    }
  }

  async function reportKeepAwake() {
    const r = await KeepAwake.isKeepAwake();
    stateEl.textContent = String(r.isKeepAwake);
    // Tagged line the e2e script greps for in logcat.
    console.log('[KEEPAWAKE-E2E] isKeepAwake:' + r.isKeepAwake);
    log('isKeepAwake', r);
  }

  document.getElementById('dontAllowSleep').onclick = () =>
    safe('dontAllowSleep', () => KeepAwake.dontAllowSleep());
  document.getElementById('allowSleep').onclick = () => safe('allowSleep', () => KeepAwake.allowSleep());
  document.getElementById('isKeepAwake').onclick = () => reportKeepAwake();

  KeepAwake.addListener('wakeLockReleased', (event) => {
    console.log('[KEEPAWAKE-E2E] event:wakeLockReleased ' + JSON.stringify(event));
    log('event:wakeLockReleased', event);
  });

  // Auto-sequence so the e2e harness has deterministic round-trip log lines.
  await safe('dontAllowSleep', () => KeepAwake.dontAllowSleep());
  await reportKeepAwake();   // expect isKeepAwake:true
  await safe('allowSleep', () => KeepAwake.allowSleep());
  await reportKeepAwake();   // expect isKeepAwake:false

  log('ready');
});
