import { LitElement } from "lit"
import { statem } from "@depth/statem"
import { customElement, property } from "lit/decorators.js"

/** CSS var setter. */
@customElement("d-css-var")
export class DCssVar extends LitElement {
  /** Css var name. */
  @property({ type: String }) property!: string
  /** Statem ID. */
  @property() sid!: string

  protected state!: any

  connectedCallback() {
    super.connectedCallback()

    // wait for state existance...
    setTimeout(() => {
      this.state = statem(this.sid)
      this.state.subscribe(({ bodybg }) => {
        document.documentElement.style.setProperty(this.property, bodybg)
      })
    }, 100)
  }
}
