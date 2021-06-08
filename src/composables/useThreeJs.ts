import * as THREE from "three"
import type { MaybeRef } from "@vueuse/core"
import { debouncedWatch, useWindowSize, createEventHook, tryOnMounted, unrefElement } from "@vueuse/core"
import { useSkybox } from "./useSkybox"
import { useFloor } from "./useFloor"
import CameraControls from "camera-controls"

export function useThreeJs(canvasRef: MaybeRef<HTMLCanvasElement | undefined>) {
  const readyHook = createEventHook<ThreeJsObjects>()
  const { width, height } = useWindowSize()
  CameraControls.install({ THREE: THREE })
  const clock = new THREE.Clock()

  let scene: THREE.Scene
  let camera: THREE.PerspectiveCamera
  let renderer: THREE.WebGLRenderer
  let cameraControls: CameraControls

  const setRendererDimensions = () => {
    renderer.setSize(width.value, height.value)
    camera.aspect = width.value / height.value
    camera.updateProjectionMatrix()
  }

  debouncedWatch([width, height], setRendererDimensions, { immediate: false, debounce: 250 })

  const initThree = (canvas: HTMLCanvasElement) => {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(60, undefined, 0.1, 500)
    camera.position.set(50, 20, 50)
    cameraControls = new CameraControls(camera, canvas)
    renderer = new THREE.WebGLRenderer({ premultipliedAlpha: false, precision: "lowp", canvas })
    setRendererDimensions()

    scene.add(useFloor())
    useSkybox(scene)

    readyHook.trigger({ clock, cameraControls, renderer, scene, camera })
  }

  tryOnMounted(() => {
    initThree(unrefElement(canvasRef))
  })

  return {
    onRenderable: readyHook.on,
  }
}
