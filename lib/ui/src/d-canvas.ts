import { v4 as uuidv4 } from "uuid"
import { stateMake } from "@depth/statem"
import { LitElement, html, css } from "lit"
import { customElement, property, query } from "lit/decorators.js"
import { classMap } from "lit/directives/class-map.js"
import type { CanvasStatem, StartLoopingReturn } from "@depth/canvas"
import type Store from "@depth/statem"
import { Resizer, styles as resizerStyles } from "./resizer"
import "./d-toolbar"
import "./d-icon"
import { CanvasController } from "./canvas-controller"

/** 3D canvas element. */
@customElement("d-canvas")
export class DCanvas extends Resizer(LitElement) {
  @query(":host > canvas", false) canvas!: HTMLCanvasElement

  // private canvasRef!: Ref<HTMLCanvasElement>
  private canvasCtrl!: CanvasController

  /** Start rendering immediately. */
  @property({ type: Boolean }) autoplay = false

  /** Run rendering in web worker. */
  @property({ type: Boolean }) offscreen = false

  /** Statem Id. */
  @property({ type: String }) sid = uuidv4()

  /** Selector for the main `d-canvas` element. */
  @property({ type: String }) view?: string

  private statem!: Store<CanvasStatem> & CanvasStatem

  private createState() {
    this.statem = stateMake<CanvasStatem>(
      {
        running: this.autoplay,
        offscreen: this.offscreen,
        fps: Number.POSITIVE_INFINITY,
        width: this.clientWidth,
        height: this.clientHeight,
      },
      this.sid
    )

    this.statem.subscribe((state) => {
      this.requestUpdate("state", state)
    })
  }

  connectedCallback() {
    super.connectedCallback()
    this.createState()

    this.canvasCtrl = new CanvasController(this, this.statem, (detail) => {
      /** Fires when the 3D canvas start rendering. */
      this.dispatchEvent(
        new CustomEvent<StartLoopingReturn>("start", {
          bubbles: false,
          cancelable: false,
          composed: true,
          detail,
        })
      )
    })
  }

  static styles = [
    resizerStyles,
    css`
      :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      /* :host > canvas {
        width: inherit;
        height: inherit;
      } */
    `,
  ]

  render() {
    return html`
      <d-toolbar ?shifted=${!this.autoplay}>
        <button @click=${this.startRunning} ?disabled=${this.statem.running}>
          <d-icon name="play"></d-icon>
        </button>
        <button @click=${this.stopRunning} ?disabled=${!this.statem.running}>
          <d-icon name="stop"></d-icon>
        </button>
        <label class=${classMap({ disabled: this.statem.running })}>
          Offscreen
          <input
            type="checkbox"
            .checked=${this.statem.offscreen}
            ?disabled=${this.statem.running}
            @change=${this.updateOffscreen}
          />
        </label>
        <label>
          FPS ${this.statem.fps === Number.POSITIVE_INFINITY ? "∞" : this.statem.fps}
          <br />
          <input
            type="range"
            min="0"
            max="61"
            .value=${String(this.statem.fps === Number.POSITIVE_INFINITY ? 61 : this.statem.fps)}
            @input=${this.updateFps}
          />
        </label>
      </d-toolbar>
      <canvas class=${this.view ?? "mennyehaza"}></canvas>
    `
  }

  /** Create a canvas and start rendering. */
  startRunning() {
    this.statem.running = true
  }

  /** Stop rendering and destroy canvas. */
  stopRunning() {
    this.statem.running = false
  }

  protected updateOffscreen({ target: { checked } }) {
    this.statem.offscreen = checked
  }

  protected updateFps({ srcElement: { valueAsNumber } }) {
    this.statem.fps = valueAsNumber === 61 ? Number.POSITIVE_INFINITY : valueAsNumber
  }
}
