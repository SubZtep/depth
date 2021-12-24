import { Fn, tryOnScopeDispose } from "@vueuse/core"
import type { OrthographicCamera } from "three/src/cameras/OrthographicCamera"
import type { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera"
import { Clock } from "three/src/core/Clock"
import type { WebGLRenderer } from "three/src/renderers/WebGLRenderer"
import type { Scene } from "three/src/scenes/Scene"

interface RenderLoopFnProps {
  renderer: WebGLRenderer
  scene: Scene
  /** Three.js internal clock. */
  clock: Clock
  /** Get delta from clock at frame start. */
  deltaTime: number
  camera: PerspectiveCamera | OrthographicCamera
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

/**
 * Add to loop
 * @param fn - Function to add to the loop.
 * @param params - inject location
 * @returns Stop function for remove `fn` from the loop
 */
export const loop3D = (fn: RenderLoopFn, params: Loop3DParams = {}) => {
  const { inject = "camupdated" } = params

  let stop: Fn

  if (inject === "rendered") {
    renderedLoopFns.add(fn)
    stop = () => renderedLoopFns.delete(fn)
  } else {
    loopFns.add(fn)
    stop = () => loopFns.delete(fn)
  }

  tryOnScopeDispose(() => {
    stop()
  })

  return stop
}

export const runInjectedFunctions = (props: RenderLoopFnProps, inject: Loop3DParams["inject"] = "camupdated") => {
  const singles = inject === "camupdated" ? singleFns : renderedSingleFns
  const loops = inject === "camupdated" ? loopFns : renderedLoopFns
  try {
    for (const fn of singles) fn(props)
    singles.clear()
    for (const fn of loops) fn(props)
  } catch (error: any) {
    console.error("ThreeJS Render Loop", error)
  }
}
