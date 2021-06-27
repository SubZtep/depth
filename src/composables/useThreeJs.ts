import type { Ref } from "vue"
import * as THREE from "three"
import { onMounted, inject } from "vue"
import CameraControls from "camera-controls"
import { debouncedWatch, useWindowSize, createEventHook, useRafFn, unrefElement } from "@vueuse/core"
import { useSceneCam } from "./useSceneCam"
import { loadSkybox } from "../models/skybox"
import { getLights } from "../models/light"
import { floor } from "../models/floor"

export const tickFns = new Set<PrFn>()
export const scene = new THREE.Scene()
export let renderer: THREE.WebGLRenderer
let cameraControls: CameraControls

export function useThreeJs(initFn: () => {[name: string]: any} | void): UseThreeJsReturn {
  CameraControls.install({ THREE })
  const readyHook = createEventHook<void>()
  const { width, height } = useWindowSize()
  const clock = new THREE.Clock()

  renderer = new THREE.WebGLRenderer({ antialias: true, premultipliedAlpha: false })
  const camera = new THREE.PerspectiveCamera(60, undefined, 0.1, 500)
  const stats = inject<Stats>("stats")
  let delta: number

  const objs = initFn()

  const { pause: pauseTickLoop, resume: resumeTickLoop } = useRafFn(
    async () => {
      delta = clock.getDelta()
      cameraControls.update(delta)

      tickFns.forEach(async fn => await fn())

      renderer?.render(scene, camera)
      stats?.update()
    },
    { immediate: false }
  )

  onMounted(() => {
    renderer.setPixelRatio(window.devicePixelRatio)
    document.querySelector("#app")!.parentElement!.prepend(renderer.domElement)
    cameraControls = new CameraControls(camera, renderer.domElement)
    cameraControls.setPosition(0, 2, 10)
    // useSceneCam(cameraControls)

    loadSkybox(scene)
    scene.add(...getLights())
    scene.add(floor())
    // readyHook.trigger()

    resumeTickLoop()
  })

  debouncedWatch(
    [width, height],
    ([w, h]) => {
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer?.setSize(w, h)
    },
    { immediate: true, debounce: 250 }
  )

  return {
    tickFns,
    pauseTickLoop,
    resumeTickLoop,
    onThreeReady: readyHook.on,
  }
}

/*
import type { Ref } from "vue"
import * as THREE from "three"
import { onMounted, inject } from "vue"
import CameraControls from "camera-controls"
import { debouncedWatch, useWindowSize, createEventHook, useRafFn, unrefElement } from "@vueuse/core"
import { useSceneCam } from "./useSceneCam"
import { loadSkybox } from "../models/skybox"
import { getLights } from "../models/light"
import { floor } from "../models/floor"

export const tickFns = new Set<PrFn>()
export const scene = new THREE.Scene()
export let renderer: THREE.WebGLRenderer
let cameraControls: CameraControls

export function useThreeJs(canvasRef: Ref<HTMLCanvasElement | undefined>): UseThreeJsReturn {
  CameraControls.install({ THREE })
  const readyHook = createEventHook<void>()
  const { width, height } = useWindowSize()
  const clock = new THREE.Clock()
  const camera = new THREE.PerspectiveCamera(60, undefined, 0.1, 500)
  const stats = inject<Stats>("stats")
  let delta: number

  const { pause: pauseTickLoop, resume: resumeTickLoop } = useRafFn(
    async () => {
      delta = clock.getDelta()
      stats?.begin()
      cameraControls.update(delta)

      tickFns.forEach(async fn => await fn())

      stats?.end()
      renderer?.render(scene, camera)
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
    readyHook.trigger()
  })

  debouncedWatch(
    [width, height],
    ([w, h]) => {
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer?.setSize(w, h)
    },
    { immediate: true, debounce: 250 }
  )

  return {
    tickFns,
    pauseTickLoop,
    resumeTickLoop,
    onThreeReady: readyHook.on,
  }
}

*/