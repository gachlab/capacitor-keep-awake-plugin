import Foundation
import UIKit

@objc public class KeepAwake: NSObject {
    @objc public func dontAllowSleep(completion: @escaping (Bool) -> Void) {
        DispatchQueue.main.async {
            UIApplication.shared.isIdleTimerDisabled = true
            completion(false)
        }
    }

    @objc public func allowSleep(completion: @escaping (Bool) -> Void) {
        DispatchQueue.main.async {
            UIApplication.shared.isIdleTimerDisabled = false
            completion(true)
        }
    }

    @objc public func isKeepAwake(completion: @escaping (Bool) -> Void) {
        DispatchQueue.main.async {
            completion(UIApplication.shared.isIdleTimerDisabled)
        }
    }
}
