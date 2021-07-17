import type CameraControls from "camera-controls"
import { useIdle, whenever } from "@vueuse/core"
import { CameraShake } from "../../models/camerashake"
import { useActiveRoute, useOnRouterEvent } from "../router/plugin"
import { Box3, Vector3 } from "three"
// import { useGui } from "../datGUI/plugin"

function setupBoundaries(cameraControls: CameraControls) {
  cameraControls.minPolarAngle = Math.PI / 6
  cameraControls.maxPolarAngle = Math.PI / 1.95
  cameraControls.minDistance = 1
  cameraControls.maxDistance = 200
  cameraControls.dollySpeed = 0.5
  cameraControls.polarRotateSpeed = 0.6
  cameraControls.azimuthRotateSpeed = 0.8
  cameraControls.dampingFactor = 0.35
  cameraControls.setBoundary(new Box3(new Vector3(-100, 2, -100), new Vector3(100, 2, 100)))
}

let shaker = 0
const shakes: CameraShake[] = []

function initShakes(cameraControls: CameraControls) {
  shakes.push(
    new CameraShake(cameraControls, 500, 10, 0.5),
    new CameraShake(cameraControls, 1000, 10, 1),
    new CameraShake(cameraControls, 5000, 2, 0.5)
  )
}

function shakeIt(nr?: number) {
  shakes[nr ?? shaker++ % shakes.length].shake()
}

function startPosition(cameraControls: CameraControls) {
  const startRoute = useActiveRoute()
  if (startRoute && startRoute.position && startRoute.lookAt) {
    cameraControls.setLookAt(...startRoute.position, ...startRoute.lookAt, false)
  } else {
    cameraControls.setPosition(0, 2, 0, false)
  }
}

export function useCameraControls(cameraControls: CameraControls) {
  initShakes(cameraControls)
  setupBoundaries(cameraControls)
  startPosition(cameraControls)

  const { idle } = useIdle()
  whenever(idle, shakeIt)

  // const gui = useGui()

  const arrived = () => {
    {
      cameraControls.removeEventListener("sleep", arrived)
      // cameraControls.enabled = true
      // gui.show()
    }
  }

  useOnRouterEvent(({ position, lookAt, transition }) => {
    if (position && lookAt) {
      // gui.hide()
      // cameraControls.enabled = false
      cameraControls.setLookAt(...position, ...lookAt, transition)
      cameraControls.addEventListener("sleep", arrived)
    }
  })

  shakeIt() // FIXME: shouldn't be necessary for able to move camera in the beginning
}
