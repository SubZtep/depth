import { v4 as uuidv4 } from "uuid"
import { stateMake } from "@depth/statem"
import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { when } from "lit/directives/when.js"
import { ref } from "lit/directives/ref.js"
import { startLooping } from "@depth/canvas"
import { debounce } from "@depth/misc"
import { bgSquares, layers, resizable } from "./styles"
import "./d-toolbar"
import "./d-icon"

const resize = new ResizeObserver(
  debounce<ResizeObserverCallback>(
    // eslint-disable-next-line unicorn/no-array-for-each
    entries => entries.forEach(entry => (entry.target as DCanvas).resizeCallback(entry)),
    100
  )
)

/**
 * 3D canvas element.
 */
@customElement("d-canvas")
export class DCanvas extends LitElement {
  /** Immediately start rendering. */
  @property({ type: Boolean }) autoplay = false

  /** Run render inside a web worker. */
  @property({ type: Boolean }) offscreen = false

  @property({ type: String }) uuid = uuidv4()

  private state: any

  static styles = [bgSquares, layers, resizable]

  resizeCallback({ contentBoxSize: [{ blockSize, inlineSize }] }: ResizeObserverEntry) {
    this.state.width = inlineSize
    this.state.height = blockSize
    //Object.assign(this.state, { width: inlineSize, height: blockSize })
  }

  stopLooping?: () => void

  startStop(canvas?: any) {
    if (canvas) {
      const { stopLooping, exec3D, loop3D } = startLooping({ canvas, statem: this.state })
      this.stopLooping = stopLooping as () => void
      this.dispatchEvent(
        new CustomEvent("start", { bubbles: false, cancelable: false, composed: true, detail: { exec3D, loop3D } })
      )
    } else {
      this.stopLooping?.()
    }
  }

  connectedCallback() {
    super.connectedCallback()
    resize.observe(this)

    this.state = stateMake(
      {
        running: false,
        offscreen: this.offscreen,
        fps: Number.POSITIVE_INFINITY,
        width: 0,
        height: 0,
      },
      this.uuid
    )
    this.state.subscribe((v: typeof this.state) => this.requestUpdate("state", v))

    if (this.autoplay) {
      // FIXME: Make it nice without break it.
      setTimeout(() => (this.state.running = true), 666)
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    resize.unobserve(this)
  }

  render() {
    return html`
      <d-toolbar ?shifted=${!this.autoplay}>
        <button @click=${this.startRunning} ?disabled=${this.state.running} title="Play">
          <d-icon name="play"></d-icon>
        </button>
        <button @click=${this.stopRunning} ?disabled=${!this.state.running} title="Stop">
          <d-icon name="stop"></d-icon>
        </button>
        <label>
          Offscreen
          <input
            type="checkbox"
            ?checked=${this.state.offscreen}
            @change=${this.updateOffscreen}
            ?disabled=${this.state.running}
          />
        </label>
        <label>
          FPS Limit
          <input
            type="range"
            min="0"
            max="61"
            value=${this.state.fps === Number.POSITIVE_INFINITY ? 61 : this.state.fps}
            @input=${this.updateFps}
          />
          ${this.state.fps}
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
    this.state.fps = valueAsNumber > 60 ? Number.POSITIVE_INFINITY : valueAsNumber
  }
}
