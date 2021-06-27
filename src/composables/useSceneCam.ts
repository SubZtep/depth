import { MathUtils } from "three"
import { inject } from "vue"
import { CameraShake } from "../models/camerashake"

export function useSceneCam(cameraControls: CameraControls) {
  const shakes = [
    new CameraShake(cameraControls, 500, 10, 0.5),
    new CameraShake(cameraControls, 1000, 10, 1),
    new CameraShake(cameraControls, 5000, 2, 0.5),
  ]
  let shaker = 0

  inject<EventHook<GUIEvent.Camera>>("cameraHook")?.on(({ cmd }) => {
    switch (cmd) {
      case "rotate":
        cameraControls.rotate(0, 20 * MathUtils.DEG2RAD, true)
        break
      case "shake":
        shakes[shaker++ % shakes.length].shake()
        break
    }
  })
}
