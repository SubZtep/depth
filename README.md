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

Use [Vue.js](https://github.com/vuejs/vue-next#readme) and [Three.js](https://github.com/mrdoob/three.js#readme) together on the same screen. To achieve this I found it quite handy to wrap local and 3rd-party packages into composition functions with additional reactive [VueUse](https://github.com/vueuse/vueuse#readme) helpers.

Opt for my lucid developer experience :pensive: intentionally without following standardised patterns but avoid _spaghetti_. Just keep adding packages, moving files, rewriting definitions _~~recursive redundant~~_, aka :construction: **under construction**.

## Setup

TypeScript project with the usual configs. Although there are secrets that require some steps.

1. Create an `.env` file.

    ```sh
    VITE_SUPABASE_URL="https://[HASH].supabase.co"
    VITE_SUPABASE_KEY="[LIKE_148_CHARACTERS_HASH]"
    ```

2. Configure access for [Font Awesome pro](https://fontawesome.com/v6.0/docs/web/setup/packages#_1-configure-access) _(for now)_.

3. Run `npm install`.

## Source code overview

Most of the packages and components are auto-imported. Also there could be some unused functions.

### Notable files & folders

#### :file_folder:[`SETTINGS.toml`](SETTINGS.toml)

Project router and other basic settings.

#### :file_folder:[`src/components/pages`](src/components/pages)

Main page components referred by the project settings.

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
| [datGUI](src/packages/datGUI/index.ts) | dat.GUI |
| [FFmpeg](src/packages/FFmpeg/index.ts) | FFmpeg |
| [Howler](src/packages/Howler/index.ts) | Howler audio library |
| [PoseAI](src/packages/PoseAI/index.ts) | MediaPipe pose detection |
| [router](src/packages/router/index.ts) | Custom router |
| [Stats](src/packages/Stats/index.ts) | Stats.JS |
| [Supabase](src/packages/Supabase/index.ts) | Supabase database connection |
| [ThreeJS](src/packages/ThreeJS/index.ts) | Three.JS |

#### :file_folder:[`src/stores`](src/stores)

[Pinia](https://pinia.esm.dev/) store definitions.

---
_superWIP_!noeta.\
unlicense4tmp?-
