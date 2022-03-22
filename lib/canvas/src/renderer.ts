import * as THREE from "three"
import { createRenderer, createCamera, createScene } from "./builders"

export function init(initMessage: InitMessage) {
  const { canvas, injectedFunctions, statem } = initMessage

  let oldWidth = 0
  let oldHeight = 0

  const renderer = createRenderer({ canvas })
  const camera = createCamera(statem)
  const scene = createScene()
  const clock = new THREE.Clock()

  function canvasResizer() {
    // if multi-canvas not really wotks try to currying renderer (and others) here
    if (statem.width === oldWidth || statem.height === oldHeight) return
    oldWidth = statem.width
    oldHeight = statem.height
    camera.aspect = statem.width / statem.height
    camera.updateProjectionMatrix()
    renderer.setSize(statem.width, statem.height, false)
  }

  canvasResizer()

  function clearContext() {
    injectedFunctions.singleFns.length = 0
    injectedFunctions.loopFns.length = 0
    injectedFunctions.singleEvals.length = 0
    injectedFunctions.loopEvals.length = 0
    scene.clear()
    renderer.clear()
  }

  let fpsInterval: number
  let prenow = performance.now()
  let elapsed: number
  let now: number
  let deltaTime = 0

  async function render(time: number) {
    if (!statem.running) {
      return clearContext()
    } else {
      const fps = statem.fps

      renderer.render(scene, camera)
      requestAnimationFrame(render)
      deltaTime += clock.getDelta()

      if (fps !== Number.POSITIVE_INFINITY) {
        now = performance.now()
        elapsed = now - prenow
        fpsInterval = 1000 / fps
      }

      if (fps === Number.POSITIVE_INFINITY || elapsed > fpsInterval) {
        if (fps !== Number.POSITIVE_INFINITY) {
          prenow = now - (elapsed % fpsInterval)
        }
        const props = { scene, renderer, clock, deltaTime, time, camera }
        deltaTime = 0
        const evil = (fn: string) => void eval(";(" + fn + ")(props);")

        await Promise.all([
          ...injectedFunctions.singleFns.map((fn) => fn(props)),
          ...injectedFunctions.singleEvals.map((fn) => evil(fn)),
          ...injectedFunctions.loopFns.map((fn) => fn(props)),
          ...injectedFunctions.loopEvals.map((fn) => evil(fn)),
        ])
        injectedFunctions.singleFns.length = 0
        injectedFunctions.singleEvals.length = 0
      }

      canvasResizer()
    }
  }

  requestAnimationFrame(render)
}
