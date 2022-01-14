[![CodeQL](https://github.com/SubZtep/depth/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/SubZtep/depth/actions/workflows/codeql-analysis.yml)

---

> # :warning: This file is super out-of-date.

---

# depth 🧘‍♀️ ~~perception~~

[![Test & Build & Deploy](https://github.com/SubZtep/depth/actions/workflows/deploy.yml/badge.svg)](https://github.com/SubZtep/depth/actions/workflows/deploy.yml)

> Just another _code sandbox_. — **W.I.P.** — _2<sup>3</sup>_ :balloon:

A [Vue3](https://v3.vuejs.org/api/sfc-script-setup.html) app uses composition API over and above with a full-screen [Three.js](https://threejs.org/) background layer which gains some advantages of its reactivity. This is adequate for trying out concepts and seeing how they could fit into a busy environment.

## Packages

**The [`web`](./web#readme) frontend** is part of the monorepo. Some great third-party open-source packages are included and extended with handy features. Please follow the links below for extensive feature documentations.

|                                ~~Package~~ | Description                                                                                                         |
| -----------------------------------------: | :------------------------------------------------------------------------------------------------------------------ |
|                                    `audio` | Resolve [autoplay policy](https://developer.chrome.com/blog/autoplay/#webaudio), play sound with the Web Audio API. |
|         [`canvas`](packages/canvas#readme) | Three.js 3D canvas with _game loop_ and camera controls.                                                            |
| [`controller`](packages/controller#readme) | Player input / camera moves.                                                                                        |
|                                 `database` | Supabase wrapper and Pinia plugin.                                                                                  |
|                                      `hud` | dat.gui                                                                                                             |
|                                     `misc` | Miscellaneous helper scripts and text formatters.                                                                   |
|                                    `poser` | Mediapipe pose/face/hand detection.                                                                                 |
|                                    `stats` | Stats.js.                                                                                                           |
|           [`video`](packages/video#readme) | FFmpeg wasm.                                                                                                        |

## Setup

- [pnpm](https://pnpm.io/installation) monorepo

- **meta**:snail:sickrats

  - `SUPABASE_URL`
  - `SUPABASE_SECRET`
  - `NETLIFY_AUTH_TOKEN`
  - `NETLIFY_SITE_ID`

- build static assets

  [![Netlify Status](https://api.netlify.com/api/v1/badges/c2a49805-1f18-4c2a-868c-39bf5595ce26/deploy-status)](https://app.netlify.com/sites/wizardly-ramanujan-a933f2/deploys)

### Icons helps

Pictograms across the repository:

- :negative_squared_cross_mark: — No test but wildly used.
- :latin_cross: — No idea if it works properly or nor.

---

## Various links for fictive features

### 3D

- [ ] https://github.com/mattatz/THREE.Tree
- [ ] https://hofk.de/main/discourse.threejs/2019/LogarithmicShell/LogarithmicShell.html
- [ ] https://davideprati.com/demo/grass/

#### Grass

- [ ] https://discourse.threejs.org/t/grass-shader-confusion/2521/4
- [ ] https://stackoverflow.com/questions/49951177/three-js-get-local-position-of-vertex-in-shader-is-that-even-what-i-need
- [ ] https://davideprati.com/demo/grass/
- [ ] https://codepen.io/al-ro/pen/GRJzYQK
- [ ] https://aerotwist.com/tutorials/an-introduction-to-shaders-part-2/

### Optimizations

- [x] [Convert textures to WebP.](https://developers.google.com/speed/webp/docs/using)
- [x] [Optimize glTF and apply Draco mesh compression.](https://github.com/CesiumGS/gltf-pipeline) _(loader loaded)_
- [ ] https://github.com/zeux/meshoptimizer
- [ ] https://www.khronos.org/blog/google-and-binomial-contribute-basis-universal-texture-format-to-khronos-gltf-3d-transmission-open-standard

### 3D Object editor

- [x] https://github.com/donmccurdy/glTF-Transform

### Real-time code (shadeder) editor

- [x] https://github.com/egoist/vue-monaco

###### :trollface:

## Cover ヾ(´ 〇`)ﾉ

![shin](cover.png)

> ### :checkered_flag:`speed: 300k + 1 km/s` ~~in a vacuum~~

---

![](cover6.png)

> ### :shopping_cart: +—- +:shit:+:shit:~~+:shit:-:tongue:~~-~~+:pound:~~:shipit:

---

![](drop_fail.gif)

> ### :snail::robot:<sup>`VS`</sup>:balloon::ghost:

---

_tbc._
