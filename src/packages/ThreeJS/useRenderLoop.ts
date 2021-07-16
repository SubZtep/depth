import { get, whenever } from "@vueuse/core"
import { Clock } from "three"

export const singleFns = new Set<LoopFn>()
export const singleFnPrs = new Set<LoopFnPr>()
export const loopFns = new Set<LoopFn>()
export const loopFnPrs = new Set<LoopFnPr>()

const parallelLoopFns = false //FIXME: make a working version (probably queue based)

export function useRenderLoop({ renderer, cameraControls, scene, isRunning, isRenderAllFrames }: RenderLoopProps) {
  const clock = new Clock()
  const { camera } = cameraControls
  let delta: number

  const gameLoop = async () => {
    delta = clock.getDelta()
    const camUpdated = cameraControls.update(delta)

    try {
      singleFns.forEach(fn => fn({ scene, cameraControls }))
      loopFns.forEach(fn => fn({ scene, cameraControls }))

      if (parallelLoopFns) {
        await Promise.allSettled([singleFnPrs, loopFnPrs])
      } else {
        for (const fn of singleFnPrs) {
          await fn({ scene, cameraControls })
        }
        for (const fn of loopFnPrs) {
          await fn({ scene, cameraControls })
        }
      }
    } catch (e) {
      console.error("ThreeJS Render Loop", e)
    }

    singleFns.clear()
    singleFnPrs.clear()

    get(isRunning) && requestAnimationFrame(gameLoop)

    if (get(isRenderAllFrames) || camUpdated) renderer.render(scene, camera)
  }

  whenever(isRunning, () => requestAnimationFrame(gameLoop), { immediate: true })
}
