import type CameraControls from "camera-controls"
import { useIdle, whenever } from "@vueuse/core"
import { CameraShake } from "./camerashake"
import { Box3, Vector3 } from "three"
// import { Box3, Vector3 } from "camera-controls"

export type CameraBoundary = "Full" | "Simple" | "Off"
const boundaryBox = new Box3(new Vector3(-100, 2, -100), new Vector3(100, 2, 100))
const emptyBox = new Box3(new Vector3(-Infinity, -Infinity, -Infinity), new Vector3(Infinity, Infinity, Infinity))

export function setupBoundaries(cameraControls: CameraControls, boundary: CameraBoundary = "Full") {
  if (boundary === "Off") {
    // defaults
    cameraControls.minDistance = 0
    cameraControls.maxDistance = Infinity
    cameraControls.dollySpeed = 1.0
    cameraControls.polarRotateSpeed = 1.0
    cameraControls.azimuthRotateSpeed = 1.0
    cameraControls.dampingFactor = 0.05
    cameraControls.setBoundary(emptyBox)
  } else {
    if (boundary === "Full") {
      const halfPi = Math.PI / 2
      cameraControls.minPolarAngle = halfPi
      cameraControls.maxPolarAngle = halfPi
      cameraControls.polarAngle = halfPi
    } else if (boundary === "Simple") {
      cameraControls.minPolarAngle = Math.PI / 6
      cameraControls.maxPolarAngle = Math.PI / 1.4
    }
    cameraControls.minDistance = 1
    cameraControls.maxDistance = 200
    cameraControls.dollySpeed = 0.5
    cameraControls.polarRotateSpeed = 0.6
    cameraControls.azimuthRotateSpeed = 0.8
    cameraControls.dampingFactor = 0.069
    cameraControls.setBoundary(boundaryBox)
  }
}

let shaker = 0
const shakes: CameraShake[] = []

function initShakes(cameraControls: CameraControls) {
  shakes
    .push
    // new CameraShake(cameraControls, 500, 10, 0.5),
    // new CameraShake(cameraControls, 1000, 10, 1),
    // new CameraShake(cameraControls, 5000, 2, 0.5)
    ()
}

function shakeIt(nr?: number) {
  shakes[nr ?? shaker++ % shakes.length]?.shake()
}

export function useCameraControls(cameraControls: CameraControls) {
  initShakes(cameraControls)
  setupBoundaries(cameraControls)

  const { idle } = useIdle()
  whenever(idle, shakeIt)

  shakeIt() // FIXME: shouldn't be necessary for able to move camera in the beginning
}
