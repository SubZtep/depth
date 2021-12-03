import { Fn, useIdle, whenever } from "@vueuse/core"
import CameraControls from "camera-controls"
import { Camera } from "three/src/cameras/Camera"
import { Clock } from "three/src/core/Clock"
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"
import { Scene } from "three/src/scenes/Scene"
import { ref, watchEffect } from "vue"
import { runInjectedFunctions } from "./useLoopInject"
import { useStats } from "@depth/stats"

interface Options {
  renderer: WebGLRenderer
  scene: Scene
  camera: Camera
  cameraControls: CameraControls
}

export const looping = ref(false)

const { idle } = useIdle(13_666) // ms

watchEffect(() => {
  document.querySelector("#scene")?.classList.toggle("paused", idle.value)
})

const { stats } = useStats()

let gameLoop: Fn // TODO: check is singleton practicable

export function initGameLoop({ renderer, scene, camera, cameraControls }: Options) {
  const clock = new Clock()
  let deltaTime: number

  gameLoop = () => {
    deltaTime = clock.getDelta()
    stats.update()
    const cameraMoved = cameraControls.update(deltaTime)

    runInjectedFunctions({ scene, renderer, deltaTime }, "camupdated")

    requestAnimationFrame(gameLoop)
    // console.log([cameraMoved, idle.value])
    if (cameraMoved || !idle.value) renderer.render(scene, camera)

    runInjectedFunctions({ scene, renderer, deltaTime }, "rendered")
  }
}

whenever(looping, () => gameLoop?.())
