import "./d-toolbar"
import { v4 as uuidv4 } from "uuid"
import { stateMake } from "@depth/statem"
import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { when } from "lit/directives/when.js"
import { ref } from "lit/directives/ref.js"
import { startLooping, stopLooping, exec3D, loop3D } from "@depth/canvas"

@customElement("d-canvas")
export class DCanvas extends LitElement {
  @property()
  uuid = uuidv4()

  @property({ attribute: false, noAccessor: true })
  state: any = stateMake(
    {
      running: false,
      offscreen: false,
      fps: 60,
    },
    this.uuid
  )

  constructor() {
    super()
    this.state.subscribe(v => this.requestUpdate("state", v))
  }

  // TODO: add no-resizable parameter, and in this case send sizes to @depth/canvas and don't start resize observer
  static styles = css`
    :host > div {
      position: relative;
      overflow: hidden;
      resize: both;
      width: 100%;
      height: 100%;
      background: repeating-conic-gradient(from 0deg, transparent 0deg 90deg, #fff3 90deg 180deg) 50% 50%/2rem 2rem;
      transition: background 100ms linear;
      min-width: 6rem;
      min-height: 6rem;
    }
    :host > div:hover {
      background-size: 1.945rem 1.945rem;
    }
    :host > div > * {
      position: absolute;
      top: 0;
      left: 0;
      width: inherit;
      height: inherit;
    }
  `

  async startStop(canvas?: any) {
    if (canvas) {
      await startLooping({ canvas, offscreen: this.state.offscreen, statem: this.state })
      this.dispatchEvent(new CustomEvent("start", { bubbles: false, composed: false }))
    } else {
      stopLooping()
    }
  }

  render() {
    return html`<div>
      ${when(this.state.running, () => html`<canvas ${ref(this.startStop)}></canvas>`)}
      <d-toolbar uuid=${this.uuid}></d-toolbar>
    </div>`
  }
}
