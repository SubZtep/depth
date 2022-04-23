import { statem } from "@depth/statem"
import preval from "preval.macro"

const shadows = new WeakMap()
const html = preval`
  module.exports = require("pug").render(
    "label Background:\\n" +
    "  - var i = 0;\\n" +
    "  select\\n" +
    "    while i < 8\\n" +
    "      option(value=i) Colour ##{i++}"
  )
`

class DTheme extends HTMLElement {
  constructor() {
    super()
    const root = this.attachShadow({ mode: "closed" })
    root.innerHTML = html
    shadows.set(this, root)
    statem("theme", { bg: 0 })
  }

  connectedCallback() {
    const { style } = document.documentElement
    const state = statem("theme")

    state.subscribe(
      ({ bg }) => style.setProperty("--bodybg", `var(--bg${bg})`),
      { immediate: true })

    shadows.get(this).querySelector("select")?.addEventListener(
      "change", ({ target }) => (state.bg = target.value), false)
  }
}

customElements.define("d-theme", DTheme)
