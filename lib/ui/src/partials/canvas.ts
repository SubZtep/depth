import { ReactiveController, ReactiveControllerHost } from "lit"
import type { CanvasStatem, StartLoopingReturn } from "@depth/canvas"
import type { DCanvas } from "../d-canvas"
import type Store from "@depth/statem"
import { startLooping } from "@depth/canvas"

export class CanvasController implements ReactiveController {
  host: ReactiveControllerHost & DCanvas
  private statem!: Store<CanvasStatem> & CanvasStatem
  private startCallback: (props: StartLoopingReturn) => void

  constructor(
    host: ReactiveControllerHost & DCanvas,
    statem: Store<CanvasStatem> & CanvasStatem,
    startCallback: (props: StartLoopingReturn) => void
  ) {
    this.host = host
    this.statem = statem
    this.host.addController(this)
    this.startCallback = startCallback
  }

  hostDisconnected() {
    this.host.removeController(this)
  }

  hostUpdated() {
    const cameraView = !!this.host.view

    if (!cameraView) {
      const detail = startLooping({
        canvas: this.host.canvas,
        statem: this.statem,
        cameraView,
      })
      this.startCallback(detail)
    } else {
      document.querySelector(this.host.view!)!.addEventListener("start", ({ detail: { scene } }: CustomEventInit) => {
        startLooping({ canvas: this.host.canvas, statem: this.statem, cameraView, scene })
      })
    }
  }
}
