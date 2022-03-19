import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { when } from "lit/directives/when.js"
import { button, input } from "./styles"
import { classMap } from "lit/directives/class-map.js"

@customElement("d-toolbar")
export class DToolbar extends LitElement {
  static styles = [
    button,
    input,
    css`
      /* :host {
        position: relative;
      } */
      :host > div {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        transform: translateX(-100%);
        transition: transform 250ms ease-out;
        text-indent: 2rem;
        padding: 2px 0;
        width: 100%;
      }
      :host > div.toolbar {
        transform: translateX(0);
        background-image: radial-gradient(circle at center, #05675233 0%, #6669 30%, transparent 90%);
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

  @property({ type: Boolean })
  shifted = false

  render() {
    return html`
      <div class=${classMap({ toolbar: this.shifted })}>
        ${when(this.shifted, () => html`<div><slot></slot></div>`)}
      </div>
      <d-gaze-click>
        <button @click=${this.toggle}>
          <d-icon name="hamburger"></d-icon>
        </button>
      </d-gaze-click>
    `
  }

  toggle() {
    this.shifted = !this.shifted
  }
}
