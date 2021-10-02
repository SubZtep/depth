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

### :file_folder: `/SETTINGS.toml`

Project router and other basic settings.

### :file_folder: `/src/packages`

While this is not a _monorepo_ it is great to keep packages separated. There are mostly extensions for already existing 3rd-party modules. Not perfectly decopuled but getting there.

| path   | description |
| ------ | ----------- |
| [datGUI](./dat.GUI) | dat.GUI |
| [FFmpeg](./FFmpeg) | FFmeg |
| [PoseAI](./PoseAI) | MediaPipe BlazePose |
| [router](./router) | custom router |
| [Stats](./Stats) | Stats.JS |
| [ThreeJS](./ThreeJS) | Three.JS |


### :file_folder: `/scripts`

The simpliest way to execute a local script is that install the [**`zx`**](https://github.com/google/zx) package globally:

```sh
$ npm i -g zx
```

It's possible that if you don't want to use the `zx` bin, you need to add execute mode to the script files.

### Available scripts

- `scripts/public_videos_to_constant.mjs`

  Scan and update.

- `scripts/induct_sounds.mjs`

  Scan and update.


## Page component examples

1. [Empty Template](src/components/pages/EmptyTemplate.vue)
1. [Video Display Locals](src/components/pages/VideoDisplayLocals.vue)

## 3rd party packages

- [ ] https://github.com/postcss/postcss-scss

- [x] [**Camera Controls** for Three.js — smooth transitions](https://github.com/yomotsu/camera-controls)
- [x] [**VueUse** — reactive composition utilities](https://vueuse.org/)
- [x] [**MediaPipe** pose detection](https://google.github.io/mediapipe/solutions/pose.html)
- [x] [**Font Awesome** _pro_ icons](https://fontawesome.com/v6.0/icons)
- [x] stats.js
- [x] dat.gui
- [x] three
- [x] vue
- [ ] ...

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

---
_superWIP_!noeta.\
unlicense4temp-
