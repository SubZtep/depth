import { Fn, whenever } from "@vueuse/core"
import CameraControls from "camera-controls"
import { Camera } from "three/src/cameras/Camera"
import { Clock } from "three/src/core/Clock"
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"
import { Scene } from "three/src/scenes/Scene"
import { ref } from "vue"

interface Options {
  renderer: WebGLRenderer
  scene: Scene
  camera: Camera
  cameraControls: CameraControls
}

export const looping = ref(false)

let gameLoop: Fn

export function initGameLoop({ renderer, scene, camera, cameraControls }: Options) {
  const clock = new Clock()
  let deltaTime: number

  gameLoop = () => {
    deltaTime = clock.getDelta()
    const cameraControlled = cameraControls.update(deltaTime)

    requestAnimationFrame(gameLoop)

    // if cameraControlled
    renderer.render(scene, camera)
  }
}

whenever(looping, () => gameLoop?.())
