import { get, useToggle, whenever } from "@vueuse/core"
import { Clock } from "three"

export const singleFns = new Set<LoopFn>()
export const singleFnPrs = new Set<LoopFnPr>()
export const loopFns = new Set<LoopFn>()
export const loopFnPrs = new Set<LoopFnPr>()

export function useRenderLoop({ renderer, cameraControls, scene, isRunning, toggleRun }: RenderLoopProps) {
  const clock = new Clock()
  const { camera } = cameraControls
  let delta: number

  // TODO: what's these runners for?
  const loopFnRunner: LoopFnRunner = fn => {
    try {
      return fn({ scene, cameraControls } as LoopFnProps)
    } catch (e) {
      console.error("ThreeJS loop", [e, fn])
    }
  }

  const loopFnPrRunner: LoopFnPrRunner = async fn => {
    try {
      return await fn({ scene, cameraControls } as LoopFnProps)
    } catch (e) {
      console.error("ThreeJS loop promise", e)
    }
  }

  const gameLoop = async () => {
    delta = clock.getDelta()
    cameraControls.update(delta)

    singleFns.forEach(fn => fn({ scene, cameraControls }))
    for (const fn of singleFnPrs) {
      await fn({ scene, cameraControls })
    }
    singleFns.clear()
    singleFnPrs.clear()

    // TODO: test with promise.all
    loopFns.forEach(fn => loopFnRunner(fn))
    for (const fn of loopFnPrs) {
      await loopFnPrRunner(fn)
    }

    get(isRunning) && requestAnimationFrame(gameLoop)

    renderer.render(scene, camera)
  }

  whenever(isRunning, () => requestAnimationFrame(gameLoop))
}
