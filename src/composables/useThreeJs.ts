import type { MaybeRef } from "@vueuse/core"
import CameraControls from "camera-controls"
import Stats from "stats.js"
import * as THREE from "three"
import { Clock, Scene, WebGLRenderer, PerspectiveCamera } from "three"
import { onMounted, watch } from "vue"
import { unrefElement } from '@vueuse/core'
import { debouncedWatch, useWindowSize, useToggle, get, set, useCssVar } from "@vueuse/core"
import { getLights } from "../models/light"
import { floor } from "../models/floor"

export const tickFns = new Set<PrFn>()
export const scene = new Scene()
let renderer: THREE.WebGLRenderer
let cameraControls: CameraControls

export function useThreeJs(threeHook?: EventHook<ThreeCtrlEvent>) {
  CameraControls.install({ THREE: THREE }) // TODO: tree shaking
  const { width, height } = useWindowSize()
  const clock = new Clock()
  let canvas: MaybeRef<HTMLCanvasElement>

  const initRenderer = () => {
    renderer = new WebGLRenderer({
      canvas: unrefElement(canvas),
      premultipliedAlpha: false,
      antialias: true,
    })
    renderer.setPixelRatio(window.devicePixelRatio)
  }
  const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500)

  const [isRunning, toggleRun] = useToggle()

  const stats = new Stats()
  // stats.showPanel(2)
  stats.dom.classList.add("stats")
  document.body.appendChild(stats.dom)

  // @ts-ignore
  // threeHook?.on(({ cmd }: ThreeCtrlEvent) => this[cmd]())
  
  // threeHook?.on(({ cmd }: ThreeCtrlEvent) => {
  //   isLoop = cmd === "resume"
  //   //this[cmd]()
  // })


  // const stats = inject<Stats>("stats")
  let delta: number

  const gameLoop = async () => {
    delta = clock.getDelta()
    cameraControls.update(delta)

    tickFns.forEach(async fn => await fn())

    renderer.render(scene, camera)
    stats.update()

    if (get(isRunning)) {
      requestAnimationFrame(gameLoop)
    }
  }

  const runOp = useCssVar("--runop")
  watch(isRunning, (will, was) => {
    if (will && !was) {
      set(runOp, "1")
      requestAnimationFrame(gameLoop)
    } else {
      set(runOp, "0.5")
    }
  })

  // const { pause, resume } = useRafFn(gameLoop, { immediate: false })
  // const loopCtrl = useRafFn(gameLoop, { immediate: false })
  // const loopCtrl = useRafFn(await () => gameLoop())

  // const { pause, resume } = useRafFn(async () => {
  //   await gameLoop()
  // }, { immediate: false })

  onMounted(async () => {
    initRenderer()
    cameraControls = new CameraControls(camera, renderer.domElement)
    cameraControls.setPosition(0, 2, 10)
    // useSceneCam(cameraControls)
    // await loadSkybox(scene)
    scene.add(...getLights())
    scene.add(floor())
    // await gameLoop()
    // initFn()
    debouncedWatch(
      [width, height],
      ([w, h]) => {
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      },
      { immediate: true, debounce: 250 }
    )
  })

  // @ts-ignore
  // threeHook?.on(({ cmd }: ThreeCtrlEvent) => this[cmd]())

  return {
    setCanvas: (c: MaybeRef<HTMLCanvasElement>) => canvas = c,
    isRunning,
    toggleRun,
  }
}
