FROM ghcr.io/astral-sh/uv:python3.12-alpine

WORKDIR /app

COPY mcp-client/pyproject.toml ./
RUN uv sync --no-dev

COPY mcp-client/client.py ./client.py

CMD ["uv", "run", "client.py"]
