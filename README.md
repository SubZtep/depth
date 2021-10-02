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

Use [Vue.js](https://github.com/vuejs/vue-next#readme) and [Three.js](https://github.com/mrdoob/three.js#readme) together on the same screen. To achive this I found quite handy to wrap local and 3rd-party packeges into composition functions with additional reactive [VueUse](https://github.com/vueuse/vueuse#readme) helpers.

Opt for my lucid developer experience :pensive: intentionally without following standardised patterns but avoid _spaghetti_. Just keep adding packages, moving files, rewriting definitions _~~recursive redundant~~_.

## Setup

TypeScript project with the usual configs. Although there are secrets that require some steps.

1. Create `.env` file.

    ```sh
    VITE_SUPABASE_URL="https://[HASH].supabase.co"
    VITE_SUPABASE_KEY="[LIKE_148_CHARACTERS_HASH]"
    ```

2. Configure access for [Font Awesome pro](https://fontawesome.com/v6.0/docs/web/setup/packages#_1-configure-access) _(for now)_.

3. Run `npm install`.

## Source Overview

- :file_folder: `/SETTINGS.toml`

  Project router and other basic settings.

- :file_folder: `/src/packages`

  While this is not a _monorepo_ it is great to keep packages separated. There are mostly extensions for already existing 3rd-party modules. Not perfectly decopuled but getting there.

  | path   | description |
  | ------ | ----------- |
  | [datGUI](./dat.GUI) | dat.GUI |
  | [FFmpeg](./FFmpeg) | FFmeg |
  | [PoseAI](./PoseAI) | MediaPipe BlazePose |
  | [router](./router) | custom router |
  | [Stats](./Stats) | Stats.JS |
  | [ThreeJS](./ThreeJS) | Three.JS |

## Page component examples

1. [Empty Template](src/components/pages/EmptyTemplate.vue)

---
_superWIP_!noeta.\
unlicense4temp-
