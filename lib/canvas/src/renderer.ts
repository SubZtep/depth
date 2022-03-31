import * as THREE from "three"
import { createRenderer } from "./builders"

export function init(props: InitMessage) {
  const { canvas, injectedFunctions, statem, scene, width, height } = props
  let oldWidth = 0
  let oldHeight = 0

  const renderer = createRenderer(canvas)
  const clock = new THREE.Clock()

  const camera = new THREE.PerspectiveCamera(90)
  // console.log("camera")
  camera.position.fromArray([1, 1, 1])
  camera.lookAt(0, 0, 0)

  function canvasResizer() {
    if (width === oldWidth || height === oldHeight) return
    oldWidth = width
    oldHeight = height
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }

  canvasResizer()

  function clearContext() {
    injectedFunctions.singleFns = []
    injectedFunctions.loopFns = []
    scene.clear()
    renderer.clear()
  }

  let fpsInterval: number
  let prenow = performance.now()
  let elapsed: number
  let now: number
  let deltaTime = 0
  let fps = Number.POSITIVE_INFINITY
  // scene.add(Globe)

  async function render(time: number) {

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

      if (injectedFunctions.singleFns.length > 0 || injectedFunctions.loopFns.length > 0) {
        // const props = { scene, renderer, clock, deltaTime, time, camera, width, height }
        // @ts-ignore
        props.deltaTime = deltaTime

        await Promise.all([
          ...injectedFunctions.singleFns.map((fn: any) => fn(props)),
          ...injectedFunctions.loopFns.map((fn: any) => fn(props)),
        ])
        injectedFunctions.singleFns = []
      }
      deltaTime = 0
    }

    canvasResizer()
  }

  requestAnimationFrame(render)
}
