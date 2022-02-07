import { useSingleton } from "@depth/misc"

// export const singleFns = new Set<CanvasInjectedFn>()
// export const loopFns = new Set<CanvasInjectedFn>()
// export const renderedSingleFns = new Set<CanvasInjectedFn>()
// export const renderedLoopFns = new Set<CanvasInjectedFn>()
export const singleFns: CanvasInjectedFn[] = []
// export let loopFns: CanvasInjectedFn[] = []
// let loopFns: CanvasInjectedFn[] = []
export const renderedSingleFns: CanvasInjectedFn[] = []
export const renderedLoopFns: CanvasInjectedFn[] = []

const { single } = useSingleton()

single("loopFns", [])

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

  singleFns.push(fn)
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
  const loopFns = single("loopFns")
  console.log("i am loop3D", loopFns)
  // if (inject) {
  //   renderedLoopFns.push(fn)
  //   return () => renderedLoopFns.delete(fn)
  // }
  loopFns.add(fn)

  // loopFns.splice(loopFns.length, 0, fn);
  // loopFns.push(fn)
  // loopFns = [fn]
  console.log("RES", loopFns)

  return () => [] //loopFns.delete(fn)
  // return () => loopFns.delete(fn)
}

export const runInjectedFunctions = (props: CanvasInjectedFnProps) => (scheduled?: Loop3DParams["inject"]) => {
  const loopFns = single("loopFns")
  console.log("FWERFCVWE", [loopFns.length, renderedLoopFns.length])
  return Promise.race([
    new Promise<void>((resolve, reject) => {
      const singles = scheduled === "camupdated" ? singleFns : renderedSingleFns
      singles.length > 0 && console.log("Singles", singles.length)
      try {
        for (const fn of singles) fn(props)
        singles.length = 0
        resolve()
      } catch (error: any) {
        reject(error.message)
      }
    }),
    new Promise<void>((resolve, reject) => {
      // const loopFns = single("loopFns")
      const loopFns = single("loopFns")
      const loopers = scheduled === "camupdated" ? loopFns : renderedLoopFns
      loopers.length > 0 && console.log("Loopers", loopers.length)
      try {
        for (const fn of loopers) fn(props)
        resolve()
      } catch (error: any) {
        reject(error.message)
      }
    }),
  ])
}

// loop3D(() => {}, { inject: "rendered" })
