import { debouncedWatch, useWindowSize, createEventHook, tryOnMounted, unrefElement, get } from "@vueuse/core"
import type { MaybeRef } from "@vueuse/core"
import CameraControls from "camera-controls"
import * as THREE from "three"
import { floor } from "../models/floor"
import { getLights } from "../models/light"
import { loadSkybox } from "../models/skybox"

export function useThreeJs(_canvasRef: MaybeRef<HTMLCanvasElement | undefined>) {
  CameraControls.install({ THREE: THREE })

  const readyHook = createEventHook<ThreeJsObjects>()
  const { width, height } = useWindowSize()
  const clock = new THREE.Clock()

  let scene: THREE.Scene
  let renderer: THREE.WebGLRenderer
  let cameraControls: CameraControls
  let camera: THREE.PerspectiveCamera

  const setRendererDimensions = (dimensions?: number[]) => {
    if (dimensions !== undefined) {
      const [w, h] = dimensions
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    } else {
      camera.aspect = get(width) / get(height)
      renderer.setSize(get(width), get(height))
    }
  }

  debouncedWatch([width, height], setRendererDimensions, { immediate: false, debounce: 250 })

  const initThree = (canvas: HTMLCanvasElement) => {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(60, undefined, 0.1, 500)
    // camera.position.set(50, 20, 50)
    cameraControls = new CameraControls(camera, canvas)

    renderer = new THREE.WebGLRenderer({ premultipliedAlpha: false, precision: "lowp", canvas })
    renderer.setPixelRatio(window.devicePixelRatio)
    setRendererDimensions()

    scene.add(...getLights())
    scene.add(floor())
    loadSkybox(scene)

    readyHook.trigger({ clock, cameraControls, renderer, scene, camera })
  }

  // tryOnMounted(() => {
  //   initThree(unrefElement(canvasRef))
  // })

  return {
    initThree,
    onThreeReady: readyHook.on,
  }
}
