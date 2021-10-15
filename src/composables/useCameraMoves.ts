import type CameraControls from "camera-controls"
import { MathUtils } from "three"

export default function useCameraMoves() {
  const moves = (cameraControls: CameraControls) => (idx: number) => {
    switch (idx) {
      case 1:
        cameraControls.rotate(45 * MathUtils.DEG2RAD, 0, true)
        break
      case 2:
        cameraControls.rotate(-90 * MathUtils.DEG2RAD, 0, true)
        break
      case 3:
        cameraControls.rotate(0, 20 * MathUtils.DEG2RAD, true)
        break
      case 4:
        cameraControls.truck(6, 0, true)
        break
      case 5:
        cameraControls.truck(0, 9, true)
        break
      case 6:
        cameraControls.truck(-6, -9, true)
        break
      case 7:
        cameraControls.dolly(6, true)
        break
      case 8:
        cameraControls.dolly(-9, true)
        break
    }
  }

  const count = 8

  return {
    moves,
    count,
  }
}
