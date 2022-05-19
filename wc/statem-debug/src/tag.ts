import pug from "pug.macro"

const style = `<style>
  div {
    background: red;
  }
</style>`

/**
 * Tag template
 *
 * @element tag-template
 */
export default class Tag extends HTMLElement {
  constructor() {
    super()
    const root = this.attachShadow({ mode: "open" })
    root.innerHTML =
      style +
      pug`
      div
    `
  }
}
