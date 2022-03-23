import { v4 as uuidv4 } from "uuid"
import { stateMake } from "@depth/statem"
import { LitElement, html, css } from "lit"
import { customElement, property } from "lit/decorators.js"
import { when } from "lit/directives/when.js"
import { ref } from "lit/directives/ref.js"
import { startLooping } from "@depth/canvas"
import { debounce } from "@depth/misc"
import type { RefOrCallback } from "lit/directives/ref.js"
import type { CanvasStatem, StartLoopingReturn } from "@depth/canvas"
import type Store from "@depth/statem"
import "./d-toolbar"
import "./d-icon"

const resize = new ResizeObserver(
  debounce((entries) => {
    for (const entry of entries) {
      entry.target.resizeCallback(entry)
    }
  })
)

/** 3D canvas element. */
@customElement("d-canvas")
export class DCanvas extends LitElement {
  /** Start rendering immediately. */
  @property({ type: Boolean }) autoplay = false

  /** Run rendering in web worker. */
  @property({ type: Boolean }) offscreen = false

  /** Statem Id. */
  @property({ type: String }) sid = uuidv4()

  protected statem!: Store<CanvasStatem> & CanvasStatem

  protected resizeCallback({ contentBoxSize: [{ blockSize, inlineSize }] }: ResizeObserverEntry) {
    this.statem.patch({
      width: inlineSize,
      height: blockSize,
    })
  }

  protected startStop: RefOrCallback = (canvas?: any) => {
    if (canvas) {
      const detail = startLooping({ canvas, statem: this.statem })

      /** Fires when the 3D canvas start rendering. */
      this.dispatchEvent(
        new CustomEvent<StartLoopingReturn>("start", {
          bubbles: false,
          cancelable: false,
          composed: true,
          detail,
        })
      )
    } else {
      this.statem.running = false
    }
  }

  connectedCallback() {
    super.connectedCallback()
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
    this.statem.subscribe((v) => {
      this.requestUpdate("state", v)
    })
    resize.observe(this)
  }

  disconnectedCallback() {
    resize.unobserve(this)
    super.disconnectedCallback()
  }

  static styles = css`
    * {
      font: 1rem "Trebuchet MS", Helvetica;
      letter-spacing: 1px;
    }
    :host {
      display: block;
      position: relative;
      writing-mode: vertical-tb; /* for ResizeObserverSize */
      background: repeating-conic-gradient(from 0deg, transparent 0deg 90deg, #fff3 90deg 180deg) 50% 50%/2rem 2rem;
      transition: background 100ms linear;
      min-width: 6rem;
      min-height: 6rem;
      overflow: hidden;
      resize: both;
    }
    :host(:hover) {
      background-size: 1.945rem 1.945rem;
    }
    :host(canvas) {
      width: inherit;
      height: inherit;
    }
    d-toolbar {
      position: absolute;
    }
  `

  render() {
    return html`
      <d-toolbar ?shifted=${!this.autoplay}>
        <button @click=${this.startRunning} ?disabled=${this.statem.running}>
          <d-icon name="play"></d-icon>
        </button>
        <button @click=${this.stopRunning} ?disabled=${!this.statem.running}>
          <d-icon name="stop"></d-icon>
        </button>
        <label>
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
          <input
            type="range"
            min="0"
            max="61"
            value=${this.statem.fps === Number.POSITIVE_INFINITY ? 61 : this.statem.fps}
            @input=${this.updateFps}
          />
        </label>
      </d-toolbar>
      ${when(this.statem.running, () => html`<canvas ${ref(this.startStop)}></canvas>`)}
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
