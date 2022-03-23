import { LitElement, css } from "lit"
import { customElement, property } from "lit/decorators.js"
import * as icon from "./icons"

@customElement("d-icon")
export class DIcon extends LitElement {
  @property() name!: keyof typeof icon

  static styles = css`
    :host svg {
      height: 1rem;
      fill: currentColor;
    }
    :host svg path:nth-of-type(2) {
      opacity: 0.4;
    }
  `

  render() {
    return icon[this.name]
  }
}
