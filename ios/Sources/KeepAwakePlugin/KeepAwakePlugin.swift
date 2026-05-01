import Foundation
import Capacitor

@objc(KeepAwakePlugin)
public class KeepAwakePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "KeepAwakePlugin"
    public let jsName = "KeepAwake"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "dontAllowSleep", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "allowSleep", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isKeepAwake", returnType: CAPPluginReturnPromise)
    ]
    private let implementation = KeepAwake()

    @objc func dontAllowSleep(_ call: CAPPluginCall) {
        implementation.dontAllowSleep { isAllowedSleep in
            call.resolve(["isAllowedSleep": isAllowedSleep])
        }
    }

    @objc func allowSleep(_ call: CAPPluginCall) {
        implementation.allowSleep { isAllowedSleep in
            call.resolve(["isAllowedSleep": isAllowedSleep])
        }
    }

    @objc func isKeepAwake(_ call: CAPPluginCall) {
        implementation.isKeepAwake { isKeepAwake in
            call.resolve(["isKeepAwake": isKeepAwake])
        }
    }
}
