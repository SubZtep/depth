import { v4 as uuidv4 } from "uuid"
import { stateMake } from "@depth/statem"
import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { when } from "lit/directives/when.js"
import { ref } from "lit/directives/ref.js"
import { startLooping } from "@depth/canvas"
import { debounce } from "@depth/misc"
import { bgSquares, layers, resizable } from "./styles"
import type { RefOrCallback } from "lit/directives/ref.js"
import type { CanvasStatem } from "@depth/canvas"
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

/**
 * 3D canvas element.
 */
@customElement("d-canvas")
export class DCanvas extends LitElement {
  static styles = [bgSquares, layers, resizable]
  @property({ type: Boolean }) autoplay = false
  @property({ type: Boolean }) offscreen = false
  @property({ type: String }) sid = uuidv4()

  private state!: Store<CanvasStatem> & CanvasStatem

  resizeCallback({ contentBoxSize: [{ blockSize, inlineSize }] }: ResizeObserverEntry) {
    this.state.patch({
      width: inlineSize,
      height: blockSize,
    })
  }

  stopLooping?: Fn

  startStop: RefOrCallback = (canvas?: any) => {
    if (canvas) {
      const { stopLooping, ...detail } = startLooping({ canvas, statem: this.state })
      this.stopLooping = stopLooping
      this.dispatchEvent(new CustomEvent("start", { bubbles: false, cancelable: false, composed: true, detail }))
    } else {
      this.stopLooping?.()
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.state = stateMake<CanvasStatem>(
      {
        running: this.autoplay,
        offscreen: this.offscreen,
        fps: Number.POSITIVE_INFINITY,
        width: this.clientWidth,
        height: this.clientHeight,
      },
      this.sid
    )
    this.state.subscribe((v) => {
      this.requestUpdate("state", v)
    })
    resize.observe(this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    resize.unobserve(this)
  }

  render() {
    return html`
      <d-toolbar ?shifted=${!this.autoplay}>
        <button @click=${this.startRunning} ?disabled=${this.state.running}>
          <d-icon name="play"></d-icon>
        </button>
        <button @click=${this.stopRunning} ?disabled=${!this.state.running}>
          <d-icon name="stop"></d-icon>
        </button>
        <label>
          Offscreen
          <input
            type="checkbox"
            .checked=${this.state.offscreen}
            ?disabled=${this.state.running}
            @change=${this.updateOffscreen}
          />
        </label>
        <label>
          FPS ${this.state.fps === Number.POSITIVE_INFINITY ? "∞" : this.state.fps}
          <input
            type="range"
            min="0"
            max="61"
            value=${this.state.fps === Number.POSITIVE_INFINITY ? 61 : this.state.fps}
            @input=${this.updateFps}
          />
        </label>
      </d-toolbar>
      ${when(this.state.running, () => html`<canvas ${ref(this.startStop)}></canvas>`)}
    `
  }

  startRunning() {
    this.state.running = true
  }

  stopRunning() {
    this.state.running = false
  }

  updateOffscreen({ target: { checked } }) {
    this.state.offscreen = checked
  }

  updateFps({ srcElement: { valueAsNumber } }) {
    this.state.fps = valueAsNumber === 61 ? Number.POSITIVE_INFINITY : valueAsNumber
  }
}
