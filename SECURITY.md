# Security policy

## Data handling

CodeBuilder Pro stores project data only in the app sandbox. The JSON store uses
complete file protection and is excluded from device backups. The demo does not
send source code or identifiers over the network.

## Production integration checklist

- Use App Transport Security without arbitrary-load exceptions.
- Store refresh credentials in Keychain with a device-only accessibility class.
- Never store secrets in UserDefaults or source files.
- Apply least-privilege authorization on every project and artifact endpoint.
- Expire artifacts, redact logs, and keep environment variables out of diagnostics.
- Validate archive paths and never execute build output on the API host.
