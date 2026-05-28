// SPDX-License-Identifier: MIT
// Copyright (c) 2026 gachlab
//
// End-to-end test for the keep-awake plugin on the iOS Simulator.
//
// The host app auto-runs dontAllowSleep → isKeepAwake → allowSleep → isKeepAwake
// on load. This XCUITest taps isKeepAwake again and asserts the WebView shows a
// concrete value ("true"/"false"), proving the JS↔native bridge round-trip
// works on iOS. The wakeLockReleased event is web-only and not asserted here.

import XCTest

final class KeepAwakeE2ETests: XCTestCase {

    private let app = XCUIApplication()

    override func setUpWithError() throws {
        continueAfterFailure = false
        app.launch()
        let webView = app.webViews.firstMatch
        XCTAssert(webView.waitForExistence(timeout: 20), "WebView did not load in 20 s")
    }

    override func tearDownWithError() throws {
        app.terminate()
    }

    func testIsKeepAwakeRoundTrip() throws {
        let webView = app.webViews.firstMatch
        let btn = webView.buttons["isKeepAwake"]
        XCTAssert(btn.waitForExistence(timeout: 30), "isKeepAwake button not found in WebView")
        btn.tap()

        // The keep-awake-state span starts at "unknown" and flips to "true"/"false"
        // once the native isKeepAwake() call resolves through the bridge.
        let resolved = NSPredicate(format: "label == 'true' OR label == 'false'")
        let stateEl = webView.staticTexts.matching(resolved).firstMatch
        XCTAssert(
            stateEl.waitForExistence(timeout: 10),
            "isKeepAwake() round-trip did not resolve to a concrete state"
        )
    }
}
