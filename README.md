# CodeBuilder Pro for iPhone

A native SwiftUI MVP for organizing small coding projects, editing source files,
and reviewing build reports on iPhone.

## Included

- Project dashboard with recent activity and build status
- Project creation with Swift, JavaScript, Python, and HTML templates
- Monospaced source editor with build progress and diagnostics
- Protected local persistence with no analytics or embedded credentials

## Run on iPhone

1. Open CodeBuilderPro.xcodeproj in Xcode 16 or newer.
2. Select the CodeBuilderPro target, then open Signing & Capabilities.
3. Choose your Apple Developer team and replace the placeholder bundle ID if needed.
4. Connect your iPhone, select it, and press Command-R.

The project targets iOS 17 or newer.

## Build-service boundary

DemoBuildService intentionally does not compile arbitrary code. General-purpose
compilation should run in an isolated backend. Replace the service through the
BuildServicing protocol when a backend is available.

Secure backend requirements:

- Authenticate requests and authorize project access server-side.
- Run builds in disposable, network-restricted containers with strict limits.
- Never embed API keys in the app; store short-lived tokens in Keychain.
- Verify artifacts with SHA-256 digests and code signatures where applicable.
- Treat antivirus results as one signal, not proof that an artifact is safe.

Add COMPILE_ERROR in the editor to preview a failed demo build.
