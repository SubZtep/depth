import { statem } from "@depth/statem"

/**
 * Display statem value.
 *
 * @element d-debug
 *
 * @prop {String} statem - Statem ID
 */
class DDebug extends HTMLElement {
  #statemID: string | null = null

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this.#statemID = this.getAttribute("statem")
    if (!this.#statemID) throw new Error("Missing statem ID")

    setTimeout(() => {
      statem(this.#statemID!).subscribe(
        (state) => (this.shadowRoot!.innerHTML = `<pre>${JSON.stringify(state, null, 2)}</pre>`),
        { immediate: true }
      )
    }, 100)
  }
}

customElements.define("d-debug", DDebug)
