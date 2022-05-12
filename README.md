[![CodeQL](https://github.com/SubZtep/depth/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/SubZtep/depth/actions/workflows/codeql-analysis.yml)

---

> ## :warning::feelsgood: <sub>This file is super out-of-date.</sub>
> :hospital: 『Buildless』 against 「Shiny Object Syndrome」 :trollface:
---

# depth 🧘‍♀️ ~~perception~~

[![Test & Build & Deploy](https://github.com/SubZtep/depth/actions/workflows/deploy.yml/badge.svg)](https://github.com/SubZtep/depth/actions/workflows/deploy.yml)

> Just another _code sandbox_. — **W.I.P.** — _2<sup>3</sup>_ :balloon:

A [Vue3](https://v3.vuejs.org/api/sfc-script-setup.html) app uses composition API over and above with a full-screen [Three.js](https://threejs.org/) background layer which gains some advantages of its reactivity. This is adequate for trying out concepts and seeing how they could fit into a busy environment.

## Packages ::

```MD
**[`web`](./web/src/pages) frontend** is part of the monorepo. + Some third-party open-source

|                                ~~Package~~ | ~~Description~~                                                                                                     |
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
```

---

###### :link: **`(^_^)` [~~README~~](README.md) `[o_o]` [COVER](docs/COVER.md) `(^.^)` [LINKS](docs/LINKS.md) `(".")` [SETUP](docs/SETUP.md) `($.$)`:gun:`(<>..<>)`**

---

###### :trollface:

_tbc._

## Setup

`yarn global add env-cmd`

## host

```ts
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ░░░░░░░░░░░░░░░░░░░░░░░░░░░   ░
▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒
▒▒▒▒▒▒   ▒▒▒▒▒   ▒▒▒▒▒    ▒   ▒   ▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒   ▒▒▒▒   ▒▒▒▒▒   ▒   ▒▒▒▒▒▒▒▒   ▒
▓▓   ▓   ▓▓▓  ▓▓▓   ▓▓▓   ▓▓  ▓▓   ▓▓   ▓▓   ▓▓▓▓▓▓   ▓▓   ▓▓   ▓▓▓   ▓▓   ▓▓   ▓   ▓
▓  ▓▓▓   ▓▓         ▓▓▓   ▓▓  ▓▓   ▓   ▓▓▓▓   ▓▓▓▓▓   ▓   ▓▓▓   ▓▓▓   ▓▓   ▓  ▓▓▓   ▓
▓  ▓▓▓   ▓▓  ▓▓▓▓▓▓▓▓▓▓   ▓▓  ▓▓   ▓▓   ▓▓   ▓▓▓▓▓▓   ▓   ▓▓▓   ▓▓▓   ▓▓   ▓  ▓▓▓   ▓
██   █   ████     ████    ██  ██   ████   █████  ██   ███   █    █    ██   ██   █   █
█████████████████████████████████████████████████████████████████████████████████████
```
