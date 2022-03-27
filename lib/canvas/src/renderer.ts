import * as THREE from "three"
import { createRenderer } from "./builders"

// export function init({ canvas, injectedFunctions, statem }: InitMessage) {
export function init({ canvas, injectedFunctions, statem, scene }: InitMessage) {
  const cameraView = !!injectedFunctions
  let oldWidth = 0
  let oldHeight = 0

  console.log("SS", scene)

  const renderer = createRenderer(canvas)

  let camera = new THREE.PerspectiveCamera(90)
  // @ts-ignore
  camera.name = `camera-${statem.sid}`
  if (camera.name === "camera-c1") {
    camera.position.set(0, 5, 0)
    camera.lookAt(0, 0, 0)
  }
  if (camera.name === "camera-c2") {
    camera.position.set(5, 1, 0)
    camera.lookAt(0, 0, 0)
  }
  const clock = new THREE.Clock()

  function canvasResizer() {
    if (statem.width === oldWidth || statem.height === oldHeight) return
    oldWidth = statem.width
    oldHeight = statem.height
    camera.aspect = statem.width / statem.height
    camera.updateProjectionMatrix()
    renderer.setSize(statem.width, statem.height, false)
  }

  // canvasResizer()

  function clearContext() {
    if (!cameraView) {
      injectedFunctions!.singleFns.length = 0
      injectedFunctions!.loopFns.length = 0
    }
    // scene.clear()
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

      // if (camera.name === "camera-c1") {
      //   camera.position.set(0, 5, 0)
      //   camera.lookAt(0, 0, 0)
      // }
      // if (camera.name === "camera-c2") {
      //   camera.position.set(5, 1, 0)
      //   camera.lookAt(0, 0, 0)
      // }

      renderer.render(scene, camera)
      requestAnimationFrame(render)
      deltaTime += clock.getDelta()

      if (fps !== Number.POSITIVE_INFINITY) {
        now = performance.now()
        elapsed = now - prenow
        fpsInterval = 1000 / fps
      }

      if ((injectedFunctions && fps === Number.POSITIVE_INFINITY) || elapsed > fpsInterval) {
        if (fps !== Number.POSITIVE_INFINITY) {
          prenow = now - (elapsed % fpsInterval)
        }
        const props = { scene, renderer, clock, deltaTime, time, camera }
        deltaTime = 0

        const evil = statem.offscreen ? (fn: string) => void eval(";(" + fn + ")(props);") : null

        await Promise.all([
          ...injectedFunctions!.singleFns.map((fn: any) => (evil ? evil(fn) : fn(props))),
          ...injectedFunctions!.loopFns.map((fn: any) => (evil ? evil(fn) : fn(props))),
        ])
        injectedFunctions!.singleFns.length = 0
      }

      // TODO: update scene for offscreen if injected functions made change

      canvasResizer()
    }
  }

  requestAnimationFrame(render)
}
