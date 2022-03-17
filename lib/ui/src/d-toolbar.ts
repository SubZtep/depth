import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { statem } from "@depth/statem"
import * as icon from "./icons"

@customElement("d-toolbar")
export class DToolbar extends LitElement {
  @property({ attribute: false, noAccessor: true })
  state

  @property()
  uuid!: string

  connectedCallback() {
    super.connectedCallback()
    this.state = statem(this.uuid)
    this.state.subscribe(v => this.requestUpdate("state", v))
  }

  static styles = css`
    :host > div {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      padding: 0.3rem;
      background-image: radial-gradient(circle at center, #05675233 0%, #6669 30%, transparent 90%);
    }
    button {
      color: #111;
      line-height: 0;
      padding: 0.4rem 1rem;
      border: 3px outset #bababa;
      border-radius: 1rem;
      background: radial-gradient(circle at 100%, #ccc 10%, #b30e08 75%);
      transition: all 0.1s;
    }
    button:hover {
      cursor: pointer;
      box-shadow: 0 0.5rem 0.5rem 0 rgba(0, 0, 0, 0.25);
    }
    button:active {
      border-style: inset;
      transform: translate(0.2rem, 0.2rem);
    }
    button:disabled {
      cursor: not-allowed;
      border-style: groove;
      background: #669;
      opacity: 0.6;
      color: #ccc;
    }
    button svg {
      height: 1.5rem;
      fill: currentColor;
    }
    label {
      color: #fff;
      max-width: 10rem;
      font: 1.1rem Tahoma;
      letter-spacing: 0.1rem;
      user-select: none;
      cursor: pointer;
      background: radial-gradient(circle at 100%, #ccc 0%, #b30e08 75%, #666 45%);
    }
    input {
      accent-color: #8a0303;
    }
    input[type="checkbox"] {
      transform: scale(1.4);
    }
  `

  render() {
    return html`
      <div>
        <button @click=${() => (this.state.running = true)} ?disabled=${this.state.running} title="Play">
          ${icon.play}
        </button>
        <button @click=${() => (this.state.running = false)} ?disabled=${!this.state.running} title="Stop">
          ${icon.stop}
        </button>
        <label>
          <input
            type="checkbox"
            ?checked=${this.state.offscreen}
            @change=${e => (this.state.offscreen = e.target.checked)}
          />
          Prefer offscreen
        </label>
        <label>
          fps limit ${this.state.fps}
          <input
            type="range"
            min="0"
            max="61"
            value=${this.state.fps}
            @input=${(v: { srcElement: { valueAsNumber: number } }) =>
              (this.state.fps =
                v.srcElement.valueAsNumber > 60 ? Number.POSITIVE_INFINITY : v.srcElement.valueAsNumber)}
          />
        </label>
      </div>
    `
  }
}
