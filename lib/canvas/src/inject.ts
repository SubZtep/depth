import { useSingleton } from "@depth/misc"

export const singleFns: CanvasInjectedFn[] = []
export let loopFns: CanvasInjectedFn[] = []

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

  // singleFns.add(fn)
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
  loopFns.push(fn)
  return () => []
}

export const runInjectedFunctions = (props: CanvasInjectedFnProps) => (scheduled?: Loop3DParams["inject"]) => {
  return Promise.race([
    new Promise<void>((resolve, reject) => {
      const singles = singleFns
      try {
        for (const fn of singles) fn(props)
        singles.length = 0
        resolve()
      } catch (error: any) {
        reject(error.message)
      }
    }),
    new Promise<void>((resolve, reject) => {
      const loopers = loopFns
      try {
        for (const fn of loopers) fn(props)
        resolve()
      } catch (error: any) {
        reject(error.message)
      }
    }),
  ])
}
