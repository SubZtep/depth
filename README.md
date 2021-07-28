# depth 🧘‍♀️

~~perception~~

> Please use **Chrome™**

## FFmpeg commands

https://www.ffmpeg.org/ffmpeg-all.html

ffmpeg -skip_frame nokey -i yoga2.webm -vsync 0 -frame_pts true out%09d.png

ffmpeg -copyts -skip_frame nokey -i yoga2.webm -vsync 0 -r 1000 -f image2 -frame_pts 1 keyframe-%09d.jpeg

ffmpeg -copyts -skip_frame nokey -i yoga2.webm -vsync 0 -r 1000 -frame_pts 1 out%09d.png

this one is in milisecs:
ffmpeg -skip_frame nokey -i yoga2.webm -vsync 0 -r 1000 -frame_pts 1 %09d.png

(add pts column to keyframes?)

## Camera settings

https://github.com/yomotsu/camera-controls


## 3rd party packages

- [Camera control for three.js, supports smooth transitions](https://github.com/yomotsu/camera-controls)
- [Collection of essential Vue Composition Utilities](https://vueuse.org/)
- [WebAssembly backend to TensorFlow.js](https://github.com/tensorflow/tfjs/tree/master/tfjs-backend-wasm)
- [BlazePose TFJS (33 keypoints)](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_tfjs)
- chroma-js
- stats.js
- dat.gui
- three
- vue
- ...

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


#### vue qustions
1. using watchEffect worst than watch regarding to performance?
2. does it make sense to create an other script tag next to `script setup` to prefent too many shared objects to the template?
