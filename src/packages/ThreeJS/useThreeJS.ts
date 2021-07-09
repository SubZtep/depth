import type { MaybeRef } from "@vueuse/core"
import CameraControls from "camera-controls"
import { onMounted, getCurrentInstance, onBeforeMount, unref } from "vue"
import * as THREE from "three"
import { Clock, Scene, WebGLRenderer, PerspectiveCamera } from "three"
import { debouncedWatch, useWindowSize, useToggle, get, set, useCssVar, whenever, tryOnMounted } from "@vueuse/core"
import { useRenderLoop } from "./useRenderLoop"
import { useThreeJSAlterEventHook } from "./plugin"

interface Params {
  canvas: MaybeRef<HTMLCanvasElement>
  errorHandler?: ErrorHandler
}

export const transformables = new Set()

export function useThreeJs(initFn: InitFn | undefined, params: Params) {
  const instance = getCurrentInstance()
  if (instance === null) {
    throw new Error("Use threeJs inside a component")
  }

  CameraControls.install({ THREE: THREE }) // TODO: tree shaking

  const { canvas, errorHandler = console.error } = params
  const { width, height } = useWindowSize()

  const scene = new Scene()
  const tickFns = new Set<TickFn>()

  useThreeJSAlterEventHook().on(params => {
    switch (params.cmd) {
      case "addToScene":
        scene.add(params.payload)
        break
      case "deleteFromScene":
        scene.remove(params.payload)
        break
      case "addToTickFn":
        tickFns.add(params.payload)
        break
      case "deleteFromTickFn":
        tickFns.delete(params.payload)
        break
    }
  })

  const clock = new Clock()
  // const tickFns = new Set<TickFn>()

  // console.log("canvas", [canvas, unrefElement(canvas)])

  // onBeforeMount(() => {

  // })

  // let renderer: THREE.WebGLRenderer
  // let camera: THREE.PerspectiveCamera
  // let cameraControls: CameraControls

  const tickRunner: TickFnRunner = async fn => {
    try {
      console.log("TEST FN", fn.toString())
      await fn({ scene } as TickFnProps)
      // await fn({ scene, cameraControls, isRunning, toggleRun, ...objs } as TickFnProps)
    } catch (e) {
      errorHandler(e)
    }
  }

  // const objs = initFn && initFn(scene) || {}

  // // const gameLoop = async () => {
  // const gameLoop = () => {
  //   // console.log("CC", cameraControls)
  //   cameraControls.update(clock.getDelta())
  //   // tickFns.forEach(tickRunner)
  //   renderer.render(scene, camera)
  //   // stats.update()

  //   if (get(isRunning)) {
  //     requestAnimationFrame(gameLoop)
  //   }
  // }

  // const worldOpacity = useCssVar("--world-opacity")
  // watch(isRunning, (will, was) => {
  //   if (will && !was) {
  //     set(worldOpacity, "1")
  //     requestAnimationFrame(gameLoop)
  //   } else {
  //     set(worldOpacity, "0.3")
  //   }
  // })

  // console.log("XXX", getCurrentInstance()?.appContext.app._container)

  tryOnMounted(() => {
    const c = unref(canvas)
    c.width = get(width)
    c.height = get(height)

    const renderer = new WebGLRenderer({ canvas: c, powerPreference: "high-performance", antialias: true })
    renderer.shadowMap.enabled = true

    const camera = new PerspectiveCamera(60, get(width) / get(height), 0.01, 1000)
    const cameraControls = new CameraControls(camera, instance.appContext.app._container)

    initFn && initFn(scene)
    useRenderLoop({ renderer, cameraControls, scene, tickFns }).toggleRun()

    debouncedWatch(
      [width, height],
      ([w, h]) => {
        c.width = w
        c.height = h
        renderer.setSize(w, h)
        renderer.setPixelRatio(window.devicePixelRatio)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      },
      { immediate: true, debounce: 250 }
    )
  })
}
