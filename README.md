# CodeBuilder Pro for iPhone

CodeBuilder Pro is now a native SwiftUI iPhone project. This initial scaffold
contains one app screen, an asset catalog, a privacy manifest, and a unit-test
target with no third-party dependencies.

## Requirements

- macOS with Xcode 16 or newer
- iOS 17 or newer
- An Apple Developer team for installation on a physical iPhone

## Run on iPhone

1. Open `CodeBuilderPro.xcodeproj` in Xcode.
2. Select the `CodeBuilderPro` target.
3. Open **Signing & Capabilities** and choose your Apple Developer team.
4. Replace `com.example.CodeBuilderPro` with a bundle identifier you control.
5. Connect and select your iPhone, then press **Command-R**.

Run **Product > Build** (`Command-B`) and **Product > Test** (`Command-U`) before
merging release changes.

## Current scope

The app currently shows a minimal launch screen only. It does not compile code,
upload source, contact external services, or collect analytics.

## Next build step

Add `CodeBuilderPro/Models/Project.swift` as the first domain model. Keep it a
small `Codable`, `Identifiable`, and `Sendable` value type containing a project
name, language, source text, and modification date. That creates a testable base
for local project creation and persistence without introducing networking.
