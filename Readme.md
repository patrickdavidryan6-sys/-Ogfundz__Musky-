# Deno Examples: Hello, World!

Simply serving a single file over HTTP

## Get your own copy to explore

You can clone this example into a repo of your own, and use it to set up a new application hosted on Deno Deploy in a few clicks

[![Deploy on Deno](https://deno.com/button)](https://app.deno.com/new?clone=https://github.com/denoland/examples&path=hello-world)

## Container deployment

The included `Dockerfile` runs the site with Deno and listens on the platform's
`PORT` environment variable (or port `8000` by default).

Configure the deployment to build from the `Dockerfile`. Remove any custom
build or start commands from the hosting dashboard; those commands override the
Dockerfile and may cause the platform to incorrectly choose a Node or Python
build image.
