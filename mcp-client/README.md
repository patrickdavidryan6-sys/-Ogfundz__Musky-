# MCP client

A Python 3.12 project prepared for an MCP client using Anthropic and dotenv.

## Local setup

```sh
uv sync
uv run client.py
```

Create a `.env` file for credentials when the client implementation needs them.
Do not commit that file.

## Container deployment

The repository-level `Dockerfile` supplies Python and `uv`; it does not rely on
the deployment platform's Node image. Configure the deployment to use that
Dockerfile by removing custom build and start command overrides.
