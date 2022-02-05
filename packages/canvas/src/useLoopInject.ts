export const singleFns = new Set<CanvasInjectedFn>()
export const loopFns = new Set<CanvasInjectedFn>()
export const renderedSingleFns = new Set<CanvasInjectedFn>()
export const renderedLoopFns = new Set<CanvasInjectedFn>()

interface CanvasInjectedFnProps {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  /** Three.js internal clock. */
  clock: THREE.Clock
  /** Get delta from THREE.Clock at frame start. */
  deltaTime: number
  /** requestAnimationFrame attr. */
  time: number
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
}

type CanvasInjectedFn = (props: CanvasInjectedFnProps) => void

export const exec3D = (fn: CanvasInjectedFn) => {
  console.log("i am exec3D")

  singleFns.add(fn)
}

interface Loop3DParams {
  inject?: "camupdated" | "rendered"
}

/**
 * Add to loop
 * @param fn - Function to add to the loop.
 * @param params - inject location
 * @returns Stop function for remove `fn` from the loop
 */
export const loop3D = (fn: CanvasInjectedFn, { inject }: Loop3DParams = {}) => {
  console.log("i am loop3D", loopFns)
  if (inject) {
    renderedLoopFns.add(fn)
    return () => renderedLoopFns.delete(fn)
  }
  loopFns.add(fn)
  return () => loopFns.delete(fn)
}

export const runInjectedFunctions = (props: CanvasInjectedFnProps) => (scheduled?: Loop3DParams["inject"]) =>
  Promise.race([
    new Promise<void>((resolve, reject) => {
      const singles = scheduled === "camupdated" ? singleFns : renderedSingleFns
      try {
        for (const fn of singles) fn(props)
        singles.clear()
        resolve()
      } catch (error: any) {
        reject(error.message)
      }
    }),
    new Promise<void>((resolve, reject) => {
      try {
        for (const fn of scheduled === "camupdated" ? loopFns : renderedLoopFns) fn(props)
        resolve()
      } catch (error: any) {
        reject(error.message)
      }
    }),
  ])
