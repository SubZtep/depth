import { get, useToggle, whenever } from "@vueuse/core"
import { Clock } from "three"

export const singleFns = new Set<LoopFn>()
export const singleFnPrs = new Set<LoopFnPr>()
export const loopFns = new Set<LoopFn>()
export const loopFnPrs = new Set<LoopFnPr>()

export function useRenderLoop({ renderer, cameraControls, scene }: RenderLoopProps) {
  const [isRunning, toggleRun] = useToggle()
  const clock = new Clock()
  const { camera } = cameraControls
  let delta: number

  const loopFnRunner: LoopFnRunner = fn => {
    try {
      return fn({ scene, cameraControls, isRunning, toggleRun } as LoopFnProps)
    } catch (e) {
      console.error("ThreeJS loop", e)
    }
  }

  const loopFnPrRunner: LoopFnPrRunner = async fn => {
    try {
      return await fn({ scene, cameraControls, isRunning, toggleRun } as LoopFnProps)
    } catch (e) {
      console.error("ThreeJS loop promise", e)
    }
  }

  const gameLoop = () => {
    delta = clock.getDelta()
    cameraControls.update(delta)

    singleFns.forEach(fn => fn({ scene, cameraControls, isRunning, toggleRun }))
    singleFns.clear()
    singleFnPrs.forEach(async fn => await fn({ scene, cameraControls, isRunning, toggleRun }))
    singleFnPrs.clear()

    loopFns.forEach(fn => loopFnRunner(fn))
    loopFnPrs.forEach(async fn => await loopFnPrRunner(fn))

    renderer.render(scene, camera)
    get(isRunning) && requestAnimationFrame(gameLoop)
  }

  whenever(isRunning, () => requestAnimationFrame(gameLoop))
  return { toggleRun }
}
