# Luma Color Studio

Luma is a focused, dependency-free browser color studio for images and videos. It offers live brightness, contrast, and saturation previews on a canvas, one-click PNG exports, and private in-browser MP4 rendering powered by FFmpeg WebAssembly.

## Run locally

```sh
deno task dev
```

Then visit `http://localhost:8000` and choose or drag an image or video into the studio. FFmpeg is loaded from the CDN only when a video export is requested.

## Deploy

The included `Dockerfile` runs the Deno server in a small production image and
listens on the platform-provided `PORT` (defaulting to `8000`). Configure the
service to build from the Dockerfile and leave its build and start command
overrides empty; command overrides cause some deployment platforms to ignore
the Dockerfile and incorrectly attempt to install the unrelated Python example.

The container exposes `GET /health` for readiness and liveness checks.
