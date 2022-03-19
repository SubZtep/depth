import * as THREE from "three"
import { createRenderer, createCamera, createScene } from "./builders"
// import { statem } from "@depth/statem"

// export const state: RendererState = {
//   fps: Number.POSITIVE_INFINITY,
//   width: 320,
//   height: 200,
//   running: false,
//   singleEvals: [],
//   loopEvals: [],
//   singleFns: [],
//   loopFns: [],
//   // fps: Number.POSITIVE_INFINITY,
// }

// export function init({ canvas, statem }: InitMessage) {
export function init({ canvas, state }: InitMessage) {
  state.running = true

  // state.width = statem.width
  // state.height = statem.height

  // state.width = canvas.width
  // state.height = canvas.height

  let oldWidth = state.width
  let oldHeight = state.height

  const renderer = createRenderer({ canvas })
  const camera = createCamera(state)
  const scene = createScene()
  const clock = new THREE.Clock()

  camera.aspect = state.width / state.height
  camera.updateProjectionMatrix()

  // renderer.setSize(statem.width, statem.height)
  // camera.aspect = statem.width / statem.height
  // camera.aspect = state.width / state.height
  // camera.updateProjectionMatrix()

  // function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
  //   // const parent = renderer.domElement.parentElement!
  //   // const canvasWidth = parent.clientWidth
  //   // const canvasHeight = parent.clientHeight
  //   const canvas = renderer.domElement
  //   const width = state.width
  //   const height = state.height
  //   // // console.log({ canvas, width, height })
  //   const needResize = canvas.width !== width || canvas.height !== height
  //   // const needResize = canvasWidth !== width || canvasHeight !== height
  //   if (needResize) {
  //     renderer.setSize(width, height, false)
  //     // renderer.setSize(canvasWidth, canvasHeight, true)
  //     // console.log("RESIZE", [width, height])
  //   }
  //   return needResize
  // }

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

  // statem.subscribe(s => {
  //   console.log("RESIZZZZ", [s.width, s.height])
  //   renderer.setSize(s.width, s.height)
  //   camera.aspect = s.width / s.height
  //   camera.updateProjectionMatrix()
  // })

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

      // fpsInterval = 1000 / statem.fps
      fpsInterval = 1000 / state.fps

      // if (elapsed > fpsInterval || statem.fps === Number.POSITIVE_INFINITY) {
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

      // renderer.setSize(state.width, state.height)
      // camera.aspect = state.width / state.height
      // camera.updateProjectionMatrix()

      // console.log("RENDERER", [oldWidth, state.width, oldHeight, state.height])

      // if (oldWidth !== state.width || oldHeight !== state.height) {
      //   oldWidth = state.width
      //   oldHeight = state.height
      //   // renderer.setSize(state.width, state.height, false)
      //   // renderer.setSize(state.width, state.height, false)
      //   camera.aspect = state.width / state.height
      //   camera.updateProjectionMatrix()
      // }

      // console.log("RENDERER", [renderer.domElement.parentElement])
      // renderer.setSize(state.width, state.height)

      // renderer.setSize(statem.width, statem.height)
      // camera.aspect = statem.width / statem.height
      // camera.updateProjectionMatrix()

      // if (resizeRendererToDisplaySize(renderer)) {
      //   camera.aspect = state.width / state.height
      //   console.log([state.width, state.width])
      //   // console.log(camera.aspect)
      //   camera.updateProjectionMatrix()
      // }
    }
  }

  requestAnimationFrame(render)
}
