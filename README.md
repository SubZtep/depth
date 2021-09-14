# depth 🧘‍♀️ ~~perception~~

Just another _code sandbox_. If this term exists at all — there is too much code in it to call a _boilerplate_, the _playground_ is more appropriate. So what?

Back in the day, I was amazed by browser based machine learning solutions, especially the one that was able to tell the coordinate points of human joints from videos. Even though it was 2D only, calculating the rotations and trying out on rigged 3D models made some fun moments, certainly without the hoped-for precise Z-axis positions. There are glitches in the Matrix but if Skynet would use that for motion capturing nobody would eat that reality.

When I heard about the new deeply learned [TensorFlow](https://blog.tensorflow.org/2021/05/high-fidelity-pose-tracking-with-mediapipe-blazepose-and-tfjs.html) models I surely tried out. Faster, smoother, and finally not having to combine vectors like an animal, my phone can make many more attempts to accomplish the goal - whatever is that - the only thing I need to do is let it do it.

Connecting webcam with the API, cache it, normalise it, visualise it, etcetera. All these tasks are quite simple to make in a browser with JavaScript. Controlling a **Three.js** canvas and smooth out the data flow with open source packages is feasible thanks to the community. Hard to imagine a better workflow than **Vue.js** with its recent updates and reactive composables. All I want here is to make it very comfortable and quick to use. I don't even bother Babel, if my sessionless **Chrome™ Canary** can run it it's just good enough, yolo.

## What's this?

Long story short I try to organise packages without intentionally following standardised patterns and avoid _spaghetti_. Just keep moving files, rewriting definitions, recursive redundant.

# 3D

# 2D

## Packages

While this is not a _monorepo_ it is great to keep packages separated. There are mostly extensions for already existing 3rd-party modules. Not perfectly decopuled but getting there.

| path   | description |
| ------ | ----------- |
| [datGUI](./dat.GUI) | dat.GUI |
| [FFmpeg](./FFmpeg) | FFmeg |
| [PoseAI](./PoseAI) | MediaPipe BlazePose |
| [router](./router) | custom router |
| [Stats](./Stats) | Stats.JS |
| [ThreeJS](./ThreeJS) | Three.JS |


## Shell Scripts

To execute a local script install the excellent bash wrapper [zx](https://github.com/google/zx) package globally:

```sh
$ npm i -g zx
```

## Simple Examples

1. [Empty Template](src/components/pages/EmptyTemplate.vue)
1. [Video Display Locals](src/components/pages/VideoDisplayLocals.vue)

## 3rd party packages

- [ ] https://github.com/postcss/postcss-scss

- [x] [**Camera Controls** for Three.js — smooth transitions](https://github.com/yomotsu/camera-controls)
- [x] [**VueUse** — reactive composition utilities](https://vueuse.org/)
- [x] [**MediaPipe** pose detection](https://google.github.io/mediapipe/solutions/pose.html)
- [x] [**Font Awesome** _pro_ icons](https://fontawesome.com/v6.0/icons)
- [x] chroma-js
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
