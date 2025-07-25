package com.gachlab.capacitor.keepawake;

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
        JSObject ret = new JSObject();
        ret.put("isAllowdSleep", implementation.dontAllowSleep(getActivity()));
        call.resolve(ret);
    }

    @PluginMethod
    public void allowSleep(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("isAllowdSleep", implementation.allowSleep(getActivity()));
        call.resolve(ret);
    }
}
