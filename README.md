# depth 🧘‍♀️ ~~perception~~

[![CodeQL](https://github.com/SubZtep/depth/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/SubZtep/depth/actions/workflows/codeql-analysis.yml)
[![Test & Build & Deploy](https://github.com/SubZtep/depth/actions/workflows/deploy.yml/badge.svg)](https://github.com/SubZtep/depth/actions/workflows/deploy.yml)

> Just another _code sandbox_. — **W.I.P.** — _2<sup>3</sup>_ :balloon:

A [Vue3](https://v3.vuejs.org/api/sfc-script-setup.html) app uses composition API over and above with a full-screen [Three.js](https://threejs.org/) background layer which gains some advantages of its reactivity. This is adequate for trying out concepts and seeing how they could fit into a busy environment.

## Packages

The [web](./web#readme) frontend is part of the — _pnpm workspace_ — monorepo. Some great third-party open-source packages are included and extended with handy features.

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

1. Get [pnpm](https://pnpm.io/installation).

2. Create `web/.env` file with the following content for multi(**meta**)verse:

   ```sh
   VITE_SUPABASE_THROTTLE=250 # sync throttle
   VITE_SUPABASE_URL="https://[HASH].supabase.co"
   VITE_SUPABASE_KEY="[LIKE_148_CHARACTERS_HASH]"
   ```

3. FFmpeg uses _SharedArrayBuffer_ that requires [cross-origin isolated](https://developer.chrome.com/blog/enabling-shared-array-buffer/) header.

   > A [Vite plugin](https://github.com/chaosprint/vite-plugin-cross-origin-isolation) is configured in the project for the local server.

4. Build.

   ```sh
   $ pnpm install
   $ pnpm build
   # check github action that deploy the demo page.
   ```
   Static files go to `web/dist`. Also, the _GitHub Action_ deploys the demo page automatically.

5. CI generates [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) config to the project root:

   ```sh
   $ pm2 start ecosystem.config.js
   ```

6. Setup [Nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) for reverse proxy and send _wasm_ header.


    ```nginx
    server {
      # ...usual configs...

      location ~ \.wasm$ {
        proxy_set_header Content-Type application/wasm;
      }

      location / {
        try_files $uri $uri/ /index.html; # for vue router
        proxy_pass_header Content-Type;
        proxy_pass http://localhost:6669; # port from PM2 config
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;

        add_header Cross-Origin-Opener-Policy same-origin;
        add_header Cross-Origin-Embedder-Policy require-corp;
      }
    }
    ```

---

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
