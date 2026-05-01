package com.gachlab.capacitor.keepawake;

import static org.junit.Assert.*;

import org.junit.Test;

public class KeepAwakeTest {

    @Test
    public void dontAllowSleep_throwsWhenActivityNull() {
        KeepAwake keepAwake = new KeepAwake();
        try {
            keepAwake.dontAllowSleep(null);
            fail("Expected IllegalStateException");
        } catch (Exception e) {
            assertEquals("Activity is not available", e.getMessage());
        }
    }

    @Test
    public void allowSleep_throwsWhenActivityNull() {
        KeepAwake keepAwake = new KeepAwake();
        try {
            keepAwake.allowSleep(null);
            fail("Expected IllegalStateException");
        } catch (Exception e) {
            assertEquals("Activity is not available", e.getMessage());
        }
    }

    @Test
    public void isKeepAwake_throwsWhenActivityNull() {
        KeepAwake keepAwake = new KeepAwake();
        try {
            keepAwake.isKeepAwake(null);
            fail("Expected IllegalStateException");
        } catch (IllegalStateException e) {
            assertEquals("Activity is not available", e.getMessage());
        }
    }
}
