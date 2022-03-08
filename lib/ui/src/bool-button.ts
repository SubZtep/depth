import {LitElement, css, html} from "lit"
import {customElement, property} from "lit/decorators.js"

@customElement("bool-button")
export class BoolButton extends LitElement {
  // @property({type: String, attribute: true})
  // x: string = ""
  @property({type: Object, attribute: true, reflect: true, state: true})
  x: object  = {}
  // static properties = {
  //   x: {state: true },
  // }

  render() {
    // return html`<button>XXX${JSON.stringify(this.x, null, 2)}</button>`
    // return html`<button>XXX${JSON.stringify(this.x, null, 2)}</button>`
  }
}
