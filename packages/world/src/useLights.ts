import { AmbientLight, DirectionalLight } from "@depth/three.js"

export function useLights() {
  const ambientLight = new AmbientLight(0x00ff00, 0.2)
  ambientLight.layers.enableAll()

  const directionalLight = new DirectionalLight(0xffffcc, 0.8)
  directionalLight.layers.enableAll()
  directionalLight.position.set(0, 10, 0)
  directionalLight.rotateZ(Math.PI / 4)
  // directionalLight.rotation.set(0, 1.6, -30)
  directionalLight.castShadow = true
  // dirLight.target.position.set(-5, 0, 0)

  directionalLight.shadow.mapSize.width = 512 // default
  directionalLight.shadow.mapSize.height = 512 // default
  directionalLight.shadow.camera.near = 0.5 // default
  directionalLight.shadow.camera.far = 500 // default

  return {
    ambientLight,
    directionalLight,
  }
}
