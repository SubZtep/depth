import * as THREE from "three"
import { createRenderer, createCamera, createScene } from "./builders"

export const state: RendererState = {
  width: 320,
  height: 200,
  running: false,
  singleEvals: [],
  loopEvals: [],
  singleFns: [],
  loopFns: [],
}

export function init(props: InitMessage) {
  state.running = true

  state.width = props.canvas.width
  state.height = props.canvas.height

  const renderer = createRenderer({ canvas: props.canvas })
  const camera = createCamera(state)
  const scene = createScene()
  const clock = new THREE.Clock()

  function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement
    const width = state.width
    const height = state.height
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
      console.log("RESIZE", [width, height])
    }
    return needResize
  }

  function clearContext() {
    scene.clear()
    renderer.clear()
  }

  async function render(time: number) {
    if (!state.running) {
      return clearContext()
    } else {
      const deltaTime = clock.getDelta()
      const props = { scene, renderer, clock, deltaTime, time, camera }
      const evil = (fn: string) => void eval(";(" + fn + ")(props);")

      await Promise.all([
        ...state.singleFns.map(fn => fn(props)),
        ...state.singleEvals.map(fn => evil(fn)),
        ...state.loopFns.map(fn => fn(props)),
        ...state.loopEvals.map(fn => evil(fn)),
      ])
      state.singleFns.length = 0
      state.singleEvals.length = 0

      renderer.render(scene, camera)
      requestAnimationFrame(render)

      if (resizeRendererToDisplaySize(renderer)) {
        camera.aspect = state.width / state.height
        camera.updateProjectionMatrix()
      }
    }
  }

  requestAnimationFrame(render)
}
