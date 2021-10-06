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

**Experiment project.** Use [Vue.js](https://github.com/vuejs/vue-next#readme) and [Three.js](https://github.com/mrdoob/three.js#readme) together on the same screen. To achieve this I found it quite handy to wrap local and 3rd-party packages into composition functions with additional reactive [VueUse](https://github.com/vueuse/vueuse#readme) helpers.

Opt for my lucid developer experience :pensive: intentionally without following standardised patterns but avoid(ish) _spaghetti_. Just keep adding packages, moving files, rewriting definitions _~~recursive redundant~~_. This is certainly chaotic and confusing but it’s too early to talk about a serviceable form.

> aka :construction: **under construction**

## Source code overview

It uses the most common packages for a front-end workflow. [VSCode](https://twitter.com/CODE) editor is highly recommended for [ESLint](https://eslint.org/blog/2019/01/future-typescript-eslint), [Prettier](https://prettier.io/playground/) and code auto-completion.

| Developer tools |
| :-: |
| **[JavaScript](https://2ality.com/) — [TypeScript](https://www.typescriptlang.org/docs/handbook/utility-types.html) — [Vue3](https://v3.vuejs.org/guide/composition-api-introduction.html) — [VueUse](https://vueuse.org/shared/reactify/) — [Vite](https://vitejs.dev/guide/features.html) — [Jest](https://jestjs.io/) — [Pug](https://www.npmjs.com/package/vite-plugin-pug) — [TOML](https://taplo.tamasfe.dev/configuration/#writing-schemas) — [PostCSS](https://preset-env.cssdb.org/playground) — [Windi CSS](https://windicss.org/features/)** |

In the current phase, no performance tweaks on the packages applied. Heavy calculations are in _WebAssembly_ code anyway, rather problematic to avoid memory overflow.

| 3rd-party packages |
| :-: |
| **[MediaPipe Pose](https://google.github.io/mediapipe/solutions/pose.html#pose-landmark-model-blazepose-ghum-3d) — [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm-core#configuration) — [Font Awesome 6 Pro](https://fontawesome.com/v6.0/icons) — [Supabase](https://supabase.io/docs/guides/database/introduction) — [dat.GUI](https://github.com/dataarts/dat.gui#readme) — [CameraControls](https://github.com/yomotsu/camera-controls#examples) — [Howler.js](https://github.com/goldfire/howler.js#examples) — [NProgress](https://ricostacruz.com/nprogress/) — [Pinia](https://pinia.esm.dev/introduction.html#comparison-with-vuex-3-x-4-x) — [Stats.js](http://mrdoob.github.io/stats.js/) — [Three.js](https://threejs.org/examples/#webgl_loader_md2) — [Vue Toastification](https://maronato.github.io/vue-toastification/) — [Modernizr](https://modernizr.com/download?setclasses)** |

Most of the packages and components are auto-imported. Also, there can be some unused functions.\
_`already legacy?`_`(ノωヽ)`

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
| [datGUI](src/packages/datGUI/) | The menu. |
| [FFmpeg](src/packages/FFmpeg/) | For creating video screenshots and determinate PTS timestamps. |
| [Howler](src/packages/Howler/) | Play audio feedback. |
| [PoseAI](src/packages/PoseAI/) | Human pose detection from a video file. |
| [router](src/packages/router/) | Simple custom router. |
| [Stats](src/packages/Stats/) | Performance monitor. |
| [Supabase](src/packages/Supabase/) | Database connection. |
| [ThreeJS](src/packages/ThreeJS/) | 3D scene. |

#### :file_folder:[`src/stores`](src/stores)

[Pinia](https://pinia.esm.dev/) store definitions.


## Setup

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
        # ...my configs...

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

## Demo

Unstable deployment is [available](https://depth.demo.land/). :finnadie:

> The latest [Google Chrome&trade; Canary](https://www.google.com/intl/en_uk/chrome/canary/) recommended.

---

<sub>_superWIP_!noeta.\
unlicense4tmp?-:sweat_drops:</sub>
