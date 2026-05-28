package com.gachlab.capacitor.keepawake;

import static org.junit.Assert.*;

import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * Integration tests — exercise KeepAwake against a REAL Activity / Window on
 * an emulator/device (no Robolectric shadows, no mocks).
 */
@RunWith(AndroidJUnit4.class)
public class KeepAwakeInstrumentedTest {

    @Test
    public void dontAllowSleep_thenAllowSleep_toggleRealFlag() {
        try (ActivityScenario<TestActivity> scenario = ActivityScenario.launch(TestActivity.class)) {
            scenario.onActivity((activity) -> {
                KeepAwake keepAwake = new KeepAwake();
                try {
                    assertFalse(keepAwake.isKeepAwake(activity));
                    keepAwake.dontAllowSleep(activity);
                    assertTrue(keepAwake.isKeepAwake(activity));
                    keepAwake.allowSleep(activity);
                    assertFalse(keepAwake.isKeepAwake(activity));
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            });
        }
    }
}
