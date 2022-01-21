import type { Fn } from "@vueuse/core"
import type { OrthographicCamera } from "three/src/cameras/OrthographicCamera"
import type { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera"
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"
import { useIdle, whenever } from "@vueuse/core"
import { Scene } from "three/src/scenes/Scene"
import { Clock } from "three/src/core/Clock"
import { ref, watch } from "vue"
import { runInjectedFunctions } from "./useLoopInject"

interface Options {
  renderer: WebGLRenderer
  scene: Scene
  camera: PerspectiveCamera | OrthographicCamera
}

export const looping = ref(false)

watch(
  looping,
  v => {
    document.querySelector("#scene")?.classList.toggle("paused", !v)
  },
  { immediate: true }
)

let gameLoop: Fn // TODO: check is singleton practicable

export function initGameLoop({ renderer, scene, camera }: Options) {
  const clock = new Clock()
  let deltaTime: number

  gameLoop = () => {
    deltaTime = clock.getDelta()
    runInjectedFunctions({ scene, renderer, clock, deltaTime, camera }, "camupdated")

    if (looping.value) {
      requestAnimationFrame(gameLoop)
    }

    renderer.render(scene, camera)
    runInjectedFunctions({ scene, renderer, clock, deltaTime, camera }, "rendered")
  }
}

whenever(looping, () => gameLoop?.())

const { idle } = useIdle(13_666) // ms
watch(idle, v => (looping.value = !v))
