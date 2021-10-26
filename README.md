# depth 🧘‍♀️ ~~perception~~

> Just another _code sandbox_.

[![CodeQL](https://github.com/SubZtep/depth/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/SubZtep/depth/actions/workflows/codeql-analysis.yml)
:balloon: \
[![Test & Build & Deploy](https://github.com/SubZtep/depth/actions/workflows/deploy.yml/badge.svg)](https://github.com/SubZtep/depth/actions/workflows/deploy.yml)

> :warning: **W.I.P.** — Publicity of the repository is only for demonstrating purposes.

## Monorepo

Built top on [Vue3](https://v3.vuejs.org/api/sfc-script-setup.html) Composition API and [VueUse](https://vueuse.org/functions.html) Reactive Composition Utilities.

### Packages

Mostly wrappers existing 3rd-party packages, extending functionality in places.

| Package                                     | Origin                                                                                          | Description                                          |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **[a](packages/audio#readme)udio**          | —                                                                                               | Make a single test sound with the Web Audio API.     |
| **[dat.gui](packages/dat.gui#readme)**      | [dat.GUI](https://github.com/dataarts/dat.gui)                                                  | The well-known tool handles most of the user inputs. |
| **[f](packages/ffmpeg#readme)fmpeg**        | [Wasm port of FFmpeg](https://ffmpegwasm.netlify.app/)                                          | Analise video keyframes and save screenshots.        |
| **[m](packages/mediapipe#readme)ediapipe**  | [Mediapipe Live ML](https://google.github.io/mediapipe/getting_started/javascript)              | Human pose detection.                                |
| **[s](packages/stats.js#readme)tats.js**    | [Stats.js](http://mrdoob.github.io/stats.js/)                                                   | Performance monitor for 3D and heavy calculations.   |
| **[s](packages/supabase#readme)upabase**    | [Supabase](https://supabase.io/)                                                                | Fast and easy to use database for some backend I/O.  |
| **[t](packages/three.js#readme)hree.js+cc** | [Three.js](https://threejs.org/), [camera-controls](https://github.com/yomotsu/camera-controls) | Draw and show the 3D canvas.                         |

> Incomplete docs. :pencil2: If you’re interested please check the source code.

### Frontend

The standalone **[w](./web#readme)eb** frontend folder is also part of the monorepo workspace. \
Including [Pinia](https://pinia.esm.dev/) store, built with [Vite](https://vitejs.dev/).

## Setup

Create `web/.env` file with the following content:

```sh
VITE_SUPABASE_URL="https://[HASH].supabase.co"
VITE_SUPABASE_KEY="[LIKE_148_CHARACTERS_HASH]"
```

FFmpeg uses _SharedArrayBuffer_ that requires [cross-origin isolated](https://developer.chrome.com/blog/enabling-shared-array-buffer/) header.

> A [Vite plugin](https://github.com/chaosprint/vite-plugin-cross-origin-isolation) is configured in the project for local server.

### Shell commands

To build all the packages, [pnpm](https://pnpm.io/installation) is required.

```sh
# download dependencies
$ pnpm install

# build packages and web
$ pnpm build

# run local server
$ pnpm dev
```

~~_//FIXME: wip_ Be sure the local `public/pose` folder is an up-to-date mirror to the [`@mediapipe/pose`](https://www.npmjs.com/package/@mediapipe/pose) package.~~

### Server hints

[PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) is for Node process management. A basic configuration file is in the project root.

```sh
$ pm2 start ecosystem.config.js
```

[Nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) for reverse proxy.

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

###### :trollface:

_tbc._
