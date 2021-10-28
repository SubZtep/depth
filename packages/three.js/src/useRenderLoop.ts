import type { RenderFramesParam } from "./events"
import type CameraControls from "camera-controls"
import { get, whenever } from "@vueuse/core"
import { Clock } from "three"
import { Ref } from "vue"

interface RenderLoopProps {
  renderer: THREE.WebGLRenderer
  cameraControls: CameraControls
  scene: THREE.Scene
  isRunning: Ref<boolean>
  renderFrames: Ref<RenderFramesParam>
}

interface LoopFnProps {
  cameraControls: CameraControls
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  clock: THREE.Clock
}

type LoopFn = (props: LoopFnProps) => void
type LoopFnPr = (props: LoopFnProps) => Promise<void>

export const singleFns = new Set<LoopFn>()
export const singleFnPrs = new Set<LoopFnPr>()
export const loopFns = new Set<LoopFn>()
export const loopFnPrs = new Set<LoopFnPr>()

export const exec3D = (fn: LoopFn) => {
  singleFns.add(fn)
}

export const loop3D = (fn: LoopFn) => {
  loopFns.add(fn)
}

export function useRenderLoop({ renderer, cameraControls, scene, isRunning, renderFrames }: RenderLoopProps) {
  const clock = new Clock()
  const { camera } = cameraControls
  let delta: number

  const gameLoop = async () => {
    delta = clock.getDelta()
    const camUpdated = cameraControls.update(delta)

    try {
      singleFns.forEach(fn => fn({ scene, renderer, cameraControls, clock }))
      singleFns.clear()
      loopFns.forEach(fn => fn({ scene, renderer, cameraControls, clock }))

      for (const fn of singleFnPrs) {
        await fn({ scene, renderer, cameraControls, clock })
      }
      singleFnPrs.clear()
      for (const fn of loopFnPrs) {
        await fn({ scene, renderer, cameraControls, clock })
      }
    } catch (e) {
      console.error("ThreeJS Render Loop", e)
    }

    if (get(isRunning)) requestAnimationFrame(gameLoop)
    if (camUpdated || get(renderFrames) === "All") renderer.render(scene, camera)
  }

  whenever(isRunning, () => requestAnimationFrame(gameLoop), { immediate: true })
}
