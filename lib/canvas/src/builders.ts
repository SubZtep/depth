import * as THREE from "three"

export function createRenderer(canvasRef: InitMessage["canvasRef"]) {
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    powerPreference: "high-performance",
    logarithmicDepthBuffer: true,
  })
  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  return renderer
}
