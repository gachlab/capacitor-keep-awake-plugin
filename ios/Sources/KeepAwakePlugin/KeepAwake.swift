import Foundation

@objc public class KeepAwake: NSObject {
    @objc public func dontAllowSleep() -> String {
        print("Sleep Disabled",terminator: "\n")
        UIApplication.shared.isIdleTimerDisabled = true
        return false
    }
    @objc public func allowSleep() -> String {
        print("Sleep Enabled",terminator: "\n")
        UIApplication.shared.isIdleTimerDisabled = false
        return true
    }
}
