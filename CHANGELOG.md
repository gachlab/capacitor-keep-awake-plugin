# Changelog

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
