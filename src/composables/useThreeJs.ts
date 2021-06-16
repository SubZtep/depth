import type { Ref } from "vue"
import { debouncedWatch, useWindowSize, createEventHook, useRafFn, get } from "@vueuse/core"
import CameraControls from "camera-controls"
import * as THREE from "three"
import { onMounted } from "vue"
import { floor } from "../models/floor"
import { getLights } from "../models/light"
import { loadSkybox } from "../models/skybox"

type TickLoopFn = (params: { scene: THREE.Scene; cameraControls: CameraControls }) => void

export function useThreeJs(canvasRef: Ref<HTMLCanvasElement | undefined>) {
  CameraControls.install({ THREE: THREE })

  const readyHook = createEventHook<ThreeJsObjects>()
  const { width, height } = useWindowSize()
  const clock = new THREE.Clock()

  let scene: THREE.Scene
  let renderer: THREE.WebGLRenderer
  let camera: THREE.PerspectiveCamera
  let cameraControls: CameraControls

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

  let framecb: TickLoopFn | undefined
  const tickLoop = (fn: TickLoopFn) => (framecb = fn)

  const { pause, resume } = useRafFn(
    () => {
      const delta = clock.getDelta()
      cameraControls.update(delta)
      if (framecb) {
        framecb({ scene, cameraControls })
      }
      renderer.render(scene, camera)
    },
    { immediate: false }
  )

  onMounted(() => {
    const canvas = get(canvasRef)!

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(60, undefined, 0.1, 500)
    cameraControls = new CameraControls(camera, canvas)
    cameraControls.setPosition(0, 2, -20)

    renderer = new THREE.WebGLRenderer({ premultipliedAlpha: false, precision: "lowp", canvas })
    renderer.setPixelRatio(window.devicePixelRatio)
    setRendererDimensions()

    scene.add(...getLights())
    scene.add(floor())
    loadSkybox(scene)

    readyHook.trigger({ clock, cameraControls, renderer, scene, camera, resume })
  })

  return {
    tickLoop,
    onThreeReady: readyHook.on,
  }
}
