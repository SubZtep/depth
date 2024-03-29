import pug from "pug.macro"

const style = `<style>
  :host {
    /*background-color: red;*/
    position: relative;
    display: inline-block;
    height: var(--icon-height, 1rem);
    aspect-ratio: 1;
    margin: 4px;
  }
  :host(svg) {
    fill: var(--icon-fill, currentColor);
    path:nth-of-type(2) {
      opacity: 0.4;
    }
  }
</style>`

// type Key = "play" | "stop" | "hamburger"

const iconSVGs = new Map(
  Object.entries({
    play: pug`svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" role="img" aria-label="Play")
    path(d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z")`,
    stop: pug`svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" role="img" aria-label="Stop")
    path(d="M384 128v255.1c0 35.35-28.65 64-64 64H64c-35.35 0-64-28.65-64-64V128c0-35.35 28.65-64 64-64H320C355.3 64 384 92.65 384 128z")`,
    hamburger: pug`svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" role="img" aria-label="Menu")
    path(d="M416 128H32C14.33 128 0 113.7 0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z")
    path(d="M0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256z")`
  })
)

/**
 * Display a responsive, inline SVG icon.
 *
 * Included shapes:
 * - play
 * - stop
 * - hamburger
 *
 * @element svg-icon
 *
 * @prop {String} name - Reactive icon shape name
 *
 * @cssprop [--icon-height=1rem] - Inline font size
 * @cssprop [--icon-fill=currentColor] - Primary colour
 */
export default class SVGIcon extends HTMLElement {
  static get observedAttributes() {
    return ["name"]
  }

  get svgEl() {
    if (!this.shadowRoot) throw new Error("No shadow root")
    if (!this.shadowRoot.lastElementChild) throw new Error("No svg element")
    return this.shadowRoot.lastElementChild
  }

  /**
   * @param name string
   * @param old string | null
   * @param value string | null
   */
  attributeChangedCallback(name, old, value) {
    switch (name) {
      case "name": {
        if (value && iconSVGs.has(value)) this.svgEl.outerHTML = iconSVGs.get(value)
        else if (old && iconSVGs.has(old)) this.svgEl.outerHTML = pug`svg`
        else throw new Error(`Invalid icon shape name: ${value ?? "_nothing_"}`)
        break
      }
      default: {
        throw new Error(`Unknown attribute: ${name}`)
      }
    }
  }

  constructor() {
    super()
    this.attachShadow({ mode: "open" }).innerHTML = style + pug`svg`
  }
}

customElements.define("svg-icon", SVGIcon)

export {}
