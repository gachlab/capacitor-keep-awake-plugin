# Testing — @gachlab/capacitor-keep-awake-plugin

This plugin follows the gachlab **test pyramid: unit + integration + e2e on the 3
platforms**. The e2e layer reuses the harness pattern proven in
`capacitor-background-geolocation` (example host app + emulator/simulator driven
by scripts — **no Appium**). CI runs all layers in `.github/workflows/build.yml`.

## Layers

| Layer | Web | Android | iOS |
|---|---|---|---|
| **Unit** | vitest (`src/__tests__`) — covers the web-only `wakeLockReleased` event | Robolectric (`android/src/test`) — toggles FLAG_KEEP_SCREEN_ON | XCTest (`ios/Tests`) |
| **Integration** (real OS) | — | instrumented (`android/src/androidTest`) — real Activity on emulator | XCTest on simulator |
| **E2E** (round-trip to JS) | — | `example-app` + auto-sequence + logcat (`scripts/e2e-keep-awake.sh`) | `example-app` XCUITest (`scripts/e2e-ios-keep-awake.sh`) |

## Run locally

```bash
npm test                                              # web unit (incl. wakeLockReleased)
cd android && ./gradlew test                          # JVM Robolectric unit
cd android && ./gradlew connectedDebugAndroidTest     # integration (needs emulator)
npm run build && (cd example-app && npm install && npx cap sync android && cd android && ./gradlew assembleDebug)
./.github/scripts/e2e-keep-awake.sh                   # Android e2e
xcodebuild test -scheme GachlabCapacitorKeepAwakePlugin -destination 'platform=iOS Simulator,name=iPhone 16'
npm run build && (cd example-app && npm install && npx cap sync ios) && ./.github/scripts/e2e-ios-keep-awake.sh
```

## How the e2e harness works

`example-app/www/main.js` auto-runs `dontAllowSleep → isKeepAwake → allowSleep →
isKeepAwake` on load and logs each result as `[KEEPAWAKE-E2E] isKeepAwake:true`
/ `false`. The Android script greps logcat for both lines, proving the
JS→native→real-OS-flag round-trip works. The iOS XCUITest taps `isKeepAwake`
and asserts the WebView shows a concrete state.

## Manual checklist (not automatable)

- **Web `wakeLockReleased`**: covered by web unit tests (vitest). To verify in a
  real browser, open the example app on web, request a wake lock, then hide the
  tab — `wakeLockReleased` should fire with `reason: 'visibility'`.
- **Native `wakeLockReleased`**: by design no native event fires (the OS-level
  keep-awake is firm while the activity/scene lives); the `'system'` reason is
  reserved for a future native break detector.
