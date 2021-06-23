import { inject } from "vue"
import * as THREE from "three"
import type { EventHook } from "@vueuse/core"
import type CameraControls from "camera-controls"
import { CameraShake } from "../models/camerashake"

export function useSceneCam(cameraControls: CameraControls) {
  const shakes = [
    new CameraShake(cameraControls, 500, 10, 0.5),
    new CameraShake(cameraControls, 1000, 10, 1),
    new CameraShake(cameraControls, 5000, 2, 0.5),
  ]
  let shaker = 0

  inject<EventHook<GUIEventold.Camera>>("cameraHook")?.on(({ cmd }) => {
    switch (cmd) {
      case "rotate":
        cameraControls.rotate(0, 20 * THREE.MathUtils.DEG2RAD, true)
        break
      case "shake":
        shakes[shaker++ % shakes.length].shake()
        break
    }
  })
}
