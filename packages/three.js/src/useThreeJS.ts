import { MaybeRef } from "@vueuse/core"
import CameraControls from "camera-controls"
import * as THREE from "three"
import { Scene, WebGLRenderer, PerspectiveCamera } from "three"
import { debouncedWatch, useWindowSize, get, tryOnMounted } from "@vueuse/core"
import { useRenderLoop } from "./useRenderLoop"
import { useCameraControls } from "./useCameraControls"
import { getCurrentInstance, unref } from "vue"
import { eventHook, eventHookHandler } from "./events"

type ThreeJSEventCmd = "pauseLoop" | "resumeLoop" | "renderAllFrames" | "renderFramesWithCameraMove"
export type ThreeJSEvent = ThreeJSEventCmd | { cmd: ThreeJSEventCmd }

export function normalizeEventHookParam(param: ThreeJSEvent) {
  return typeof param === "string" ? { cmd: param } : param
}

export function useCanvas(canvasRef: MaybeRef<HTMLCanvasElement>): Scene {
  const instance = getCurrentInstance()
  if (instance === null) {
    throw new Error("Use threeJs inside a component")
  }

  CameraControls.install({ THREE: THREE }) // TODO: tree shaking
  const { width, height } = useWindowSize()
  const scene = new Scene()
  const { onEvent, isRunning, renderFrames } = eventHookHandler()

  eventHook.on(onEvent)

  tryOnMounted(() => {
    const canvas = unref(canvasRef)
    canvas.width = get(width)
    canvas.height = get(height)

    // TODO: test for webgl2
    const renderer = new WebGLRenderer({ canvas, powerPreference: "high-performance", antialias: true })
    renderer.shadowMap.enabled = true

    const camera = new PerspectiveCamera(60, get(width) / get(height), 0.01, 1000)
    const cameraControls = new CameraControls(camera, instance.appContext.app._container)
    useCameraControls(cameraControls)

    useRenderLoop({ renderer, cameraControls, scene, isRunning, renderFrames })

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
