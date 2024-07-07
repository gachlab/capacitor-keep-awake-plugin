package com.gachlab.capacitor.keepawake;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import androidx.appcompat.app.AppCompatActivity;

@CapacitorPlugin(name = "CapacitorKeepAwake")
public class CapacitorKeepAwakePlugin extends Plugin {
    final AppCompatActivity activity = getActivity();
    public CapacitorKeepAwake implementation = new CapacitorKeepAwake();

    @PluginMethod
    public void keepAwake(PluginCall call) {
         implementation.keepAwake(activity);

        JSObject ret = new JSObject();
        ret.put("isKeepAwakeActive",true);
        call.resolve(ret);
    }
    @PluginMethod
    public void allowSleep(PluginCall call) {
        implementation.allowSleep(activity);

        JSObject ret = new JSObject();
        ret.put("isKeepAwakeActive",false);
        call.resolve(ret);
    }
}
