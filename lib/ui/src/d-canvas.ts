import "./d-toolbar"
import { v4 as uuidv4 } from "uuid"
import { stateMake } from "@depth/statem"
import { LitElement, css, html } from "lit"
import { customElement, state, property } from "lit/decorators.js"
import { when } from "lit/directives/when.js"
import { ref } from "lit/directives/ref.js"
// import { startLooping, stopLooping } from "@depth/canvas"
import { startLooping } from "@depth/canvas"
import { throttle } from "@depth/misc"
import { bgSquares, layers, resizable } from "./styles"

const resize = new ResizeObserver(
  throttle<ResizeObserverCallback>(
    entries => entries.forEach(entry => (entry.target as DCanvas).resizeCallback(entry)),
    50
  )
)

@customElement("d-canvas")
export class DCanvas extends LitElement {
  @property({ type: Boolean })
  autoplay = false

  @property({ type: Boolean })
  offscreen = false

  @property({ type: String })
  uuid = uuidv4()

  state: any

  // constructor() {
  //   super()
  //   console.log("!!!", this.offscreen)
  //   this.state = stateMake(
  //     {
  //       running: false,
  //       offscreen: this.offscreen,
  //       fps: 60,
  //       width: 0,
  //       height: 0,
  //     },
  //     this.uuid
  //   )
  //   this.state.subscribe((v: typeof this.state) => this.requestUpdate("state", v))
  // }

  static styles = [bgSquares, layers, resizable]

  resizeCallback({ contentBoxSize: [{ blockSize, inlineSize }] }: ResizeObserverEntry) {
    // console.log("RESIZE CALLBACK", [inlineSize, blockSize])
    this.state.width = inlineSize
    this.state.height = blockSize
    // Object.assign(this.state, { width: inlineSize, height: blockSize })
  }

  stopLooping?: () => void

  // async startStop(canvas?: any) {
  startStop(canvas?: any) {
    if (canvas) {
      // console.log("A")
      const { stopLooping, exec3D, loop3D } = startLooping({ canvas, statem: this.state })
      // const { stopLooping, exec3D, loop3D } = await startLooping({ canvas, statem: this.state })
      // console.log("B")
      this.stopLooping = stopLooping as () => void
      // await startLooping({ canvas, offscreen: this.state.offscreen, statem: this.state })
      this.dispatchEvent(
        // new CustomEvent("start", { bubbles: false, cancelable: false, composed: false, detail: { exec3D, loop3D } })
        new CustomEvent("start", { bubbles: false, cancelable: false, composed: true, detail: { exec3D, loop3D } })
      )
      // console.log("C")
    } else {
      this.stopLooping?.()
    }
  }

  connectedCallback() {
    super.connectedCallback()
    // console.log("!!", this.offscreen)
    // resize.observe(this)
    // this.state.running = this.autoplay

    this.state = stateMake(
      {
        running: this.autoplay,
        offscreen: this.offscreen,
        fps: 60,
        width: 0,
        height: 0,
      },
      this.uuid
    )
    this.state.subscribe((v: typeof this.state) => this.requestUpdate("state", v))

    resize.observe(this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    resize.unobserve(this)
  }

  render() {
    // console.log("!", this.offscreen)
    return html`
      <d-toolbar ?shifted=${true /*!this.autoplay*/}>
        <button @click=${this.startRunning} ?disabled=${this.state.running} title="Play">
          <d-icon name="play"></d-icon>
        </button>
        <button @click=${this.stopRunning} ?disabled=${!this.state.running} title="Stop">
          <d-icon name="stop"></d-icon>
        </button>
        <label>
          Offscreen
          <input type="checkbox" ?checked=${this.state.offscreen} @change=${this.updateOffscreen} />
        </label>
        <label>
          FPS Limit
          <input type="range" min="0" max="61" value=${this.state.fps} @input=${this.updateFps} />
          ${this.state.fps}
        </label>
      </d-toolbar>
      ${when(
        this.state.running,
        () => html`<canvas ${ref(this.startStop)} width="320" height="240"></canvas>`
      )}
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
