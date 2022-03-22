import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { when } from "lit/directives/when.js"
import { classMap } from "lit/directives/class-map.js"
import "./d-gaze-click"
import "./d-icon"

@customElement("d-toolbar")
export class DToolbar extends LitElement {
  static styles = css`
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      transform: translateX(-100%);
      transition: transform 250ms ease-out;
      padding: 2px 0;
      width: 100%;
      gap: 4px;
      accent-color: #8a0303;
    }
    .toolbar:first-child {
      margin-left: 30px;
    }
    .shifted {
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
    ::slotted(label) {
      color: #fff;
      user-select: none;
      cursor: pointer;
      white-space: nowrap;
    }
    ::slotted(button) {
      color: #111;
      cursor: pointer;
      line-height: 0;
      padding: 2px 10px;
      border: 2px outset #bababa;
      border-radius: 6px;
      background-color: #aa9;
      transition: all 0.1s;
    }
    ::slotted(*:hover) {
      outline: solid 1px #ffa6;
    }
    ::slotted(button:active) {
      border-style: inset;
    }
    ::slotted(button:active) {
      /* TODO: apply to #shadow-root content */
      transform: translate(2px, 2px);
    }
    ::slotted(button:disabled) {
      cursor: not-allowed;
      border-style: groove;
      background: #669;
      opacity: 0.6;
      color: #ccc;
    }
  `

  @property({ type: Boolean }) shifted = false

  render() {
    return html`
      <div class="toolbar ${classMap({ shifted: this.shifted })}">${when(this.shifted, () => html`<slot></slot>`)}</div>
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
