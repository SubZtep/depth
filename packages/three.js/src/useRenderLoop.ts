import type { Ref } from "vue"
import type CameraControls from "camera-controls"
import type { RenderFramesParam } from "./events"
import { get, tryOnBeforeUnmount, whenever } from "@vueuse/core"
import { Clock } from "three"

interface RenderLoopProps {
  renderer: THREE.WebGLRenderer
  cameraControls: CameraControls
  scene: THREE.Scene
  isRunning: Ref<boolean>
  renderFrames: Ref<RenderFramesParam>
}

interface RenderLoopFnProps {
  cameraControls: CameraControls
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  clock: THREE.Clock
}

type RenderLoopFn = (props: RenderLoopFnProps) => void

export const singleFns = new Set<RenderLoopFn>()
export const loopFns = new Set<RenderLoopFn>()
export const renderedSingleFns = new Set<RenderLoopFn>()
export const renderedLoopFns = new Set<RenderLoopFn>()

export const exec3D = (fn: RenderLoopFn) => {
  singleFns.add(fn)
}

interface Loop3DParams {
  inject?: "camupdated" | "rendered"
}

/** When added or removed a function thereby "sorted array" recalculation is necessary */
// https://github.com/antfu/unocss/blob/main/packages/core/src/config.ts#L20-L24
// const loop3DDirty = false

export const loop3D = (fn: RenderLoopFn, params: Loop3DParams = {}) => {
  const { inject = "camupdated" } = params

  if (inject === "rendered") {
    renderedLoopFns.add(fn)
  } else {
    loopFns.add(fn)
  }

  tryOnBeforeUnmount(() => {
    if (inject === "rendered") {
      renderedLoopFns.delete(fn)
    } else {
      loopFns.delete(fn)
    }
  })
}

//TODO: clear FNss on page umount

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
    } catch (e) {
      console.error("ThreeJS Render Loop", e)
    }

    if (get(isRunning)) requestAnimationFrame(gameLoop)
    if (camUpdated || get(renderFrames) === "All") renderer.render(scene, camera)

    try {
      renderedSingleFns.forEach(fn => fn({ scene, renderer, cameraControls, clock }))
      renderedSingleFns.clear()
      renderedLoopFns.forEach(fn => fn({ scene, renderer, cameraControls, clock }))
    } catch (e) {
      console.error("ThreeJS rendered loop", e)
    }
  }

  // Start and restart the main game loop
  whenever(isRunning, () => requestAnimationFrame(gameLoop), { immediate: true })
}
