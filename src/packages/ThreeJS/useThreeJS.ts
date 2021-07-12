import type { MaybeRef } from "@vueuse/core"
import CameraControls from "camera-controls"
import * as THREE from "three"
import { Scene, WebGLRenderer, PerspectiveCamera } from "three"
import { debouncedWatch, useWindowSize, get, set, tryOnMounted, useToggle } from "@vueuse/core"
import { useRenderLoop } from "./useRenderLoop"
import { useThreeJSEventHook } from "./plugin"
import { useCameraControls } from "./useCameraControls"

export const transformables = new Set()

export function useCanvas(canvas: MaybeRef<HTMLCanvasElement>) {
  const instance = getCurrentInstance()
  if (instance === null) {
    throw new Error("Use threeJs inside a component")
  }

  CameraControls.install({ THREE: THREE }) // TODO: tree shaking
  const { width, height } = useWindowSize()
  const [isRunning, toggleRun] = useToggle()
  const scene = new Scene()

  useThreeJSEventHook().on(params => {
    const world = document.querySelector("#world")!
    switch (params.cmd) {
      case "pauseLoop":
        toggleRun(false)
        world.classList.add("paused")
        break
        case "resumeLoop":
          world.classList.remove("paused")
          toggleRun(true)
        break
    }
  })

  tryOnMounted(() => {
    const c = unref(canvas)
    c.width = get(width)
    c.height = get(height)

    const renderer = new WebGLRenderer({ canvas: c, powerPreference: "high-performance", antialias: true })
    renderer.shadowMap.enabled = true

    const camera = new PerspectiveCamera(60, get(width) / get(height), 0.01, 1000)
    const cameraControls = new CameraControls(camera, instance.appContext.app._container)
    cameraControls.setLookAt(2, 1, -4, 2, 2, 0, true)
    useCameraControls(cameraControls)

    useRenderLoop({ renderer, cameraControls, scene, isRunning, toggleRun })
    toggleRun(true)

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
