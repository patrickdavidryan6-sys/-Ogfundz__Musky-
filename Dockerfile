FROM denoland/deno:2.5.6

WORKDIR /app

COPY deno.json deno.lock main.ts ./
RUN deno cache --lock=deno.lock main.ts

COPY index.html ./

ENV PORT=8000
EXPOSE 8000

USER deno
CMD ["task", "start"]
