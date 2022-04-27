import { statem } from "@depth/statem"
import pug from "./pug.macro.cjs"

const shadows = new WeakMap()

class DTheme extends HTMLElement {
  constructor() {
    super()
    statem("theme", { bg: 0 })
    const root = this.attachShadow({ mode: "closed" })
    shadows.set(this, root)
    root.innerHTML = pug`
    label Background:
      - var i = 0;
      select
        while i < 8
          option(value=i) Colour ##{i++}
    `
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
