import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { canvasState } from "@depth/statem"

@customElement("canvas-toolbar")
export class CanvasToolbar extends LitElement {
  @property({ type: Boolean, attribute: false })
  running: boolean = false

  state: CanvasStatem & Statem

  constructor() {
    super()

    this.state = canvasState

    this.state.subscribe(s => {
      Object.keys(s).forEach(k => {
        this[k] = s[k]
      })
    })
  }

  static styles = css`
    div {
      user-select: none;
      display: flex;
      background-image: radial-gradient(circle at center, #05675233 0%, #6669 30%, transparent 90%);
      justify-content: center;
      gap: 0.6rem;
      padding: 0.3rem;
      max-width: 15rem;
      margin: 0 auto;
    }
    button {
      border: 3px outset #bababa;
      font: 1.5rem Verdana;
      color: #000;
      background: radial-gradient(circle at 100%, #666, #ccc 10%, #b30e08 75%, #666 75%);
      padding: 0.3rem 1rem;
      border-radius: 0.69rem;
      text-shadow: 0.2rem 0.2rem 0.5rem #edd;
      transition: all 0.005s;
    }
    button:hover {
      transition: all 0.1s;
      box-shadow: 0 0.5rem 0.5rem 0 rgba(0, 0, 0, 0.25);
      cursor: pointer;
    }

    button:active {
      transition: all 0.015s;
      border-style: inset;
      transform: translate(0.11rem, 0.11rem);
    }
    button:disabled {
      cursor: blocked;
      border-style: groove;
      border-color: #69b;
      background: #676;
      color: #d40f;
      pointer-events: none;
      opacity: 0.8;
    }
    label {
      background-color: #eee;
    }
  `

  render() {
    return html`
      <div>
        <button @click=${() => (this.state.running = true)} ?disabled=${this.state.running}>▶</button>
        <button @click=${() => (this.state.running = false)} ?disabled=${!this.state.running}>⏹</button>
      </div>
    `
  }
}
