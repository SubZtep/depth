import * as THREE from "three"
import { Clock, Scene, WebGLRenderer, PerspectiveCamera } from "three"
import { onMounted, inject } from "vue"
import CameraControls from "camera-controls"
import { debouncedWatch, useWindowSize, useRafFn } from "@vueuse/core"
import { useSceneCam } from "./useSceneCam"
import { loadSkybox } from "../models/skybox"
import { getLights } from "../models/light"
import { floor } from "../models/floor"

export const tickFns = new Set<PrFn>()
export const scene = new Scene()
export const renderer = new WebGLRenderer({ antialias: true, premultipliedAlpha: false })
let cameraControls: CameraControls

export function useThreeJs(threeHook: EventHook<ThreeCtrlEvent>, initFn: Fn) {
  CameraControls.install({ THREE: THREE }) // TODO: tree shaking
  const { width, height } = useWindowSize()
  const clock = new Clock()

  const camera = new PerspectiveCamera(60, undefined, 0.1, 500)
  const stats = inject<Stats>("stats")
  let delta: number

  const gameLoop = async () => {
    delta = clock.getDelta()
    cameraControls.update(delta)

    tickFns.forEach(async fn => await fn())

    renderer.render(scene, camera)
    stats?.update()
  }

  const { pause, resume } = useRafFn(gameLoop, { immediate: false })

  onMounted(async () => {
    renderer.setPixelRatio(window.devicePixelRatio)
    document.querySelector("#app")!.parentElement!.prepend(renderer.domElement)
    cameraControls = new CameraControls(camera, renderer.domElement)
    cameraControls.setPosition(0, 2, 10)
    useSceneCam(cameraControls)

    await loadSkybox(scene)
    scene.add(...getLights())
    scene.add(floor())

    await gameLoop()
    initFn()
  })

  debouncedWatch(
    [width, height],
    ([w, h]) => {
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer?.setSize(w, h)
    },
    { immediate: true, debounce: 250 }
  )

  threeHook.on(({ cmd }) => {
    switch (cmd) {
      case "pause":
        pause()
        break
      case "resume":
        resume()
        break
    }
  })

  return { pause, resume }
}
