import type { CanvasStatem, StartLoopingReturn } from "@depth/canvas"
import type { Ref } from "lit/directives/ref.js"
import type Store from "@depth/statem"
import { v4 as uuidv4 } from "uuid"
import { LitElement, html, css } from "lit"
import { ref, createRef } from "lit/directives/ref.js"
import { customElement, property } from "lit/decorators.js"
import { Resizer, styles as resizerStyles } from "./partials/resizer"
import { classMap } from "lit/directives/class-map.js"
import { CanvasController } from "./partials/canvas"
import { stateMake } from "@depth/statem"
import "./d-toolbar"
import "./d-icon"

/** 3D canvas element. */
@customElement("d-canvas")
export class DCanvas extends Resizer(LitElement) {
  // @query(":host > canvas", false) canvas!: HTMLCanvasElement
  canvasRef: Ref = createRef<HTMLCanvasElement>()

  private canvasCtrl!: CanvasController

  /** Start rendering immediately. */
  @property({ type: Boolean }) autoplay = false

  /** Run rendering in web worker. */
  @property({ type: Boolean }) offscreen = false

  /** Statem Id. */
  @property({ type: String, reflect: false }) sid = uuidv4()

  /** CSS(like) Selector for the main `d-canvas` element, this one is a helper view. */
  @property({ type: String }) view?: string

  /** Camera position in view mode. */
  @property({ type: Array, attribute: "camera-position" }) cameraPosition?: [number, number, number]

  private statem!: Store<CanvasStatem> & CanvasStatem

  get cameraView() {
    return !!this.view
  }

  private createState() {
    this.statem = stateMake<CanvasStatem>(
      {
        running: this.autoplay,
        offscreen: this.offscreen,
        fps: Number.POSITIVE_INFINITY,
        width: this.clientWidth,
        height: this.clientHeight,
        // scene: this.view ? undefined : new THREE.Scene().toJSON(),
        cameraPosition: this.cameraPosition,
      },
      this.sid
    )

    this.statem.subscribe((state, old) => {
      if (
        state.width !== old.width ||
        state.height !== old.height ||
        state.fps !== old.fps ||
        state.running !== old.running ||
        state.offscreen !== old.offscreen
      ) {
        this.requestUpdate("state", state)
      }
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

  toolbarTemplate() {
    return html`
      <d-toolbar ?shifted=${!this.autoplay}>
        <button @click=${() => (this.statem.running = true)} ?disabled=${this.statem.running}>
          <d-icon name="play"></d-icon>
        </button>
        <button @click=${() => (this.statem.running = false)} ?disabled=${!this.statem.running}>
          <d-icon name="stop"></d-icon>
        </button>
        <label class=${classMap({ disabled: this.statem.running })}>
          Offscreen
          <input
            type="checkbox"
            .checked=${this.statem.offscreen}
            ?disabled=${this.statem.running}
            @change=${({ target: { checked } }) => (this.statem.offscreen = checked)}
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
            @input=${({ srcElement: { valueAsNumber } }) =>
              (this.statem.fps = valueAsNumber === 61 ? Number.POSITIVE_INFINITY : valueAsNumber)}
          />
        </label>
      </d-toolbar>
    `
  }

  canvasTemplate() {
    return html`<canvas ${ref(this.canvasRef)}></canvas>`
  }

  render() {
    return html` ${this.cameraView ? "" : this.toolbarTemplate()} ${this.canvasTemplate()} `
  }
}
