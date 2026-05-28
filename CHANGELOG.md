# Changelog

## Unreleased

## 3.1.1 (2026-05-28)

### Bug Fixes

- **Packaging:** Node ESM consumers failed to import the package with `SyntaxError: exports is not defined in ES module scope`. Same bug as `@gachlab/capacitor-permissions` (fixed in 3.1.2, gachlab/capacitor-permissions-plugin#10): the CJS bundle was emitted as `dist/plugin.cjs.js` (`.js` extension) while `package.json` declares `"type": "module"`, so Node parsed it as ESM and rejected its CommonJS syntax. Renamed the CJS output to `dist/plugin.cjs`, pointed `"main"` at it, and added an `"exports"` field with conditional `import`/`require`. Closes #14.

### CI

- Moved the iOS job from `macos-15` (GitHub-hosted) to the same self-hosted Mac Mini that runs Android e2e. Eliminates the recurring Swift Package Manager cache-stale flake (`Cordova.xcframework.zip already exists in file system`) — the SPM cache stays hot between runs on a persistent runner. Expected iOS wall-time drop similar to permissions plugin: ~7m41s → ~2m12s.
- iOS e2e script (`e2e-ios-keep-awake.sh`) now defaults to a substring match (`"iPhone"`) instead of hard-coding `"iPhone 16"`, so the simulator selector picks whatever model is installed on the runner. Also fixed a copy-pasted log prefix (`[e2e-ios-dnd]` → `[e2e-ios-keep-awake]`). Override with `SIMULATOR_NAME=…` to pin a specific model.

### Build

- Bumped Android Gradle Plugin `8.13.0` → `9.2.1` and Gradle wrapper `8.14.3` → `9.5.1` so the plugin's own CI builds against the same AGP major (9.x) that consumer apps use. No consumer-facing change — consuming apps apply their own root AGP at build time. Closes #3.
- Refreshed `@capacitor/*` toolchain in the lockfile to `8.3.4` (was `8.0.1`). The bundled `@capacitor/android@8.0.1` build script still referenced `proguard-android.txt`, which AGP 9 rejects when compiling the `:capacitor-android` module. Lockfile only — `^8.0.1` spec unchanged.

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
