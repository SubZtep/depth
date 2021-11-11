import { MaybeRef } from "@vueuse/core"
import CameraControls from "camera-controls"
import { debouncedWatch, useWindowSize, get, tryOnMounted } from "@vueuse/core"
import { useRenderLoop } from "./useRenderLoop"
import { useCameraControls } from "./useCameraControls"
import { getCurrentInstance, unref } from "vue"
import { eventHook, eventHookHandler } from "./events"
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera"
import { MOUSE } from "three/src/constants"
import { Vector2 } from "three/src/math/Vector2"
import { Vector3 } from "three/src/math/Vector3"
import { Vector4 } from "three/src/math/Vector4"
import { Quaternion } from "three/src/math/Quaternion"
import { Matrix4 } from "three/src/math/Matrix4"
import { Spherical } from "three/src/math/Spherical"
import { Box3 } from "three/src/math/Box3"
import { Sphere } from "three/src/math/Sphere"
import { Raycaster } from "three/src/core/Raycaster"
import { DEG2RAD, clamp } from  "three/src/math/MathUtils"
import { Scene } from "three/src/scenes/Scene"
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"

type ThreeJSEventCmd = "pauseLoop" | "resumeLoop" | "renderAllFrames" | "renderFramesWithCameraMove"
export type ThreeJSEvent = ThreeJSEventCmd | { cmd: ThreeJSEventCmd }

export function normalizeEventHookParam(param: ThreeJSEvent) {
  return typeof param === "string" ? { cmd: param } : param
}

// Camera is required for some calculations
export let camera: PerspectiveCamera

const subsetOfTHREE = {
  MOUSE: MOUSE,
  Vector2: Vector2,
  Vector3: Vector3,
  Vector4: Vector4,
  Quaternion: Quaternion,
  Matrix4: Matrix4,
  Spherical: Spherical,
  Box3: Box3,
  Sphere: Sphere,
  Raycaster: Raycaster,
  MathUtils: {
    DEG2RAD: DEG2RAD,
    clamp: clamp,
  },
}

export function useCanvas(canvasRef: MaybeRef<HTMLCanvasElement>): Scene {
  const instance = getCurrentInstance()
  if (instance === null) {
    throw new Error("Use threeJs inside a component")
  }

  CameraControls.install({ THREE: subsetOfTHREE })
  const { width, height } = useWindowSize()
  const scene = new Scene()
  const { onEvent, isRunning, renderFrames } = eventHookHandler()

  eventHook.on(onEvent)

  tryOnMounted(() => {
    const canvas = unref(canvasRef)
    canvas.width = get(width)
    canvas.height = get(height)

    const renderer = new WebGLRenderer({ canvas, powerPreference: "high-performance", antialias: true })
    renderer.shadowMap.enabled = true

    // const camera = new PerspectiveCamera(60, get(width) / get(height), 0.01, 1000)
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
