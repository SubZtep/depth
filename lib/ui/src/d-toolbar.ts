import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { when } from "lit/directives/when.js"
import { button, input } from "./styles"
import { classMap } from "lit/directives/class-map.js"
import "./d-gaze-click"
import "./d-icon"

@customElement("d-toolbar")
export class DToolbar extends LitElement {
  static styles = [
    button,
    input,
    css`
      :host .toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        transform: translateX(-100%);
        transition: transform 250ms ease-out;
        padding: 2px 0;
        width: 100%;
        gap: 4px;
      }
      :host .toolbar:first-child {
        margin-left: 30px;
      }
      :host .shifted {
        background-image: radial-gradient(circle at center, #05675233 0%, #6669 30%, transparent 90%);
        transform: translateX(0);
      }
      d-gaze-click {
        position: absolute;
        top: 8px;
        left: 4px;
      }
      d-gaze-click > button {
        background: transparent;
        cursor: pointer;
        border: none;
      }
    `,
  ]

  @property({ type: Boolean }) shifted = false

  render() {
    return html`
      <div class=${classMap({ toolbar: true, shifted: this.shifted })}>
        ${when(this.shifted, () => html`<slot></slot>`)}
      </div>
      <d-gaze-click>
        <button @click=${this.toggleShifted}>
          <d-icon name="hamburger"></d-icon>
        </button>
      </d-gaze-click>
    `
  }

  toggleShifted() {
    this.shifted = !this.shifted
  }
}
