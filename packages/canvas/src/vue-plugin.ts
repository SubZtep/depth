import type { Plugin } from "vue"
import { MOUSE } from "three/src/constants"
import useThreeJs from "./useThreeJs"
import { initGameLoop, looping } from "./useGameLoop"
import CameraControls from "camera-controls"
import { Vector2 } from "three/src/math/Vector2"
import { Vector3 } from "three/src/math/Vector3"
import { Vector4 } from "three/src/math/Vector4"
import { Quaternion } from "three/src/math/Quaternion"
import { Matrix4 } from "three/src/math/Matrix4"
import { Spherical } from "three/src/math/Spherical"
import { Box3 } from "three/src/math/Box3"
import { Sphere } from "three/src/math/Sphere"
import { Raycaster } from "three/src/core/Raycaster"
import { DEG2RAD, clamp } from "three/src/math/MathUtils"
import useScene from "./useScene"

// interface Options {
//   /** Media query for html element that will hold the canvas */
//   sceneSelector?: string
// }

const CanvasPlugin: Plugin = function (app /*, { sceneSelector }: Options = {}*/) {
  CameraControls.install({
    THREE: {
      MOUSE,
      Vector2,
      Vector3,
      Vector4,
      Quaternion,
      Matrix4,
      Spherical,
      Box3,
      Sphere,
      Raycaster,
      MathUtils: {
        DEG2RAD,
        clamp,
      },
    },
  })

  app.config.globalProperties.$setCanvas = (canvas: HTMLCanvasElement) => {
    const { renderer, camera, cameraControls } = useThreeJs(canvas)
    const scene = useScene()
    app.config.globalProperties.$scene = scene
    initGameLoop({ renderer, scene, camera, cameraControls })
    app.config.globalProperties.$looping = looping
  }
}

// TODO: make typeing work here (vue issue? ts issue?)
// https://v3.vuejs.org/guide/typescript-support.html#augmenting-types-for-globalproperties
// declare module "@vue/runtime-core" {
//   export interface ComponentCustomProperties {
//     $scene: string
//   }
// }

export { CanvasPlugin }
