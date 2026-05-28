package com.gachlab.capacitor.keepawake;

import static org.junit.Assert.*;

import android.app.Activity;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.Robolectric;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

/**
 * Unit tests for the pure KeepAwake implementation on Robolectric: the real
 * FLAG_KEEP_SCREEN_ON window flag is toggled and read back via a shadowed
 * Activity (no device needed).
 */
@RunWith(RobolectricTestRunner.class)
@Config(sdk = 34)
public class KeepAwakeTest {

    private Activity activity() {
        return Robolectric.buildActivity(Activity.class).setup().get();
    }

    @Test
    public void isKeepAwake_isFalse_byDefault() {
        assertFalse(new KeepAwake().isKeepAwake(activity()));
    }

    @Test
    public void dontAllowSleep_setsKeepScreenOnFlag() throws Exception {
        Activity a = activity();
        KeepAwake keepAwake = new KeepAwake();
        keepAwake.dontAllowSleep(a);
        assertTrue(keepAwake.isKeepAwake(a));
    }

    @Test
    public void allowSleep_clearsKeepScreenOnFlag() throws Exception {
        Activity a = activity();
        KeepAwake keepAwake = new KeepAwake();
        keepAwake.dontAllowSleep(a);
        keepAwake.allowSleep(a);
        assertFalse(keepAwake.isKeepAwake(a));
    }

    @Test(expected = IllegalStateException.class)
    public void dontAllowSleep_withNullActivity_throws() throws Exception {
        new KeepAwake().dontAllowSleep(null);
    }
}
