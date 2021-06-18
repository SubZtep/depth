import type { Ref, } from "vue"
import type { EventHook } from "@vueuse/core"
import { onMounted, inject } from "vue"
import * as THREE from "three"
import CameraControls from "camera-controls"
import { debouncedWatch, useWindowSize, createEventHook, useRafFn, unrefElement } from "@vueuse/core"
import { useCameraControls } from "./useCameraControls"
import { loadSkybox } from "../models/skybox"
import { getLights } from "../models/light"
import { floor } from "../models/floor"

export function useThreeJs(canvasRef: Ref<HTMLCanvasElement | undefined>) {
  CameraControls.install({ THREE })
  const readyHook = createEventHook<ThreeJsObjects>()
  const { width, height } = useWindowSize()
  const clock = new THREE.Clock()

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, undefined, 0.1, 500)
  let renderer: THREE.WebGLRenderer
  let cameraControls: CameraControls

  inject<EventHook<PileEvent>>("pileHook")?.on(({ event, pile }) => {
    switch(event) {
      case "add":
        scene.add(pile.rootGroup)
        break
      case "delete":
        scene.remove(pile.rootGroup)
        break
    }
  })

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
    useCameraControls(cameraControls)

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
    tickLoop,
    pauseTickLoop,
    resumeTickLoop,
    onThreeReady: readyHook.on,
  }
}
