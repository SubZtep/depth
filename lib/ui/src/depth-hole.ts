import "./canvas-toolbar"
import { v4 as uuidv4 } from "uuid"
import { stateMake } from "@depth/statem"
import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { when } from "lit/directives/when.js"
import { guard } from "lit/directives/guard.js"
import { ref } from "lit/directives/ref.js"
import { statem } from "@depth/statem"
import { CanvasToolbar } from "./canvas-toolbar"
import { startLooping, stopLooping, exec3D, loop3D } from "@depth/canvas"
import { styleMap } from "lit/directives/style-map.js"

// import { canvasState } from "@depth/statem"
// import { v4 as uuidv4 } from "uuid"

// const uuid = uuidv4()

// const state = canvasState
// const canvasState = stateMake({
//   running: false,
//   offscreen: false,
//   fps: 60,
// })

@customElement("depth-hole")
export class DepthHole extends LitElement {
  @property({ type: Number })
  index!: number

  @property()
  uuid = uuidv4()
  // uuid: string = stateMake({
  //   running: false,
  //   offscreen: false,
  //   fps: 60,
  // })

  @property({ attribute: false, noAccessor: true })
  state: any = stateMake(
    {
      running: false,
      offscreen: false,
      fps: 60,
    },
    this.uuid
  )

  // @property({ attribute: false, noAccessor: true })
  // state = canvasState

  // @property({ attribute: false, noAccessor: true })
  // state = stateMake({
  //   running: false,
  //   offscreen: false,
  //   fps: 60,
  // })

  constructor() {
    super()
    this.state.subscribe(v => this.requestUpdate("state", v))
  }

  static styles = css`
    .wrapper {
      background-image: repeating-conic-gradient(from 0deg, #fff 0deg 90deg, #d3d4d6 90deg 180deg);
      background-size: 1rem 1rem;
      /* overflow: hidden; */
      width: 100%;
      height: 100%;
      /* canvas {
        width: inherit;
        height: inherit;
      } */
    }
  `

  async blala(canvas?: any) {
    console.log("BLALA", canvas.width)
    if (canvas) {
      await startLooping({ canvas, offscreen: this.state.offscreen })
    } else {
      stopLooping()
    }
  }

  render() {
    // ${guard([this.state.running], () => uuidv4())}
    return html`<div class="wrapper">
      <canvas-toolbar uuid=${this.uuid}></canvas-toolbar>
      ${when(
        this.state.running,
        // () => html`<canvas ${ref(this.blala)}></canvas>`
        () => html`<canvas ${ref(this.blala)} style="${styleMap({ width: "100%", height: "100%" })}"></canvas>`
      )}
    </div>`
  }
}
