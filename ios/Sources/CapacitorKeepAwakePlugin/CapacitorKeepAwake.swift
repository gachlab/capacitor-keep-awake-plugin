import Foundation

@objc public class CapacitorKeepAwake: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
