#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Copyright (c) 2026 gachlab
#
# Integration tests on a real emulator. Runs the plugin's instrumented
# androidTest suite (DoNotDisturb against the real NotificationManager) via
# `adb` + `am instrument` rather than Gradle's UTP runner — UTP's split-APK
# installer is flaky on CI emulators ("Broken pipe"), whereas plain adb is the
# proven path (same as the e2e harness).
#
# Pre-condition: the instrumented test APK is built on the host beforehand with
#   (cd android && ./gradlew assembleDebugAndroidTest)

set -euo pipefail

TEST_APK=$(find android/build/outputs/apk/androidTest/debug -name "*.apk" | head -1)
RUNNER="com.gachlab.capacitor.keepawake.test/androidx.test.runner.AndroidJUnitRunner"

"$(dirname "$0")/wait-for-emulator.sh"

echo "→ Installing instrumented test APK: $TEST_APK"
adb install -r -t --no-streaming "$TEST_APK"

echo "→ Running instrumented tests ($RUNNER)"
INST_LOG=/tmp/instrument_out.txt
adb shell am instrument -w "$RUNNER" > "$INST_LOG" 2>&1 &
INST_PID=$!
INST_TIMEOUT=300
INST_END=$(( $(date +%s) + INST_TIMEOUT ))
while kill -0 "$INST_PID" 2>/dev/null; do
  if [[ $(date +%s) -ge $INST_END ]]; then
    kill "$INST_PID" 2>/dev/null || true
    echo "✗ Instrumented tests timed out after ${INST_TIMEOUT}s"
    cat "$INST_LOG"
    exit 1
  fi
  sleep 5
done
wait "$INST_PID" || true
OUT=$(cat "$INST_LOG")
echo "$OUT"

echo ""
echo "── Assertions ──────────────────────────────────────────────────────"
if echo "$OUT" | grep -qE "Process crashed|INSTRUMENTATION_FAILED|FAILURES!!!"; then
  echo "✗ Android integration tests FAILED"
  exit 1
fi
if echo "$OUT" | grep -qE "^OK \([0-9]+ test"; then
  echo "✓ Android integration tests PASSED"
  exit 0
fi
echo "✗ Could not confirm integration test success (no 'OK (N tests)' marker)"
exit 1
