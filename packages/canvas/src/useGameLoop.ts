import type { Fn } from "@vueuse/core"
import { useIdle, whenever } from "@vueuse/core"
import { ref, watch } from "vue"
import { runInjectedFunctions } from "./useLoopInject"
import * as THREE from "three"

interface Options {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
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
  const clock = new THREE.Clock()
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
