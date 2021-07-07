import type CameraControls from "camera-controls"
import type { EventHook } from "@vueuse/core"
import { MathUtils } from "three"
import { inject } from "vue"
import { CameraShake } from "../models/camerashake"

export function useCameraControls(cameraControls: CameraControls) {
  let shaker = 0
  const shakes = [
    new CameraShake(cameraControls, 500, 10, 0.5),
    new CameraShake(cameraControls, 1000, 10, 1),
    new CameraShake(cameraControls, 5000, 2, 0.5),
  ]

  inject<EventHook<RouterEvent>>("routerHook")?.on(({ position, lookAt, enableTransition }) => {
    cameraControls.setLookAt(...position, ...lookAt, enableTransition)
  })

  inject<EventHook<GUIEvent.Camera>>("cameraHook")?.on(({ cmd, go }) => {
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
