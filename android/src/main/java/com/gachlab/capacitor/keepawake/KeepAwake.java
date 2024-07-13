package com.gachlab.capacitor.keepawake;

import android.app.Activity;
import android.util.Log;
import android.view.WindowManager;

import androidx.appcompat.app.AppCompatActivity;

public class KeepAwake {

    public boolean dontAllowSleep(AppCompatActivity activity) {
        Log.i("KeepAwake", "Disabling Sleep");
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            }
        });
        Log.i("KeepAwake", "Sleep Disabled");
        return false;
    }

    public boolean allowSleep(AppCompatActivity activity) {
        Log.i("KeepAwake", "Enabling Sleep");
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            }
        });
        Log.i("KeepAwake", "Sleep Enabled");
        return true;
    }
}
