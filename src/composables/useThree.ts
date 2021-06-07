import * as THREE from "three"
import type { Ref } from "vue"
import { ref } from "vue"
import { invoke, until, debouncedWatch, useWindowSize, createEventHook, get } from "@vueuse/core"
import { useSkybox } from "../composables/useSkybox"
import { useFloor } from "../composables/useFloor"
import CameraControls from "camera-controls"

export function useThree(canvasRef: Ref<HTMLCanvasElement | undefined>) {
  let scene: THREE.Scene
  let camera: THREE.PerspectiveCamera
  let renderer: THREE.WebGLRenderer
  let cameraControls: CameraControls

  const { width, height } = useWindowSize()

  const clock = new THREE.Clock()
  CameraControls.install({ THREE: THREE })

  const skybox = ref(3)

  const setDimensions = () => {
    renderer.setSize(width.value, height.value)
    camera.aspect = width.value / height.value
    camera.updateProjectionMatrix()
  }

  debouncedWatch([width, height], setDimensions, { immediate: false, debounce: 500 })

  const threeHook = createEventHook<ThreeProps>()

  const initThree = (canvas: HTMLCanvasElement) => {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(60, undefined, 0.1, 500)
    camera.position.set(50, 20, 50)
    cameraControls = new CameraControls(camera, canvas)
    renderer = new THREE.WebGLRenderer({ premultipliedAlpha: false, precision: "lowp", canvas })
    setDimensions()

    scene.add(useFloor())
    useSkybox(scene, skybox)

    threeHook.trigger({ clock, cameraControls, renderer, scene, camera })
  }

  invoke(async () => {
    await until(canvasRef).not.toBeUndefined()
    initThree(get(canvasRef)!)
  })

  return {
    onThree: threeHook.on,
    skybox,
  }
}
