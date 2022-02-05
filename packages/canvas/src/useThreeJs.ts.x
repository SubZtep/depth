import { debouncedWatch, useWindowSize } from "@vueuse/core"
import * as THREE from "three"

export default function (canvas: HTMLCanvasElement) {
  const { width, height } = useWindowSize()

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
    logarithmicDepthBuffer: true,
  })
  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const camera = new THREE.PerspectiveCamera(69, undefined, 0.01, 1000)

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

  return {
    renderer,
    camera,
  }
}
