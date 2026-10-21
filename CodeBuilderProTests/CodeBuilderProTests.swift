import XCTest
@testable import CodeBuilderPro

final class CodeBuilderProTests: XCTestCase {
    func testDisplayName() {
        XCTAssertEqual(AppMetadata.displayName, "CodeBuilder Pro")
    }
}
