import { LitElement } from "lit"
import { statem } from "@depth/statem"
import { customElement, property } from "lit/decorators.js"

/** CSS var setter. */
@customElement("d-css-var")
export class DCssVar extends LitElement {
  /** statem ID */
  @property() sid!: string

  /** CSS  var name. */
  @property({ type: String }) var?: string

  state = statem(this.sid)

  connectedCallback() {
    super.connectedCallback()

    // waiting for state existance...
    setTimeout(() => {
      // this.state = statem(this.sid)
      this.state.subscribe(({ bodybg }) => {
        this.var && document.documentElement.style.setProperty(this.var, bodybg)
      })
    }, 100)
  }
}
