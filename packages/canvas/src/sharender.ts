import * as THREE from "three"
import Stats from "stats.js"
import { reactive } from "@vue/reactivity"
import { runInjectedFunctions } from "./useLoopInject"

export const state = reactive<Dimensions>({
  width: 320,
  height: 200,
})

export function init(data: InitMessage) {
  console.log("INIT")
  const { canvas } = data

  let stats: Stats | undefined
  if (typeof document !== "undefined") {
    stats = new Stats()
    stats.showPanel(0)
    ;(canvas as HTMLCanvasElement).parentElement?.append(stats.dom)
  }

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
  camera.position.z = 690

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x666600)

  const clock = new THREE.Clock()

  function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement
    const width = state.width
    const height = state.height
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }

  async function render(time: number) {
    stats?.begin()
    time *= 0.001
    const deltaTime = clock.getDelta()
    const runner = runInjectedFunctions({ scene, renderer, clock, deltaTime, time, camera })

    await runner()
    renderer.render(scene, camera)
    requestAnimationFrame(render)

    await runner("rendered")
    if (resizeRendererToDisplaySize(renderer)) {
      camera.aspect = state.width / state.height
      camera.updateProjectionMatrix()
    }
    stats?.end()
  }

  requestAnimationFrame(render)
}
