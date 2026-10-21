---
name: create-skill
description: Create and upload an OpenAI skill with the POST /skills API from either a directory's skill files or one zip archive. Use when a user asks to publish, register, or create a skill through the API and needs the request assembled, submitted, or its Skill response interpreted.
---

# Create Skill

Create one skill by sending its files to `POST /skills`.

## Prepare the upload

- Accept either an array of skill-file strings for a directory upload or one string representing a zip-file upload.
- Use one zip file when the caller supplies a packaged skill. Do not mix a zip file with directory-file entries.
- Preserve the skill's relative file layout when preparing a directory upload.
- Confirm that required skill contents are present before submitting. Do not invent missing file contents or local paths.
- Never print, persist, or place the API key in the request body. Read it from `OPENAI_API_KEY` or the caller's secret store.

## Send the request

Use the API base URL supplied by the caller, defaulting to `https://api.openai.com/v1`. Authenticate with a bearer token and send JSON:

```bash
curl https://api.openai.com/v1/skills \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "files": [
      "string"
    ]
  }'
```

For a zip upload, set `files` to the single string supplied for that archive rather than an array. Keep shell quoting valid and avoid logging credentials.

## Handle the result

On success, expect a Skill object with:

- `id`: unique skill identifier
- `created_at`: Unix timestamp in seconds
- `default_version`: default version identifier
- `description`: skill description
- `latest_version`: latest version identifier
- `name`: skill name
- `object`: literal `"skill"`

Verify that `object` is `"skill"` and that `id` is non-empty before reporting success. Return the identifier, name, default version, latest version, and creation time. Preserve the complete response when the caller needs it for automation.

If the API returns an error, report the HTTP status and API error message without claiming that the skill was created. Correct request shape, authentication, or file-content errors before retrying; do not retry validation or authentication failures unchanged.
