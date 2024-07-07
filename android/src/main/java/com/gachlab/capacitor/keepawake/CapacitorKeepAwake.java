package com.gachlab.capacitor.keepawake;

import android.util.Log;
import android.view.WindowManager;

import androidx.appcompat.app.AppCompatActivity;

public class CapacitorKeepAwake {

    public void keepAwake(AppCompatActivity activity) {
        Log.i("Capacitor.KeekAwake","Preventing device from sleeping");
        activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }

    public void allowSleep(AppCompatActivity activity) {
        Log.i("Capacitor.KeekAwake","Resuming device sleeping configuration");
        activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }
}
