# Changelog

## Unreleased

## 3.0.2 (2026-05-24)

### Bug Fixes

- **Android/Build:** `android/build.gradle` referenced `getDefaultProguardFile('proguard-android.txt')`, which AGP 8+ no longer supports (it bundles `-dontoptimize`, neutralizing R8). Consumer apps on AGP 8+ failed Gradle sync. Switched to `proguard-android-optimize.txt`, matching the sibling plugins (dnd, permissions, kiosk). Patch only — no consumer-facing API change. Closes #1.

## 3.0.1 (2026-05-21)

### Bug Fixes

- **Build:** Fixed empty `dist/esm/index.d.ts` — `vite-plugin-dts` with `rollupTypes: true` produced an empty types bundle under TypeScript 6 (its internal API Extractor uses TS 5.x and silently dropped all declarations). Removed `rollupTypes` and set `tsconfig.json` `rootDir: "src"` so per-file `.d.ts` files land flat at `dist/esm/` and consumers actually get types instead of `any`.

### Improvements

- iOS Swift version aligned: `GachlabCapacitorKeepAwakePlugin.podspec` now declares `swift_version = '5.9'` to match `Package.swift`'s `swift-tools-version: 5.9` (was `5.1`).
- iOS dependency pinned: `Package.swift` now uses `.upToNextMajor(from: "8.0.0")` for `capacitor-swift-pm` instead of `branch: "main"`.
- Added `publishConfig.access: public` to `package.json`.
- README: clarified the meaning of the `isAllowedSleep` property — the name describes whether the device is *allowed to sleep*, so a successful `dontAllowSleep()` returns `false`.

## 3.0.0

### Breaking Changes

- **Renamed `isAllowdSleep` → `isAllowedSleep`** in all return types (typo fix)

### Bug Fixes

- **iOS:** Fixed potential deadlock — replaced `DispatchQueue.main.sync` with async + completion handler
- **Android:** Fixed race condition — `dontAllowSleep`/`allowSleep` now wait for the UI thread operation to complete before resolving
- **Android:** Added null check for `getActivity()` to prevent `NullPointerException`
- **Android:** Added proper error handling with `call.reject()` instead of crashing on exceptions

### New Features

- **`isKeepAwake()` method** — query the current keep-awake state on all platforms
- **Web implementation** — uses the Screen Wake Lock API (`navigator.wakeLock`)
- **Web tests** — 7 unit tests with Vitest
- **CI/CD** — GitHub Actions for build/test on push and npm publish on tags

### Improvements

- Replaced hardcoded `generate-types` script with `vite-plugin-dts`
- Added JSDoc comments to TypeScript interface
- Fixed iOS test file (replaced boilerplate `echo()` with real tests)
