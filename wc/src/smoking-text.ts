import pug from "pug.macro"

const style = `
<style>
:host {
  --bodyBg: #111;
  --textColor: #f5f5f5;
  --textSize: 10;
}

.smoke {
  filter: url('#filter');
}

.text {
  background: linear-gradient(#fff, #999, #ddd, #888);
  background-clip: text;
  filter: blur(5px) contrast(120%);
  color: var(--textColor);
  font-size: calc(var(--textSize) * 1rem);
}
</style>`

const html = pug`
.smoke
  slot.text
  svg(width="0")
    filter#filter
      feTurbulence#turbulence(type="fractalNoise" baseFrequency=".03" numOctaves="20")
      feDisplacementMap(in="SourceGraphic" scale="30")`

const rad = Math.PI / 180

customElements.define(
  "smoking-text",
  class extends HTMLElement {
    frames = 1
    rafid = 0
    bfx!: number
    bfy!: number
    turbulence!: HTMLElement

    constructor() {
      super()
      this.attachShadow({ mode: "open" }).innerHTML = style + html
    }

    anim = () => {
      this.frames += 0.2
      this.bfx = 0.03
      this.bfy = 0.03
      this.bfx += 0.005 * Math.cos(this.frames * rad)
      this.bfy += 0.005 * Math.sin(this.frames * rad)
      this.turbulence.setAttributeNS(null, "baseFrequency", `${String(this.bfx)} ${String(this.bfy)}`)
      window.requestAnimationFrame(this.anim)
    }

    connectedCallback() {
      this.turbulence = this.shadowRoot!.querySelector("#turbulence")!
      // console.log([this.shadowRoot, this.filter])
      // this.rafid = requestAnimationFrame(this.#animate.bind(this))
      this.rafid = window.requestAnimationFrame(this.anim)
    }

    disconnectedCallback() {
      cancelAnimationFrame(this.rafid)
    }
  }
)
