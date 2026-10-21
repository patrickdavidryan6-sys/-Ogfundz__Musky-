---
name: pod-lifecycle
description: Manage existing pods, including checking status; starting, stopping, restarting, or updating them; connecting through SSH, web terminal, or proxy; and troubleshooting pod connectivity or runtime issues. Use when the user asks about an existing pod rather than creating a new one.
---

# Pod Lifecycle

Use this skill when the user asks about existing pods or wants to start, stop, restart, update, inspect, or compare pods.

## Mental model

- Treat a pod as a live or stopped containerized machine. Use its Docker image and settings to understand what should run, and its current status to determine whether the host actually has it running and ready.
- Explain that starting a pod resumes compute from its saved configuration.
- Explain that stopping a pod stops compute but can still leave billable storage attached.
- Use a restart to restart the running container when an app, SSH daemon, Jupyter server, or proxy-exposed service is stuck or still initializing.
- Warn that updating an image, ports, or disk settings can restart or reset the pod and that files outside persistent paths such as `/workspace` may be lost during resets.

## Live-state rules

- Always call tools for live pod state. Do not answer from memory or previous conversations.
- Use exact `id` or `podId` values returned by tools. Never infer IDs from names, image names, or display labels.
- Call `listPods` once to retrieve both GPU and CPU pods. Do not call it twice with different filters unless the user explicitly asks for separate filtered views.
- Call `listPods` when the user asks to act on a pod without specifying which one.
- Proceed when exactly one pod matches. Ask the user to choose when multiple pods match.

## Status interpretation

- Prefer `readableStatus` when present.
- Treat `desiredStatus` as intended state, not proof of actual runtime state.
- Tell the user that `Starting (not ready yet)` can take a few minutes.
- Do not claim a pod is running when status is missing.

## State-changing actions

- Treat `startPod`, `stopPod`, `restartPod`, `updatePod`, and `batchUpdatePods` as approval-gated.
- Verify the resulting state with `getPodDetails` or `listPods` after a state-changing tool executes before claiming success.
- Do not automatically repeat the original action when verification disagrees.
- Use `batchUpdatePods` for multiple pod updates instead of calling `updatePod` repeatedly.

## Connecting to pods

- Use the web terminal for quick commands when the pod is running and the image supports terminal access.
- Use the HTTP proxy to expose web apps running inside the container. Ensure the app listens on the exposed port, usually on `0.0.0.0`, and direct the user to the Runpod proxy URL for that pod and port.
- Use TCP ports for raw services such as SSH. Use TCP port `22` for SSH only when SSH is configured inside the container.
- Recommend SSH key authentication by default. Explain that password SSH requires an SSH server, password authentication enabled, TCP port `22` exposed, and current public IP and port connection details.
- Re-check live connection details before suggesting deeper fixes when a known-good SSH or proxy setup suddenly fails on Community Cloud; public IP and forwarded port details can change after migration, stop/start, or host replacement.
- Check status and logs first and allow startup time when proxy, Jupyter, or SSH fails immediately after start. Suggest a user-approved restart when the container is running but the service is wedged.

## User-facing response

- Let the rich card carry pod details and keep accompanying text brief.
- Clearly state that an operation failed and include the tool error message when a tool fails.
- Clarify that stopping a pod is not termination and that stopped pods can still incur storage costs.
