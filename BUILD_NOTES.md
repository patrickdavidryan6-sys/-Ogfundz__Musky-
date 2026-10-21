# Build handoff

## Target

- Native SwiftUI application
- iPhone only
- iOS 17.0 or newer
- Xcode 16 project format
- Swift 5 language mode with strict concurrency checking enabled

## MVP acceptance criteria

- [x] Create projects from Swift, JavaScript, Python, or HTML templates.
- [x] Edit source locally with a monospaced iPhone editor.
- [x] Persist projects with complete file protection.
- [x] Display build progress, pipeline steps, diagnostics, and digest preview.
- [x] Clearly distinguish demonstration results from real compiler or antivirus output.
- [x] Include an app icon, privacy manifest, security notes, and unit tests.
- [x] Contain no hardcoded API credentials or third-party SDKs.

## Validation performed

- JSON asset manifests parsed successfully.
- App icon verified as opaque 1024 × 1024, 8-bit RGB PNG.
- All 26 Xcode project objects have resolved internal references.
- Swift source files passed delimiter, string, and comment-closure checks.
- No merge markers, empty files, or credential-like assignments were found.

Apple's Swift compiler, iOS SDK, and Xcode are not installed in the generation
environment. Open the project on macOS and run Product > Build (Command-B), then
Product > Test (Command-U) before distribution.

## Production blocker

DemoBuildService does not execute code or contact antivirus engines. Real builds
require a separately deployed, authenticated, sandboxed build service.
