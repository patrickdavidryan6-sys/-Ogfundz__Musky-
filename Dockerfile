FROM denoland/deno:2.4.5

WORKDIR /app

# Cache remote modules separately so application-only changes do not refetch them.
COPY deno.json deno.lock main.ts ./
RUN deno cache --lock=deno.lock main.ts

COPY index.html ./

ENV PORT=8000
EXPOSE 8000

USER deno

CMD ["task", "start"]
