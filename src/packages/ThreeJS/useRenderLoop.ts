import { get, useToggle, whenever } from "@vueuse/core"
import CameraControls from "camera-controls"
import { Clock, Scene, WebGLRenderer } from "three"

interface Props {
  renderer: WebGLRenderer
  cameraControls: CameraControls
  scene: Scene
}

export const loopFns = new Set<LoopFn>()
export const singleFns = new Set<LoopFn>()

export function useRenderLoop({ renderer, cameraControls, scene }: Props) {
  const [isRunning, toggleRun] = useToggle()
  const clock = new Clock()
  const { camera } = cameraControls
  let delta: number

  const loopFnRunner: LoopFnRunner = async fn => {
    try {
      await fn({ scene, cameraControls, isRunning, toggleRun } as LoopFnProps)
    } catch (e) {
      console.error("ThreeJS", e.message)
    }
  }

  const gameLoop = () => {
    delta = clock.getDelta()
    // console.log("loop", delta)
    cameraControls.update(delta)

    singleFns.forEach(fn => fn({ scene, cameraControls, isRunning, toggleRun }))
    singleFns.clear()

    loopFns.forEach(async fn => await loopFnRunner(fn))

    renderer.render(scene, camera)
    get(isRunning) && requestAnimationFrame(gameLoop)
  }

  whenever(isRunning, () => requestAnimationFrame(gameLoop))
  return { toggleRun }
}
