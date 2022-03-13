import * as THREE from "three"

export function createRenderer({ canvas }: { canvas: InitMessage["canvas"] }) {
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
  return renderer
}

export function createCamera({ width, height }: { width: number; height: number }) {
  const camera = new THREE.PerspectiveCamera(90, width / height, 1, 2000)
  camera.position.z = 100
  return camera
}

export function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x666600)
  return scene
}
