package com.gachlab.capacitor.keepawake;

import android.app.Activity;
import android.view.WindowManager;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicBoolean;

public class KeepAwake {

    public boolean dontAllowSleep(Activity activity) throws Exception {
        if (activity == null) {
            throw new IllegalStateException("Activity is not available");
        }
        final CountDownLatch latch = new CountDownLatch(1);
        activity.runOnUiThread(() -> {
            activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            latch.countDown();
        });
        latch.await();
        return false;
    }

    public boolean allowSleep(Activity activity) throws Exception {
        if (activity == null) {
            throw new IllegalStateException("Activity is not available");
        }
        final CountDownLatch latch = new CountDownLatch(1);
        activity.runOnUiThread(() -> {
            activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            latch.countDown();
        });
        latch.await();
        return true;
    }

    public boolean isKeepAwake(Activity activity) {
        if (activity == null) {
            throw new IllegalStateException("Activity is not available");
        }
        int flags = activity.getWindow().getAttributes().flags;
        return (flags & WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON) != 0;
    }
}
