import type { MaybeRef } from "@vueuse/core"
import CameraControls from "camera-controls"
import { onMounted, watch, inject } from "vue"
import * as THREE from "three"
import { Clock, Scene, WebGLRenderer, PerspectiveCamera, Object3D } from "three"
import { debouncedWatch, useWindowSize, useToggle, get, set, useCssVar, unrefElement } from "@vueuse/core"
import { useSceneCam } from "./useSceneCam"

export const tickFns = new Set<TickFn>()
export const scene = new Scene()
// export let toggleRun: () => boolean
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let cameraControls: CameraControls

interface Params {
  canvas: MaybeRef<HTMLCanvasElement>
  errorHandler?: ErrorHandler
}

export function useThreeJs(initFn: InitFn | undefined, params: Params) {
  const { canvas, errorHandler = console.error } = params

  CameraControls.install({ THREE: THREE }) // TODO: tree shaking
  const { width, height } = useWindowSize()
  const [isRunning, toggleRun] = useToggle()
  const stats = inject<Stats>("stats")!
  const clock = new Clock()

  const tickRunner: TickRunner = async fn => {
    try {
      await fn({ scene, cameraControls, isRunning, toggleRun, ...objs } as TickFnProps)
    } catch (e) {
      errorHandler(e)
    }
  }

  const objs = initFn && initFn(scene) || {}

  const gameLoop = async () => {
    cameraControls.update(clock.getDelta())
    tickFns.forEach(tickRunner)
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
      set(worldOpacity, "0")
    }
  })

  onMounted(async () => {
    renderer = new WebGLRenderer({
      canvas: unrefElement(canvas),
      powerPreference: "high-performance",
      antialias: true,
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true

    camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 500)
    cameraControls = new CameraControls(camera, renderer.domElement)
    useSceneCam(cameraControls)

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
    isRunning,
    toggleRun,
    tickFns,
  }
}
