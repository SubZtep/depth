import * as THREE from "three"
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js"

export function useControl(camera: THREE.Camera, canvas?: HTMLElement) {
  const controls = new FlyControls(camera, canvas)
  controls.movementSpeed = 3
  controls.rollSpeed = 0.2
  controls.dragToLook = true
  controls.autoForward = false
  return controls
}
