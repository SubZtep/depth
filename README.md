# depth 🧘‍♀️ ~~perception~~

>  Just another _code sandbox_.

[![CodeQL](https://github.com/SubZtep/depth/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/SubZtep/depth/actions/workflows/codeql-analysis.yml)
:balloon: \
[![Test & Build & Deploy](https://github.com/SubZtep/depth/actions/workflows/deploy.yml/badge.svg)](https://github.com/SubZtep/depth/actions/workflows/deploy.yml)

Custom helpers and structure that built top on:
- [Vue3](https://v3.vuejs.org/api/sfc-script-setup.html) Composition API,
- [VueUse](https://vueuse.org/functions.html) Reactive Composition Utilities,
- [Pinia](https://pinia.esm.dev/) Store, the closest word to piña that is a valid package name,
- [Vite](https://vitejs.dev/) Next Generation Frontend Tooling.

## Monorepo packages

These are mostly wrappers of [Vue.js flavour](https://v3.vuejs.org/guide/plugins.html) around existing 3rd-party packages, extending functionality in places. <sub>_WIP!_</sub>

| Package | Origin | Description |
| --- | --- | --- |
| **[a](packages/audio#readme)udio** | — | Make a single test sound with the Web Audio API. |
| **[dat.gui](packages/dat.gui#readme)** | [dat.GUI](https://github.com/dataarts/dat.gui) | The well-known tool handles most of the user inputs. |
| **[f](packages/ffmpeg#readme)fmpeg** | [Wasm port of FFmpeg](https://ffmpegwasm.netlify.app/) | Analise video keyframes and save screenshots. |
| **[m](packages/mediapipe#readme)ediapipe** | [Mediapipe Live ML](https://google.github.io/mediapipe/getting_started/javascript) | Human pose detection. |
| **[s](packages/stats.js#readme)tats.js** | [Stats.js](http://mrdoob.github.io/stats.js/) | Performance monitor for 3D and heavy calculations. |
| **[s](packages/supabase#readme)upabase** | [Supabase](https://supabase.io/) | Fast and easy to use database for some backend I/O. |——
| **[t](packages/three.js#readme)hree.js** | [Three.js](https://threejs.org/) | Draw to the 3D canvas, _WebGL_ for dummies%). |
| **[w](./packages/web#readme)eb** | — | The frontend, master of these puppets. |

> Since that is still under development all the docs are handwritten without the need for completeness. :pencil2: _If you’re interested check the source code, it’s up-to-date._

---

```js
                                                   ..
                                                .-'  \
                                              .':...::L
                                            .':...::::|
                                           /:::.:=:::::L
                                         .':::...:./:::|
                                        /:::..::::/.\:::L
                                       /:::.:....':::L::|
                                    .-'::::...:/d8888b::|
                               ..dMP=:::::...:'d88888Nb.|
                         ..odMMMP.:.'::=:...'d888888888::L
                       .dMMMMMP..: .:':::.d888888888888I:|
                     .dMMMMMM@b: ` ...:::d8888888888888::|
                    dMMMMMMMMNM.. ..:::d88888888888888P|||
                   dMMMMMMMMMMMboooodP" `?888888888P'``||
                 .dMMMMMMMMMMMMMMMP'        `"""''  /  |`
                 dMMMMMMMMMMMMMMP'                .'   |
  .mggm..        MMMMMMMMMMMMMP'                .'     |
.dMMMMMMMNNb,    ?MMMMMMMMMMMM|                 |:.. ` |
.MMMMMMMMMMMMMb, .MMMMMMMMMMM(                  `-::   |
.MMMMMMMMMMMMMMMMmdMMMMMMMMMMM.                   \::  |
 ?MMMMMMMMMMMMMMMMMMMMMMMMMMMMb                    |:..|
 `?MMMMMMMMMMMMMMMMMMMMMMMMMMMMbo.,               .MMMMb.
  `MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMb,             dMMMMM:
   ?MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMb           .MMMMMMb
    ?MMMMMMb ?MMMMMMMMMMMMMMMMMMMMMMMMb          .MMMMMMM
     ?MMMMMM  `?MMMMMMMMMMMMMMMMMMMMMMP          dMMMMMMM,
     `?MMMMM     `?WMMMMMMMMMMMMMMMMMMbo,       .MMMMMMMM|
      `MMMMM.         `?MMMMMMMMMMMMMMMMMbo,.   .MMMMMMMMb
       ?MMMMb            `?MMMMMMMMMMMMMMMMMMb, dMMMMMMMMM
       :::::|               `?MMMMMMMMMMMMMMMMMMNMMMMMMMMM
       ::::.|                 `?MMMMMMMMMMMMMMMMMMMMMMMNMN.
    .-:::::.\                    `?MMMMMMMMMMMMMMMMMMMMMHM`
 _.:::::::   |                      `?MMMMMMMMMMMMMMMMMMMM
(_.__________/                         `?MMMM#MMMMMMMMMMMP
                                            `"?MMMMMMMMP'
                                                 `?MMMP
```

## Setup

> tl;dr :nerd_face: See the entire deploy workflow in the [GitHub Action](.github/workflows/deploy.yml) markup.

- [ ] Create an `.env` file.

    ```sh
    VITE_SUPABASE_URL="https://[HASH].supabase.co"
    VITE_SUPABASE_KEY="[LIKE_148_CHARACTERS_HASH]"
    ```

- [x] Make it [cross-origin isolated](https://developer.chrome.com/blog/enabling-shared-array-buffer/) for FFmpeg _SharedArrayBuffer_. \
    A Vite plugin is configured in the project, let's hope it will work for a while.

- [ ] Run `$ pnpm install`.

    | No pnpm? No problem! | :bulb: Tip of the day!  |
    | --: | --- |
    | ![](https://pnpm.io/assets/images/pnpm-standard-79c9dbb2e99b8525ae55174580061e1b.svg)| [Install pnpm](https://pnpm.io/installation) and the [recommended](.vscode/extensions.json) VSCode extensions to enjoy monorepo [workspace](./packages)! |



- [ ] ~~Be sure the local `public/pose` folder is an up-to-date mirror to the [`@mediapipe/pose`](https://www.npmjs.com/package/@mediapipe/pose) package. _//FIXME: wip_~~

### Server hints

I believe there are many ways to run it, this is how it runs on my teeny box

- [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) is for Node process management. A basic configuration file is in the project root.

    ```sh
    $ pm2 start ecosystem.config.js
    ```

- [Nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) for reverse proxy.

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
            proxy_pass http://localhost:6669; # port in PM2 config
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
