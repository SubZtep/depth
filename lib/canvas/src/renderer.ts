import * as THREE from "three"
import Stats from "stats.js"
import { runInjectedFunctions } from "./inject"
import { range, sleep } from "@depth/misc"
// import { runInjectedFunctions } from "./inject" // going to be microfunction

export const state: Dimensions = {
  width: 320,
  height: 200,
}

// let renderer: THREE.WebGLRenderer

let renderRunning = false

// export async function init(data: InitMessage) {
export function init(data: InitMessage) {
  console.log("Renderer init", data)
  const { canvas } = data

  renderRunning = true

  // TODO: make it work in worker
  data.canvasState?.subscribe(running => {
    if (!running) {
      renderRunning = false
    }
  }, "running")

  let stats: Stats | undefined
  if (typeof document !== "undefined") {
    stats = new Stats()
    stats.showPanel(0)
    ;(canvas as HTMLCanvasElement).parentElement?.append(stats.dom)
  }

  // renderer = new THREE.WebGLRenderer({
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
    logarithmicDepthBuffer: true,
  })
  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  state.width = (canvas as HTMLCanvasElement).width
  state.height = (canvas as HTMLCanvasElement).height

  const camera = new THREE.PerspectiveCamera(90, state.width / state.height, 1, 2000)
  camera.position.z = 100

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x666600)

  const clock = new THREE.Clock()

  const cube = (y = 10) => new THREE.Mesh(
    new THREE.BoxGeometry(10, y, 10, 10, 10, 10),
    new THREE.MeshPhongMaterial({ color: 0x669913 })
  )

  for (const i of range(10, 100)) {
    scene.add(cube(i * 2))
    // await sleep(100)
  }

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
    const gl = renderer.getContext()
    gl.clearColor(0.6, 0.6, 0, 0.6)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }

  async function render(time: number) {
    if (!renderRunning) {
      return clearContext()
    }

    camera.rotateY(0.05)
    stats?.begin()
    time *= 0.001
    const deltaTime = clock.getDelta()
    const runner = runInjectedFunctions({ scene, renderer, clock, deltaTime, time, camera })
    await runner()

    renderer.render(scene, camera)
    requestAnimationFrame(render)

    // await runner("rendered")
    if (resizeRendererToDisplaySize(renderer)) {
      camera.aspect = state.width / state.height
      camera.updateProjectionMatrix()
    }
    stats?.end()
  }

  requestAnimationFrame(render)
}

export function stopLooping() {
  renderRunning = false
}
