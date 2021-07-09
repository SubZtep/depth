import { get, useToggle, whenever } from "@vueuse/core"
import CameraControls from "camera-controls"
import { Clock, Scene, WebGLRenderer } from "three"

interface Props {
  renderer: WebGLRenderer
  cameraControls: CameraControls
  scene: Scene
  tickFns: Set<TickFn>
}

export function useRenderLoop({ renderer, cameraControls, scene, tickFns }: Props) {
  const [isRunning, toggleRun] = useToggle()
  const clock = new Clock()
  const { camera } = cameraControls
  let delta: number


  const tickRunner: TickFnRunner = async fn => {
    try {
      // await fn({ scene, cameraControls, isRunning, toggleRun, ...objs } as TickFnProps)
      await fn({ scene, cameraControls, isRunning, toggleRun } as TickFnProps)
    } catch (e) {
      console.error(e)
      // errorHandler(e)
    }
  }


  cameraControls.setLookAt(2, 1, -4, 2, 2, 0, true)

  const gameLoop = () => {
    delta = clock.getDelta()
    cameraControls.update(delta)
    tickFns.forEach(fn => tickRunner(fn))
    renderer.render(scene, camera)
    get(isRunning) && requestAnimationFrame(gameLoop)
  }

  whenever(isRunning, () => requestAnimationFrame(gameLoop))
  return { toggleRun }
}
