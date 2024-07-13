package com.gachlab.capacitor.keepawake;

import android.app.Activity;
import android.util.Log;
import android.view.WindowManager;

import androidx.appcompat.app.AppCompatActivity;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "KeepAwake")
public class KeepAwakePlugin extends Plugin {

    private KeepAwake implementation = new KeepAwake();

    @PluginMethod
    public void dontAllowSleep(PluginCall call) {
        String value = call.getString("value");
        AppCompatActivity activity=getActivity();
        JSObject ret = new JSObject();
        ret.put("isAllowedSleep",implementation.dontAllowSleep(activity));
        call.resolve(ret);
    }
    @PluginMethod
    public void allowSleep(PluginCall call) {
        String value = call.getString("value");
        AppCompatActivity activity=getActivity();
        JSObject ret = new JSObject();
        ret.put("isAllowedSleep",implementation.allowSleep(activity));
        call.resolve(ret);
    }
}
