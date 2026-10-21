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
upload source, contact external services, or collect analytics. The repository
also contains a deployable Cloudflare Worker backend under `worker/`. It uses D1
for durable workflow state and audit records, and a private R2 binding for source
assets.

## Backend setup

1. Create the D1 database and private R2 bucket named in `worker/wrangler.toml`.
2. Replace the D1 database ID and apply `worker/migrations/0001_durable_workflows.sql`.
3. Set `API_TOKEN` and `WEBHOOK_SECRET` with `wrangler secret put`.
4. From `worker/`, run `npm install`, `npm run check`, and `npm test`.

Clients create jobs with an authorized multipart `POST /v1/jobs`, including a
`source` file and an `Idempotency-Key`. Source downloads require the same bearer
token. Workflow callbacks use `POST /v1/webhooks/workflow` and an
`X-Webhook-Signature: sha256=<hex digest>` HMAC-SHA256 signature calculated over
the exact request body.

## Next build step

Add `CodeBuilderPro/Models/Project.swift` as the first domain model. Keep it a
small `Codable`, `Identifiable`, and `Sendable` value type containing a project
name, language, source text, and modification date. That creates a testable base
for local project creation and persistence without introducing networking.
