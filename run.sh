#version="v1.46.1" # fails same error.
#version="v1.45.5" # OOME
version="v1.43.6" # Working version

curl -fsSL https://deno.land/install.sh | sh -s ${version}

deno run \
  --v8-flags=--max-old-space-size=8192 \
  --allow-read --allow-write --allow-net \
  src/Process.ts