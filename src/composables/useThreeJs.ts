import type { Ref } from "vue"
import { onMounted, inject } from "vue"
import * as THREE from "three"
import CameraControls from "camera-controls"
import { debouncedWatch, useWindowSize, createEventHook, useRafFn, unrefElement } from "@vueuse/core"
import { useSceneCam } from "./useSceneCam"
import { loadSkybox } from "../models/skybox"
import { getLights } from "../models/light"
import { floor } from "../models/floor"

const scene = new THREE.Scene()

export const tickFns = new Set<TickLoopFn>()

export function useThreeJs(canvasRef?: Ref<HTMLCanvasElement | undefined>): typeof canvasRef extends undefined ? void : any {
  if (canvasRef === undefined) {
    return {
      scene,
    }
  }

  CameraControls.install({ THREE })
  const readyHook = createEventHook<ThreeJsObjects>()
  const { width, height } = useWindowSize()
  const clock = new THREE.Clock()

  const camera = new THREE.PerspectiveCamera(60, undefined, 0.1, 500)
  let renderer: THREE.WebGLRenderer
  let cameraControls: CameraControls
  let tickLoopCb: TickLoopFn | undefined = undefined
  const tickLoop = (fn: TickLoopFn) => (tickLoopCb = fn)
  const stats = inject<Stats>("stats")
  let delta: number

  const { pause: pauseTickLoop, resume: resumeTickLoop } = useRafFn(
    async () => {
      delta = clock.getDelta()
      stats?.begin()
      cameraControls.update(delta)
      if (typeof tickLoopCb === "function") {
        await tickLoopCb({ scene, cameraControls })
      }

      stats?.end()
      renderer.render(scene, camera)
    },
    { immediate: false }
  )

  onMounted(() => {
    const canvas = unrefElement(canvasRef)
    renderer = new THREE.WebGLRenderer({ premultipliedAlpha: false, precision: "lowp", canvas })
    renderer.setPixelRatio(window.devicePixelRatio)

    cameraControls = new CameraControls(camera, canvas)
    cameraControls.setPosition(0, 2, 10)
    useSceneCam(cameraControls)

    loadSkybox(scene)
    scene.add(...getLights())
    scene.add(floor())
    readyHook.trigger({ scene })
  })

  debouncedWatch(
    [width, height],
    ([w, h]) => {
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    },
    { immediate: true, debounce: 250 }
  )

  return {
    scene,
    tickFns,
    tickLoop,
    pauseTickLoop,
    resumeTickLoop,
    onThreeReady: readyHook.on,
  }
}
