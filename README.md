# depth 🧘‍♀️ ~~perception~~

> Just another _code sandbox_.

There are **two full-screen layers** on each other.

### :milky_way::running:

```html
<!-- index.html roughly -->
<body>
    <div id="scene"><!-- 3D back -- Three.js canvas

      __̴ı̴̴̡̡̡ ̡͌l̡̡̡ ̡͌l̡*̡̡ ̴̡ı̴̴̡ ̡̡͡|̲̲̲͡͡͡ ̲▫̲͡ ̲̲̲͡͡π̲̲͡͡ ̲̲͡▫̲̲͡͡ ̲|̡̡̡ ̡ ̴̡ı̴̡̡ ̡͌l̡̡̡̡.___ -->

    </div>
    <div id="hud"><!-- 2D front -- Vue.js transparent div

         ┬┴┬┴┤･ω･)ﾉ├┬┴┬┴ -->

    </div>
</body>
```

## What’s this?

Use [Vue.js](https://github.com/vuejs/vue-next#readme) and [Three.js](https://github.com/mrdoob/three.js#readme) together on the same screen. To achieve this I found it quite handy to wrap local and 3rd-party packages into composition functions with additional reactive [VueUse](https://github.com/vueuse/vueuse#readme) helpers. In the ideal world, those packages would seamlessly integrate into a system.

Opt for my lucid developer experience :pensive: intentionally without following standardised patterns but avoid(ish) _spaghetti_. Just keep adding packages, moving files, rewriting definitions _~~recursive redundant~~_. This is certainly chaotic and confusing but it’s too early to talk about its serviceable form.

> aka :construction: **under construction**, don’t expect anything like  production level.

## Source code overview

It uses the most common packages for a front-end workflow. [VSCode](https://twitter.com/CODE) editor is highly recommended for [ESLint](https://eslint.org/blog/2019/01/future-typescript-eslint), [Prettier](https://prettier.io/playground/) and code auto-completion.

| Developer tools |
| :-: |
| **<sup>:dolphin:</sup>[JavaScript](https://2ality.com/) -—- <sup>:whale2:</sup>[TypeScript](https://www.typescriptlang.org/docs/handbook/utility-types.html) -—- <sup>:nut_and_bolt:</sup>[Vue3](https://v3.vuejs.org/guide/composition-api-introduction.html) -—- <sup>:sparkler:</sup>[VueUse](https://vueuse.org/shared/reactify/) -—- <sup>:satellite:</sup>[Vite](https://vitejs.dev/guide/features.html) -—- <sup>:japanese_goblin:</sup>[Jest](https://jestjs.io/) -—- <sup>:poodle:</sup>[Pug](https://www.npmjs.com/package/vite-plugin-pug) -—- <sup>:information_source:</sup>[TOML](https://taplo.tamasfe.dev/configuration/#writing-schemas) -—- <sup>[:confetti_ball:</sup>PostCSS](https://preset-env.cssdb.org/playground) -—- <sup>:art:</sup>[Windi CSS](https://windicss.org/features/)** |

In the current phase, no performance tweaks on the packages applied. Heavy calculations are in _WebAssembly_ code anyway, rather problematic to avoid memory overflow.

| 3rd-party packages |
| :-: |
| **<sup>:dancer:</sup>[MediaPipe Pose](https://google.github.io/mediapipe/solutions/pose.html#pose-landmark-model-blazepose-ghum-3d) -—- <sup>:vhs:</sup>[FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm-core#configuration) -—- <sup>:symbols:</sup>[Font Awesome 6 Pro](https://fontawesome.com/v6.0/icons) -—- <sup>:minidisc:</sup>[Supabase](https://supabase.io/docs/guides/database/introduction) -—- <sup>:video_game:</sup>[dat.GUI](https://github.com/dataarts/dat.gui#readme) -—- <sup>:movie_camera:</sup>[CameraControls](https://github.com/yomotsu/camera-controls#examples) -—- <sup>:musical_score:</sup>[Howler.js](https://github.com/goldfire/howler.js#examples) -—- <sup>:hourglass:</sup>[NProgress](https://ricostacruz.com/nprogress/) -—- <sup>:floppy_disk:</sup>[Pinia](https://pinia.esm.dev/introduction.html#comparison-with-vuex-3-x-4-x) -—- <sup>:chart_with_upwards_trend:</sup>[Stats.js](http://mrdoob.github.io/stats.js/) -—- <sup>:game_die:</sup>[Three.js](https://threejs.org/examples/#webgl_loader_md2) -—- <sup>:speech_balloon:</sup>[Vue Toastification](https://maronato.github.io/vue-toastification/) -—- <sup>:crystal_ball:</sup>[Modernizr](https://modernizr.com/download?setclasses)** |

Most of the packages and components are auto-imported. Also, there can be some unused functions _`(already legacy?)`_.

### Notable files & folders

#### :file_folder:[`SETTINGS.toml`](SETTINGS.toml)

Project router and other basic settings.

#### :file_folder:[`src/components/pages`](src/components/pages)

All main components here represent a route endpoint, described by the main settings file.

#### :file_folder:[`src/directives`](src/directives)

| Directive | Description |
| --------- | ----------- |
| [css-aspect-ratio](src/directives/css-aspect-ratio.ts) | Set CSS variable by its video tag’s loaded media dimensions. |
| [stop-propagation](src/directives/stop-propagation.ts) | Don’t propagate events behind the element. |
| [visible](src/directives/visible.ts) | Toggle element visibility. |

#### :file_folder:[`src/packages`](src/packages)

While this is not a _monorepo_ it is great to keep packages separated. Mostly wrappers for already existing 3rd-party modules.

| Folder | Description |
| ------ | ----------- |
| [datGUI](src/packages/datGUI/index.ts) | The menu. |
| [FFmpeg](src/packages/FFmpeg/index.ts) | For creating video screenshots and determinate PTS timestamps. |
| [Howler](src/packages/Howler/index.ts) | Play audio feedback. |
| [PoseAI](src/packages/PoseAI/index.ts) | Human pose detection from a video file. |
| [router](src/packages/router/index.ts) | Simple custom router. |
| [Stats](src/packages/Stats/index.ts) | Performance monitor. |
| [Supabase](src/packages/Supabase/index.ts) | Database connection. |
| [ThreeJS](src/packages/ThreeJS/index.ts) | 3D scene. |

#### :file_folder:[`src/stores`](src/stores)

[Pinia](https://pinia.esm.dev/) store definitions.


## Serve setup

The configuration is mostly about headers and secret settings. These require some extra steps.

1. Create an `.env` file.

    ```sh
    VITE_SUPABASE_URL="https://[HASH].supabase.co"
    VITE_SUPABASE_KEY="[LIKE_148_CHARACTERS_HASH]"
    ```

2. Configure access for [Font Awesome pro](https://fontawesome.com/v6.0/docs/web/setup/packages#_1-configure-access) _(for now)_.


3. Make it [cross-origin isolated](https://developer.chrome.com/blog/enabling-shared-array-buffer/) for _SharedArrayBuffer_. The _Vite_
dev server is already configured to automatically send all the necessary headers.

4. Run `npm install`.

5. Be sure the local `public/pose` folder is an up-to-date mirror to the [`@mediapipe/pose`](https://www.npmjs.com/package/@mediapipe/pose) package.

### Serve online

I believe there are many ways to run it, I simply do static hosting with PM2 and Nginx reverse proxy.

1. [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) for process management. A basic configuration file is in the project root.

    ```sh
    $ pm2 start ecosystem.config.js
    ```

2. [Nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) for reverse proxy.

    ```nginx
    server {
        # ...usual stuff...

        location ~ \.wasm$ {
            proxy_set_header Content-Type application/wasm;
        }

        location ~ \.dds$ {
            proxy_set_header Content-Type image/vnd-ms.dds;
        }

        location / {
            proxy_pass_header Content-Type;
            proxy_pass http://localhost:6669;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;

            add_header Cross-Origin-Opener-Policy same-origin;
            add_header Cross-Origin-Embedder-Policy require-corp;
        }
    }
    ```

    Just in case I also added the unknown mime types to `/etc/mime.types` and `/etc/nginx/mime.types` configs.

    ```ini
    application/wasm                wasm;
    image/vnd-ms.dds                dds;
    ```

    I’m going to reinstall my box anyway, at some point.

## Demo

Unstable deployment is [available](https://depth.demo.land/). :finnadie:

> The latest [Google Chrome&trade; Canary](https://www.google.com/intl/en_uk/chrome/canary/) recommended.

---

<sub>_superWIP_!noeta.\
unlicense4tmp?-:sweat_drops:</sub>
