"""Stream and retain a thinking-capable Ollama model response."""

from ollama import chat


messages = [{"role": "user", "content": "What is 17 × 23?"}]

stream = chat(
    model="qwen3",
    messages=messages,
    stream=True,
)

in_thinking = False
content = ""
thinking = ""

for chunk in stream:
    if chunk.message.thinking:
        if not in_thinking:
            in_thinking = True
            print("Thinking:\n", end="", flush=True)
        print(chunk.message.thinking, end="", flush=True)
        thinking += chunk.message.thinking
    elif chunk.message.content:
        if in_thinking:
            in_thinking = False
            print("\n\nAnswer:\n", end="", flush=True)
        print(chunk.message.content, end="", flush=True)
        content += chunk.message.content

print()

# Keep the complete assistant turn so ``messages`` can be reused in a follow-up
# chat() call without losing either the reasoning trace or the final answer.
messages.append(
    {
        "role": "assistant",
        "thinking": thinking,
        "content": content,
    }
)
