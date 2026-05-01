# @gachlab/capacitor-keep-awake-plugin

A Capacitor plugin that prevents the device screen from sleeping. Works on Android, iOS, and Web.

| Platform | Implementation |
|----------|---------------|
| Android  | `FLAG_KEEP_SCREEN_ON` window flag |
| iOS      | `UIApplication.shared.isIdleTimerDisabled` |
| Web      | [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API) |

## Installation

```bash
npm install @gachlab/capacitor-keep-awake-plugin
npx cap sync
```

## Usage

```typescript
import { KeepAwake } from '@gachlab/capacitor-keep-awake-plugin';

// Prevent the screen from sleeping
await KeepAwake.dontAllowSleep();

// Check if keep-awake is active
const { isKeepAwake } = await KeepAwake.isKeepAwake();
console.log('Screen is kept awake:', isKeepAwake);

// Allow the screen to sleep again
await KeepAwake.allowSleep();
```

## API

### dontAllowSleep()

```typescript
dontAllowSleep() => Promise<{ isAllowedSleep: boolean }>
```

Prevents the device screen from going to sleep. On Web, this requests a screen wake lock from the browser — the lock may be denied if the page is not visible or the device is low on battery.

**Returns:** `{ isAllowedSleep: false }` when the screen is successfully kept awake. On Web, returns `{ isAllowedSleep: true }` if the wake lock request was denied.

---

### allowSleep()

```typescript
allowSleep() => Promise<{ isAllowedSleep: boolean }>
```

Releases the keep-awake lock and allows the device screen to sleep normally.

**Returns:** `{ isAllowedSleep: true }`

---

### isKeepAwake()

```typescript
isKeepAwake() => Promise<{ isKeepAwake: boolean }>
```

Checks whether the screen is currently being kept awake by this plugin.

**Returns:** `{ isKeepAwake: true }` if the screen is being kept awake, `{ isKeepAwake: false }` otherwise.

## Platform Notes

### Web

The Web implementation uses the [Screen Wake Lock API](https://caniuse.com/wake-lock). If the browser does not support it, `dontAllowSleep()` will silently fail and return `{ isAllowedSleep: true }`. The wake lock is automatically released by the browser when the page becomes hidden.

### Android

Uses `FLAG_KEEP_SCREEN_ON` on the activity window. This flag is cleared when the activity is destroyed. No special permissions are required.

### iOS

Sets `UIApplication.shared.isIdleTimerDisabled`. The idle timer is re-enabled when the app is terminated. No special permissions are required.

## Migration from v2

v3 introduces a breaking change in the return type property name:

```diff
- const { isAllowdSleep } = await KeepAwake.dontAllowSleep();
+ const { isAllowedSleep } = await KeepAwake.dontAllowSleep();
```

A new `isKeepAwake()` method is also available to query the current state.
