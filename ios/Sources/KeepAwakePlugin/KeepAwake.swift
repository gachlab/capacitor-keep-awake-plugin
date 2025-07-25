import Foundation
import UIKit

@objc public class KeepAwake: NSObject {
    @objc public func dontAllowSleep() -> Bool {
        DispatchQueue.main.sync {
            UIApplication.shared.isIdleTimerDisabled = true
        }
        return false
    }
    @objc public func allowSleep() -> Bool {
        DispatchQueue.main.sync {
            UIApplication.shared.isIdleTimerDisabled = false
        }
        return true
    }
}
