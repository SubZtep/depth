import type { Fn } from "@vueuse/core"
import type { OrthographicCamera } from "three/src/cameras/OrthographicCamera"
import type { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera"
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"
import { useIdle, whenever } from "@vueuse/core"
import { Scene } from "three/src/scenes/Scene"
import { Clock } from "three/src/core/Clock"
import { ref, watchEffect } from "vue"
import { runInjectedFunctions } from "./useLoopInject"

interface Options {
  renderer: WebGLRenderer
  scene: Scene
  camera: PerspectiveCamera | OrthographicCamera
}

export const looping = ref(false)

const { idle } = useIdle(13_666) // ms

watchEffect(() => {
  document.querySelector("#scene")?.classList.toggle("paused", idle.value)
})

let gameLoop: Fn // TODO: check is singleton practicable

export function initGameLoop({ renderer, scene, camera }: Options) {
  const clock = new Clock()
  let deltaTime: number

  gameLoop = () => {
    deltaTime = clock.getDelta()
    runInjectedFunctions({ scene, renderer, deltaTime }, "camupdated")

    requestAnimationFrame(gameLoop)
    const shouldRenderNextFrame = !idle.value
    shouldRenderNextFrame && renderer.render(scene, camera)
    runInjectedFunctions({ scene, renderer, deltaTime }, "rendered")
  }
}

whenever(looping, () => gameLoop?.())
