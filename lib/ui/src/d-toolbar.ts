import { LitElement, css, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { when } from "lit/directives/when.js"
import { statem } from "@depth/statem"
import { button } from "./styles"

@customElement("d-toolbar")
export class DToolbar extends LitElement {
  @property()
  uuid!: string

  static styles = [
    button,
    css`
      :host > div {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
        padding: 0.3rem;
        background-image: radial-gradient(circle at center, #05675233 0%, #6669 30%, transparent 90%);
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
    `,
  ]

  @state()
  state

  @state()
  opened = false

  connectedCallback() {
    super.connectedCallback()
    this.state = statem(this.uuid)
    this.state.subscribe(v => this.requestUpdate("state", v))
  }

  render() {
    return html`
      <d-gaze-click>
        <d-icon @click=${() => (this.opened = !this.opened)} name="hamburger"></d-icon>
      </d-gaze-click>
      ${when(
        this.opened,
        () => html`<div>
          <button @click=${() => (this.state.running = true)} ?disabled=${this.state.running} title="Play">
            <d-icon name="play"></d-icon>
          </button>
          <button @click=${() => (this.state.running = false)} ?disabled=${!this.state.running} title="Stop">
            <d-icon name="stop"></d-icon>
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
        </div>`
      )}
    `
  }
}
