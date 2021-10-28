# depth 🧘‍♀️ ~~perception~~

> Just another _code sandbox_. — :warning: **W.I.P.**

[![CodeQL](https://github.com/SubZtep/depth/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/SubZtep/depth/actions/workflows/codeql-analysis.yml)
:balloon: \
[![Test & Build & Deploy](https://github.com/SubZtep/depth/actions/workflows/deploy.yml/badge.svg)](https://github.com/SubZtep/depth/actions/workflows/deploy.yml)

Boilerplate that is built on top of [Vue3](https://v3.vuejs.org/api/sfc-script-setup.html) and [Three.js](https://threejs.org/), using reactive compositions.

## Monorepository

Various 3rd-parties included in isolated packages in the monorepo. The public **[w](./web#readme)eb frontend** is also part of it in a separate workspace.

### Packages

3rd-party packages are wrapped into the Vue plugin interface and mostly extended with handy functionality.

| Package                                    | Description                                                                                 |
| ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| **[a](packages/audio#readme)udio**         | Detect autoplay policy, play a single test sound (for now) with the Web Audio API.          |
| **[dat.gui](packages/dat.gui#readme)**     | GUI that handles most of the user inputs. Upgraded with reactivity and additional controls. |
| **[f](packages/ffmpeg#readme)fmpeg**       | Analise video keyframes and save screenshots in the browser.                                |
| **[m](packages/mediapipe#readme)ediapipe** | Human pose detection.                                                                       |
| **[m](packages/misc#readme)isc**           | Miscellaneous helper scripts and text formatters.                                           |
| **[s](packages/stats.js#readme)tats.js**   | Performance monitor for 3D and heavy calculations.                                          |
| **[s](packages/supabase#readme)upabase**   | Fast and easy to use database for some backend I/O.                                         |
| **[t](packages/three.js#readme)hree.js**   | Draw and show the 3D canvas with _game loop_ and camera controls.                           |

> Incomplete docs. :pencil2: If you’re interested please check the source code.

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

### Server hints

[PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) is for Node process management. A basic configuration file is in the project root.

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

###### :trollface:

_tbc._
