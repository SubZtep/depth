import type { MaybeRef } from "@vueuse/core"
import CameraControls from "camera-controls"
import * as THREE from "three"
import { Scene, WebGLRenderer, PerspectiveCamera } from "three"
import { debouncedWatch, useWindowSize, get, set, tryOnMounted } from "@vueuse/core"
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
  const scene = new Scene()

  useThreeJSEventHook().on(params => {
    switch (params.cmd) {
      case "addToScene":
        scene.add(params.payload)
        break
      case "deleteFromScene":
        scene.remove(params.payload)
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
  
    useRenderLoop({ renderer, cameraControls, scene }).toggleRun()

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
