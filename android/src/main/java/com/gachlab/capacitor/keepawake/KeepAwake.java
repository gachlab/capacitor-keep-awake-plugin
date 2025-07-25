package com.gachlab.capacitor.keepawake;

import android.app.Activity;
import android.view.WindowManager;

public class KeepAwake {

    public boolean dontAllowSleep(Activity activity) {
        activity.runOnUiThread(() -> {
            activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        });
        return false;
    }

    public boolean allowSleep(Activity activity) {
        activity.runOnUiThread(() -> {
            activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        });
        return true;
    }
}
