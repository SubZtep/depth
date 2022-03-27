import { ReactiveController, ReactiveControllerHost } from "lit"
import type { CanvasStatem, StartLoopingReturn } from "@depth/canvas"
import type { DCanvas } from "./d-canvas"
import type Store from "@depth/statem"
import { startLooping } from "@depth/canvas"
import { Ref } from "lit/directives/ref"

export class CanvasController implements ReactiveController {
  host: ReactiveControllerHost & DCanvas
  private canvasRef!: Ref<HTMLCanvasElement>
  private statem!: Store<CanvasStatem> & CanvasStatem
  private startCallback: (props: StartLoopingReturn) => void

  constructor(
    host: ReactiveControllerHost & DCanvas,
    canvasRef: Ref<HTMLCanvasElement>,
    statem: Store<CanvasStatem> & CanvasStatem,
    startCallback: (props: StartLoopingReturn) => void
  ) {
    this.host = host
    this.canvasRef = canvasRef
    this.statem = statem
    this.startCallback = startCallback
    this.host.addController(this)
  }

  hostUpdated() {
    if (this.statem.running) {
      const detail = startLooping({ canvas: this.canvasRef.value, statem: this.statem })
      this.startCallback(detail)
    }
  }
}
