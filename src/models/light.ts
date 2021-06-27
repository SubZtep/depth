import { AmbientLight, DirectionalLight } from "three"

export function getLights() {
  const ambient = new AmbientLight(0x222222)
  const directional = new DirectionalLight(0xffffff, 1)
  directional.position.set(80, 80, -80)
  return [ambient, directional]
}
