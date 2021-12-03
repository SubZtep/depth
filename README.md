# depth 🧘‍♀️ ~~perception~~

[![CodeQL](https://github.com/SubZtep/depth/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/SubZtep/depth/actions/workflows/codeql-analysis.yml)
[![Test & Build & Deploy](https://github.com/SubZtep/depth/actions/workflows/deploy.yml/badge.svg)](https://github.com/SubZtep/depth/actions/workflows/deploy.yml)

> Just another _code sandbox_. — **W.I.P.** — _2<sup>3</sup>_ :balloon:

A [Vue3](https://v3.vuejs.org/api/sfc-script-setup.html) app uses composition API over and above with a full-screen [Three.js](https://threejs.org/) background layer which gains some advantages of its reactivity. This is adequate for trying out concepts and seeing how they could fit into a busy environment.

## Packages

The public [web](./web#readme) frontend is also part of the — _pnpm workspace_ — monorepo. Many third-party packages are included and extended with handy functionality.

> Incomplete docs. :pencil2: W.I.P.

|                            Package | Description                                                                                                                                 |
| ---------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------ |
|                            `audio` | Resolve [autoplay policy](https://developer.chrome.com/blog/autoplay/#webaudio), play a single test sound (for now) with the Web Audio API. |
| [`canvas`](packages/canvas#readme) | Draw and show the 3D canvas with _game loop_ and camera controls.                                                                           |
|                       `controller` | player input / camera moves.                                                                                                                |
|                         `database` | Supabase wrapper and Pinia plugin.                                                                                                          |
|                              `hud` | dat.gui                                                                                                                                     |
|                             `misc` | Miscellaneous helper scripts and text formatters.                                                                                           |
|                            `poser` | Mediapipe pose/face/hand detection.                                                                                                         |
|                            `stats` | Stats.js.                                                                                                                                   |
|                            `video` | FFmpeg wasm.                                                                                                                                |

## Setup

Create `web/.env` file with the following content:

```sh
VITE_SUPABASE_THROTTLE=250 # sync throttle
VITE_SUPABASE_URL="https://[HASH].supabase.co"
VITE_SUPABASE_KEY="[LIKE_148_CHARACTERS_HASH]"
```

FFmpeg uses _SharedArrayBuffer_ that requires [cross-origin isolated](https://developer.chrome.com/blog/enabling-shared-array-buffer/) header.

> A [Vite plugin](https://github.com/chaosprint/vite-plugin-cross-origin-isolation) is configured in the project for the local server.

### Shell commands

To build all the packages, [pnpm](https://pnpm.io/installation) is required.

```sh
# download dependencies
$ pnpm install

# build packages and web (always build after install)
$ NODE_ENV="development"
$ pnpm build

# run local server
$ pnpm dev
```

### Server hints

[PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) is for Node process management. Deploy action is generating a basic configuration file to the project root.

```sh
$ pm2 start ecosystem.config.js
```

[Nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) for reverse proxy. Sending _wasm_ header is required for the TensorFlow script.

```nginx
server {
  # ...usual configs...

  location ~ \.wasm$ {
    proxy_set_header Content-Type application/wasm;
  }

  location ~ \.dds$ {
    # not sure about this, probably overkill
    proxy_set_header Content-Type image/vnd-ms.dds;
  }

  location / {
    try_files $uri $uri/ /index.html; # for vue router
    proxy_pass_header Content-Type;
    proxy_pass http://localhost:6669; # port from PM2 config
    proxy_http_version 1.1; # up to you
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;

    add_header Cross-Origin-Opener-Policy same-origin;
    add_header Cross-Origin-Embedder-Policy require-corp;
  }
}
```

### 3d hints

1. Resize textures (with Gimp).

2. Convert to WebP \
   https://developers.google.com/speed/webp/docs/using

3. https://github.com/CesiumGS/gltf-pipeline \
   `$ gltf-pipeline -i scene.gltf -o scene.glb -t -d`

## Various links for fictive features

> #### May check

### Optimizations

- [ ] https://github.com/zeux/meshoptimizer
- [ ] https://www.khronos.org/blog/google-and-binomial-contribute-basis-universal-texture-format-to-khronos-gltf-3d-transmission-open-standard

### 3D Object editor

- [ ] https://github.com/donmccurdy/glTF-Transform

### Real-time code (shadeder) editor

- [ ] https://github.com/egoist/vue-monaco

###### :trollface:

_tbc._
