# Security policy

## Current data handling

The scaffold does not collect analytics, contact a network service, or persist
user data. The privacy manifest declares no tracking and no collected data.

## Production integration checklist

- Use App Transport Security without arbitrary-load exceptions.
- Store refresh credentials in Keychain with a device-only accessibility class.
- Never store secrets in `UserDefaults`, source files, or build logs.
- Apply least-privilege authorization to every project and artifact endpoint.
- Run untrusted builds in disposable, network-restricted containers with strict
  CPU, memory, storage, and time limits.
- Expire artifacts, redact logs, and keep environment variables out of
  diagnostics.
- Validate archive paths and never execute build output on the API host.
