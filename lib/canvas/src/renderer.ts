import * as THREE from "three"
import { createRenderer, createCamera, createScene } from "./builders"

export function init({ canvas, state }: InitMessage) {
  state.running = true

  let oldWidth = 0
  let oldHeight = 0

  const renderer = createRenderer({ canvas })
  const camera = createCamera(state)
  const scene = createScene()
  const clock = new THREE.Clock()

  function canvasResizer() {
    // if multi-canvas not really wotks try to currying renderer (and others) here
    if (state.width === oldWidth || state.height === oldHeight) return
    oldWidth = state.width
    oldHeight = state.height
    camera.aspect = state.width / state.height
    camera.updateProjectionMatrix()
    renderer.setSize(state.width, state.height, false)
  }

  canvasResizer()

  function clearContext() {
    state.singleFns.length = 0
    state.loopFns.length = 0
    state.singleEvals.length = 0
    state.loopEvals.length = 0
    scene.clear()
    renderer.clear()
  }

  let fpsInterval: number
  let then = performance.now()
  let elapsed: number
  let now: number

  async function render(time: number) {
    if (!state.running) {
      return clearContext()
    } else {
      const deltaTime = clock.getDelta()

      const props = { scene, renderer, clock, deltaTime, time, camera }
      const evil = (fn: string) => void eval(";(" + fn + ")(props);")

      renderer.render(scene, camera)
      requestAnimationFrame(render)

      now = performance.now()
      elapsed = now - then
      fpsInterval = 1000 / state.fps

      if (elapsed > fpsInterval || state.fps === Number.POSITIVE_INFINITY) {
        then = now - (elapsed % fpsInterval)

        await Promise.all([
          ...state.singleFns.map(fn => fn(props)),
          ...state.singleEvals.map(fn => evil(fn)),
          ...state.loopFns.map(fn => fn(props)),
          ...state.loopEvals.map(fn => evil(fn)),
        ])
        state.singleFns.length = 0
        state.singleEvals.length = 0
      }

      canvasResizer()
    }
  }

  requestAnimationFrame(render)
}
