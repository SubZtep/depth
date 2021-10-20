import type { MaybeRef } from "@vueuse/core"
import CameraControls from "camera-controls"
import * as THREE from "three"
import { Scene, WebGLRenderer, PerspectiveCamera } from "three"
import { debouncedWatch, useWindowSize, get, tryOnMounted, useToggle } from "@vueuse/core"
import { useRenderLoop } from "./useRenderLoop"
import { useThreeJSEventHook } from "./plugin"
import { useCameraControls } from "./useCameraControls"
import { getCurrentInstance, unref } from "vue"

export function useCanvas(canvasRef: MaybeRef<HTMLCanvasElement>): Scene {
  const instance = getCurrentInstance()
  if (instance === null) {
    throw new Error("Use threeJs inside a component")
  }

  CameraControls.install({ THREE: THREE }) // TODO: tree shaking
  const { width, height } = useWindowSize()
  const [isRunning, toggleRun] = useToggle(false)
  const [isRenderAllFrames, toggleRenderAllFrames] = useToggle(true)
  const scene = new Scene()

  useThreeJSEventHook().on(params => {
    const scene = document.querySelector("#scene")!
    switch (params.cmd) {
      case "pauseLoop":
        toggleRun(false)
        scene.classList.add("paused")
        break
      case "resumeLoop":
        scene.classList.remove("paused")
        toggleRun(true)
        break
      case "doRenderAllFrames":
        toggleRenderAllFrames(true)
        break
      case "dontRenderAllFrames":
        toggleRenderAllFrames(false)
        break
    }
  })

  tryOnMounted(() => {
    const canvas = unref(canvasRef)
    canvas.width = get(width)
    canvas.height = get(height)

    const renderer = new WebGLRenderer({ canvas, powerPreference: "high-performance", antialias: true })
    renderer.shadowMap.enabled = true

    const camera = new PerspectiveCamera(60, get(width) / get(height), 0.01, 1000)
    const cameraControls = new CameraControls(camera, instance.appContext.app._container)
    useCameraControls(cameraControls)

    useRenderLoop({ renderer, cameraControls, scene, isRunning, isRenderAllFrames })

    debouncedWatch(
      [width, height],
      ([w, h]) => {
        canvas.width = w
        canvas.height = h
        renderer.setSize(w, h)
        renderer.setPixelRatio(window.devicePixelRatio)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      },
      { immediate: true, debounce: 250 }
    )
  })

  return scene
}
