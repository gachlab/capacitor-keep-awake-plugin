import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(KeepAwakePlugin)
public class KeepAwakePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "KeepAwakePlugin"
    public let jsName = "KeepAwake"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "dontAllowSleep", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "allowSleep", returnType: CAPPluginReturnPromise)

    ]
    private let implementation = KeepAwake()

    @objc func dontAllowSleep(_ call: CAPPluginCall) {
        call.resolve([
            "isAllowedSleep": implementation.dontAllowSleep()
        ])
    }
    @objc func allowSleep(_ call: CAPPluginCall) {
         call.resolve([
            "isAllowedSleep": implementation.allowSleep()
        ])
    }
}
