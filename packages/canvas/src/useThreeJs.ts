import { debouncedWatch, useWindowSize } from "@vueuse/core"
import CameraControls from "camera-controls"
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera"
import { PCFSoftShadowMap, sRGBEncoding } from "three/src/constants"

export default function (canvas: HTMLCanvasElement) {
  const { width, height } = useWindowSize()

  const renderer = new WebGLRenderer({ canvas, powerPreference: "high-performance", antialias: true })
  renderer.outputEncoding = sRGBEncoding
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap

  const camera = new PerspectiveCamera(60, undefined, 0.01, 1000)
  const cameraControls = new CameraControls(camera, canvas)
  cameraControls.setPosition(0, 2, 5, false)

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
    cameraControls,
  }
}
