package com.gachlab.capacitor.keepawake;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "KeepAwake")
public class KeepAwakePlugin extends Plugin {

    private final KeepAwake implementation = new KeepAwake();

    @PluginMethod
    public void dontAllowSleep(PluginCall call) {
        try {
            boolean isAllowedSleep = implementation.dontAllowSleep(getActivity());
            JSObject ret = new JSObject();
            ret.put("isAllowedSleep", isAllowedSleep);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to set keep awake", e);
        }
    }

    @PluginMethod
    public void allowSleep(PluginCall call) {
        try {
            boolean isAllowedSleep = implementation.allowSleep(getActivity());
            JSObject ret = new JSObject();
            ret.put("isAllowedSleep", isAllowedSleep);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to allow sleep", e);
        }
    }

    @PluginMethod
    public void isKeepAwake(PluginCall call) {
        try {
            boolean isKeepAwake = implementation.isKeepAwake(getActivity());
            JSObject ret = new JSObject();
            ret.put("isKeepAwake", isKeepAwake);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to check keep awake state", e);
        }
    }
}
