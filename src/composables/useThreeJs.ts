import type { MaybeRef } from "@vueuse/core"
import CameraControls from "camera-controls"
import * as THREE from "three"
import { Clock, Scene, WebGLRenderer, PerspectiveCamera, Box3, Vector3 } from "three"
import { onMounted, watch, inject } from "vue"
import { unrefElement } from "@vueuse/core"
import { debouncedWatch, useWindowSize, useToggle, get, set, useCssVar } from "@vueuse/core"
import { getLights } from "../models/light"
import { floor } from "../models/floor"
import { useSceneCam } from "./useSceneCam"

export const tickFns = new Set<PrFn>()
export const scene = new Scene()
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let cameraControls: CameraControls

export function useThreeJs(_threeHook?: EventHook<ThreeCtrlEvent>) {
  CameraControls.install({ THREE: THREE }) // TODO: tree shaking
  const { width, height } = useWindowSize()
  let canvas: MaybeRef<HTMLCanvasElement>
  const [isRunning, toggleRun] = useToggle()
  const stats = inject<Stats>("stats")!
  const clock = new Clock()

  const gameLoop = async () => {
    cameraControls.update(clock.getDelta())

    tickFns.forEach(async fn => await fn())

    renderer.render(scene, camera)
    stats.update()

    if (get(isRunning)) {
      requestAnimationFrame(gameLoop)
    }
  }

  const worldOpacity = useCssVar("--world-opacity")
  watch(isRunning, (will, was) => {
    if (will && !was) {
      set(worldOpacity, "1")
      requestAnimationFrame(gameLoop)
    } else {
      set(worldOpacity, "0.5")
    }
  })

  onMounted(async () => {
    renderer = new WebGLRenderer({ canvas: unrefElement(canvas), premultipliedAlpha: false, antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)

    camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500)
    cameraControls = new CameraControls(camera, renderer.domElement)
    cameraControls.setPosition(0, 2, 10)
    // cameraControls.tra
    // cameraControls.fitToBox(new Box3(new Vector3(0, 0), new Vector3(2, 2)))
    useSceneCam(cameraControls)

    scene.add(...getLights())
    scene.add(floor())

    debouncedWatch(
      [width, height],
      ([w, h]) => {
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      },
      { immediate: true, debounce: 250 }
    )
  })

  return {
    setCanvas: (c: MaybeRef<HTMLCanvasElement>) => (canvas = c),
    isRunning,
    toggleRun,
  }
}
