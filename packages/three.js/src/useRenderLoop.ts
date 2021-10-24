import type CameraControls from "camera-controls"
import { get, whenever } from "@vueuse/core"
import { Ref } from "vue"
import { Clock } from "three"

interface RenderLoopProps {
  renderer: THREE.WebGLRenderer
  cameraControls: CameraControls
  scene: THREE.Scene
  isRunning: Ref<boolean>
  isRenderAllFrames: Ref<boolean>
}

interface LoopFnProps {
  cameraControls: CameraControls
  scene: THREE.Scene
  clock: THREE.Clock
}

type LoopFn = (props: LoopFnProps) => void
type LoopFnPr = (props: LoopFnProps) => Promise<void>

export const singleFns = new Set<LoopFn>()
export const singleFnPrs = new Set<LoopFnPr>()
export const loopFns = new Set<LoopFn>()
export const loopFnPrs = new Set<LoopFnPr>()

export const singleThreeJs = (fn: LoopFn) => {
  singleFns.add(fn)
}

export const loopThreeJs = (fn: LoopFn) => {
  loopFns.add(fn)
}

export function useRenderLoop({ renderer, cameraControls, scene, isRunning, isRenderAllFrames }: RenderLoopProps) {
  const clock = new Clock()
  const { camera } = cameraControls
  let delta: number

  const gameLoop = async () => {
    delta = clock.getDelta()
    const camUpdated = cameraControls.update(delta)

    try {
      singleFns.forEach(fn => fn({ scene, cameraControls, clock }))
      singleFns.clear()
      loopFns.forEach(fn => fn({ scene, cameraControls, clock }))

      for (const fn of singleFnPrs) {
        await fn({ scene, cameraControls, clock })
      }
      singleFnPrs.clear()
      for (const fn of loopFnPrs) {
        await fn({ scene, cameraControls, clock })
      }
    } catch (e) {
      console.error("ThreeJS Render Loop", e)
    }

    get(isRunning) && requestAnimationFrame(gameLoop)
    if (get(isRenderAllFrames) || camUpdated) renderer.render(scene, camera)
  }

  whenever(isRunning, () => requestAnimationFrame(gameLoop), { immediate: true })
}
