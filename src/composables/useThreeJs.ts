import { ref, Ref } from "vue"
import { debouncedWatch, useWindowSize, createEventHook, useRafFn, get } from "@vueuse/core"
import CameraControls from "camera-controls"
import * as THREE from "three"
import { onMounted } from "vue"
import { floor } from "../models/floor"
import { getLights } from "../models/light"
import { loadSkybox } from "../models/skybox"
import Stats from "stats.js"

// type TickLoopFn = (params: { scene: THREE.Scene; cameraControls: CameraControls, pause: Fn, resume: Fn }) => Promise<void>
type TickLoopFn = (params: { scene: THREE.Scene; cameraControls: CameraControls }) => Promise<void>
// export const ready = ref(false)

// export let scene: THREE.Scene | null = null
// export let pauseTickLoop: Fn
// export let resumeTickLoop: Fn | null = null
// export let resumeTickLoop: Fn

export function useThreeJs(canvasRef: Ref<HTMLCanvasElement | undefined>) {
  CameraControls.install({ THREE: THREE })

  const readyHook = createEventHook<ThreeJsObjects>()
  const { width, height } = useWindowSize()
  const clock = new THREE.Clock()
  const stats = new Stats()

  const ready = ref(false)

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

  const { pause: pauseTickLoop, resume: resumeTickLoop } = useRafFn(
    async () => {
      if (scene === null) return
      const delta = clock.getDelta()
      stats.begin()
      cameraControls.update(delta)
      if (framecb) {
        await framecb({ scene, cameraControls })
      }
      stats.end()
      renderer.render(scene, camera)
    },
    { immediate: false }
  )

  onMounted(() => {
    document.body.appendChild(stats.dom)
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

    readyHook.trigger({ scene })
    ready.value = true
  })

  return {
    ready,
    tickLoop,
    pauseTickLoop,
    resumeTickLoop,
    onThreeReady: readyHook.on,
  }
}
