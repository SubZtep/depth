import { debouncedWatch, get, MaybeRef, tryOnMounted, unrefElement } from "@vueuse/core"
import { useWindowSize } from "@vueuse/core"
import CameraControls from "camera-controls"
import type { THREESubset } from "camera-controls/dist/types"
import { getCurrentInstance } from "vue"
import { Vector2 } from "three/src/math/Vector2"
import { Vector3 } from "three/src/math/Vector3"
import { Vector4 } from "three/src/math/Vector4"
import { Quaternion } from "three/src/math/Quaternion"
import { Matrix4 } from "three/src/math/Matrix4"
import { Spherical } from "three/src/math/Spherical"
import { Box3 } from "three/src/math/Box3"
import { Sphere } from "three/src/math/Sphere"
import { Raycaster } from "three/src/core/Raycaster"
import { DEG2RAD, clamp } from "three/src/math/MathUtils"
import { Scene } from "three/src/scenes/Scene"
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera"
import { MOUSE, PCFSoftShadowMap, sRGBEncoding } from "three/src/constants"
import { eventHook, eventHookHandler } from "./events"
import { useRenderLoop } from "./useRenderLoop"
import { useCameraControls } from "./useCameraControls"

type ThreeJSEventCmd = "pauseLoop" | "resumeLoop" | "renderAllFrames" | "renderFramesWithCameraMove"
export type ThreeJSEvent = ThreeJSEventCmd | { cmd: ThreeJSEventCmd }

export function normalizeEventHookParam(param: ThreeJSEvent) {
  return typeof param === "string" ? { cmd: param } : param
}

// Camera is required for some calculations
export let camera: PerspectiveCamera

export function useCanvas(canvasRef: MaybeRef<HTMLCanvasElement>): Scene {
  const instance = getCurrentInstance()
  if (instance === null) {
    throw new Error("Use threeJs inside a component")
  }

  CameraControls.install({
    THREE: {
      MOUSE,
      Vector2,
      Vector3,
      Vector4,
      Quaternion,
      Matrix4,
      Spherical,
      Box3,
      Sphere,
      Raycaster,
      MathUtils: {
        DEG2RAD,
        clamp,
      },
    } as THREESubset,
  })

  const { width, height } = useWindowSize()
  const scene = new Scene()
  const { onEvent, isRunning, renderFrames } = eventHookHandler()

  eventHook.on(onEvent)

  tryOnMounted(() => {
    const canvas = unrefElement(canvasRef) as HTMLCanvasElement
    canvas.width = get(width)
    canvas.height = get(height)

    const renderer = new WebGLRenderer({ canvas, powerPreference: "high-performance", antialias: true })
    renderer.outputEncoding = sRGBEncoding
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = PCFSoftShadowMap

    camera = new PerspectiveCamera(60, get(width) / get(height), 0.01, 1000)
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
