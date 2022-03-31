import { LitElement, html, css, PropertyValueMap, PropertyValues } from "lit"
import { ref, createRef } from "lit/directives/ref.js"
import { customElement, property, state } from "lit/decorators.js"

@customElement("d-meter")
export class DMeter extends LitElement {
  /** Statem ID */
  @property({ type: String }) statem?: string

  static styles = css`
    :host {
      grid-area: meter;
    }
  `

  render() {
    return html` <slot></slot> `
  }
}
