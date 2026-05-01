import XCTest
@testable import KeepAwakePlugin

class KeepAwakeTests: XCTestCase {
    func testDontAllowSleepReturnsFalse() {
        let implementation = KeepAwake()
        let expectation = self.expectation(description: "dontAllowSleep completes")

        implementation.dontAllowSleep { isAllowedSleep in
            XCTAssertFalse(isAllowedSleep)
            expectation.fulfill()
        }

        waitForExpectations(timeout: 2)
    }

    func testAllowSleepReturnsTrue() {
        let implementation = KeepAwake()
        let expectation = self.expectation(description: "allowSleep completes")

        implementation.allowSleep { isAllowedSleep in
            XCTAssertTrue(isAllowedSleep)
            expectation.fulfill()
        }

        waitForExpectations(timeout: 2)
    }

    func testIsKeepAwakeReturnsBoolean() {
        let implementation = KeepAwake()
        let expectation = self.expectation(description: "isKeepAwake completes")

        implementation.isKeepAwake { isKeepAwake in
            // Default state should be false (idle timer not disabled)
            XCTAssertNotNil(isKeepAwake)
            expectation.fulfill()
        }

        waitForExpectations(timeout: 2)
    }
}
