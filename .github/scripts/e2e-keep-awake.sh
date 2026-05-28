#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Copyright (c) 2026 gachlab
#
# E2E: keep-awake round-trip for @gachlab/capacitor-keep-awake-plugin.
#
# The host app auto-runs:
#   dontAllowSleep → isKeepAwake (true) → allowSleep → isKeepAwake (false)
# and logs each isKeepAwake result with the [KEEPAWAKE-E2E] tag. We assert
# both lines appear, which proves the JS→native→real-OS-flag round-trip works.
#
# The wakeLockReleased event is web-only (covered by web unit tests); native
# keep-awake is firm while the activity lives, so there is no native event
# round-trip to assert here.

set -euo pipefail

APK=$(find example-app/android/app/build/outputs/apk/debug -name "*.apk" | head -1)
PACKAGE="com.gachlab.capacitor.keepawake.example"
ACTIVITY=".MainActivity"
LOGCAT_OUT="/tmp/e2e-logcat.txt"
PASS=0

"$(dirname "$0")/wait-for-emulator.sh"

echo "→ Installing APK: $APK"
adb install -r --no-streaming "$APK"

echo "→ Launching app (auto-runs the keep-awake sequence)"
adb shell am start -n "${PACKAGE}/${ACTIVITY}"

# Wait until the WebView completes the auto-sequence (the :false line is logged
# last, so seeing it means both round-trips happened).
echo "→ Waiting for the auto-sequence to complete"
SEQ_END=$(( $(date +%s) + 90 ))
until adb logcat -d 2>/dev/null | grep -q "\[KEEPAWAKE-E2E\] isKeepAwake:false"; do
  if [[ $(date +%s) -ge $SEQ_END ]]; then
    echo "✗ keep-awake auto-sequence never completed within 90 s"
    adb logcat -d | grep -iE "Capacitor|chromium|console|error" | tail -30
    exit 1
  fi
  sleep 2
done

adb logcat -d > "$LOGCAT_OUT" 2>&1 || true

echo ""
echo "── Assertions ──────────────────────────────────────────────────────"

if grep -q '\[KEEPAWAKE-E2E\] isKeepAwake:true' "$LOGCAT_OUT"; then
  echo "✓ dontAllowSleep → isKeepAwake observes the real flag SET"
  PASS=$((PASS + 1))
else
  echo "✗ no isKeepAwake:true line after dontAllowSleep"
fi

if grep -q '\[KEEPAWAKE-E2E\] isKeepAwake:false' "$LOGCAT_OUT"; then
  echo "✓ allowSleep → isKeepAwake observes the real flag CLEARED"
  PASS=$((PASS + 1))
else
  echo "✗ no isKeepAwake:false line after allowSleep"
fi

echo ""
if [[ "$PASS" -eq 2 ]]; then
  echo "✓ Keep Awake E2E PASSED ($PASS/2)"
else
  echo "✗ Keep Awake E2E FAILED ($PASS/2)"
  echo "--- KEEPAWAKE-E2E log lines ---"
  grep -iE "KEEPAWAKE-E2E|isKeepAwake|dontAllowSleep|allowSleep" "$LOGCAT_OUT" | tail -30 || echo "(none)"
  exit 1
fi
