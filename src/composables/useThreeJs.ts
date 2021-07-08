import type { MaybeRef } from "@vueuse/core"
import CameraControls from "camera-controls"
import { onMounted, watch } from "vue"
import * as THREE from "three"
import { Clock, Scene, WebGLRenderer, PerspectiveCamera } from "three"
import { debouncedWatch, useWindowSize, useToggle, get, set, useCssVar, unrefElement, whenever } from "@vueuse/core"
// import { useCameraControls } from "./useCameraControls"
// import { useTransformControls } from "./useTransformControls"
// import { useStats } from "../plugins/stats"

interface Params {
  canvas: MaybeRef<HTMLCanvasElement>
  errorHandler?: ErrorHandler
}

export const transformables = new Set()

export function useThreeJs(initFn: InitFn | undefined, params: Params) {
  CameraControls.install({ THREE: THREE }) // TODO: tree shaking
  const { canvas, errorHandler = console.error } = params

  const { width, height } = useWindowSize()
  const [isRunning, toggleRun] = useToggle()
  // const stats = useStats()
  const clock = new Clock()

  const tickFns = new Set<TickFn>()
  const scene = new Scene()
  let renderer: THREE.WebGLRenderer
  let camera: THREE.PerspectiveCamera
  let cameraControls: CameraControls


  const tickRunner: TickRunner = async fn => {
    try {
      await fn({ scene, cameraControls, isRunning, toggleRun, ...objs } as TickFnProps)
    } catch (e) {
      errorHandler(e)
    }
  }

  const objs = initFn && initFn(scene) || {}

  // const gameLoop = async () => {
  const gameLoop = () => {
    // console.log("CC", cameraControls)
    cameraControls.update(clock.getDelta())
    // tickFns.forEach(tickRunner)
    renderer.render(scene, camera)
    // stats.update()

    if (get(isRunning)) {
      requestAnimationFrame(gameLoop)
    }
  }

  // const worldOpacity = useCssVar("--world-opacity")
  // watch(isRunning, (will, was) => {
  //   if (will && !was) {
  //     set(worldOpacity, "1")
  //     requestAnimationFrame(gameLoop)
  //   } else {
  //     set(worldOpacity, "0.3")
  //   }
  // })


  onMounted(async () => {

    console.log("CANVAS", canvas)


    renderer = new WebGLRenderer({
      canvas: unrefElement(canvas),
      powerPreference: "high-performance",
      antialias: true,
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true

    camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 500)
    // cameraControls = new CameraControls(camera, renderer.domElement)

    // useCameraControls(cameraControls)
    // useTransformControls({ cameraControls, domElement: renderer.domElement, scene })

    // whenever(isRunning, () => {
    //   console.log("AAAAA")
    //   window.requestAnimationFrame(gameLoop)
    // })


    debouncedWatch(
      [width, height],
      ([w, h]) => {
        console.log("BBBBB", camera)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
        // cameraControls.camera = camera
        cameraControls = new CameraControls(camera, renderer.domElement)
        // cameraControls = new CameraControls(camera, document.querySelector("#app")!)
        // console.log("ke?", cameraControls. )
        cameraControls.setLookAt(2, 1, -4, 2, 2, 0, true)

        window.requestAnimationFrame(gameLoop)
        // toggleRun()
      },
      { immediate: true, debounce: 250 }
    )
  })

  return {
    isRunning,
    toggleRun,
    tickFns,
    scene,
  }
}
