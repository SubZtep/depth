import type { Plugin } from "vue"
import useThreeJs from "./useThreeJs"
import { initGameLoop, looping } from "./useGameLoop"
import useScene from "./useScene"

export const CanvasPlugin: Plugin = function (app) {
  app.config.globalProperties.$setCanvas = (canvas: HTMLCanvasElement) => {
    const { renderer, camera } = useThreeJs(canvas)
    const scene = useScene()
    app.config.globalProperties.$scene = scene
    app.config.globalProperties.$initCameraControls(camera, canvas)

    initGameLoop({ renderer, scene, camera })
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
