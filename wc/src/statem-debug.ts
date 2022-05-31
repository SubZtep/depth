import { statem } from "@depth/statem"

/**
 * Display statem value.
 *
 * @element statem-debug
 *
 * @prop {String} statem - Statem ID
 */
class StatemDebug extends HTMLElement {
  #unsubscribe?: Fn

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    const shadowRoot = this.shadowRoot
    if (!shadowRoot) throw new Error("Missing shadow root")
    const statemID = this.getAttribute("statem")
    if (!statemID) throw new Error("Missing statem ID")
    const sm = statem(statemID)
    const render = () => (shadowRoot.innerHTML = `<pre>${sm.toString()}</pre>`)
    this.#unsubscribe = sm.subscribe(render, { immediate: true })
  }

  disconnectedCallback() {
    this.#unsubscribe?.()
  }
}

customElements.define("statem-debug", StatemDebug)

export {}
