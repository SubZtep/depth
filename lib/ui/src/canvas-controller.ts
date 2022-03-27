import { ReactiveController, ReactiveControllerHost } from "lit"
import type { CanvasStatem, StartLoopingReturn } from "@depth/canvas"
import type { DCanvas } from "./d-canvas"
import type Store from "@depth/statem"
import { startLooping } from "@depth/canvas"
import * as THREE from "three"

// const scene = new THREE.Scene()
// scene.background = new THREE.Color(0xff0000)

export class CanvasController implements ReactiveController {
  host: ReactiveControllerHost & DCanvas
  private statem!: Store<CanvasStatem> & CanvasStatem
  private startCallback: (props: StartLoopingReturn) => void
  // private viewEl: Element | null = null

  inited = false

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

  // hostConnected() {
  //   if (this.host.view) {
  //     this.viewEl = document.querySelector(this.host.view)
  //   }
  // }

  // hostDisconnected() {
  //   if (this.host.view && this.viewEl && this.viewListener) {
  //     this.viewEl.removeEventListener("start", this.viewListener)
  //   }
  // }

  hostUpdated() {
    // console.log("q", this.host.view)
    const cameraView = !!this.host.view

    if (!cameraView) {
      const detail = startLooping({
        canvas: this.host.canvas,
        statem: this.statem,
        cameraView,
        // scene,
      })
      this.startCallback(detail)
    } else {
      // this.viewEl!.addEventListener("start", ({ detail: { scene } }: CustomEventInit) => {
      document.querySelector(this.host.view!)!.addEventListener("start", ({ detail: { scene } }: CustomEventInit) => {
        startLooping({ canvas: this.host.canvas, statem: this.statem, cameraView, scene })
      })
    }
  }
}
