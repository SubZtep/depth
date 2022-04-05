/* eslint-disable indent */
import type { PropertyValues, ReactiveElement } from "lit"
import { LitElement, html, css, svg } from "lit"
import { customElement, property, query } from "lit/decorators.js"
import { repeat } from "lit/directives/repeat.js"
import { styleMap } from "lit/directives/style-map.js"
import { normalise } from "@depth/misc"

@customElement("d-meter")
export class DMeter extends LitElement {
  @property({ type: Number, reflect: true }) length = 16
  @property({ type: Number }) min = 0
  @property({ type: Number }) max = 200
  @property({ type: Number }) item!: number
  @query("svg") svgElem?: ReactiveElement
  protected queue: number[] = []
  protected n0rmal: ReturnType<typeof normalise> = (v) => v

  protected willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("min") || changedProperties.has("max")) {
      this.min === this.max && this.max++ // prevent divide by zero
      this.n0rmal = normalise(this.min, this.max)
    }
    if (changedProperties.has("length")) {
      this.svgElem?.style.setProperty("--bar-width", `${100 / this.length}%`)
      const diff = this.queue.length - this.length
      diff > 0 && this.queue.splice(0, diff)
    }
    if (changedProperties.has("item")) {
      const diff = this.queue.length - this.length
      diff >= 0 && this.queue.shift()
      this.queue.push(this.item)
    }
  }

  static styles = css`
    :host {
      grid-area: meter;
      position: relative;
    }
    svg {
      /* background-color: #cb4d3e; */
      transform: scaleY(-1);
      width: 100%;
      height: 100%;
    }
    rect {
      width: calc(var(--bar-width) / 4);
      transition: all linear 16ms;
    }
    label {
      position: absolute;
      top: 0;
      left: 0;
      color: #fff;
      background-color: #333;
    }
    path {
      transition: all linear 160ms;

      fill: none;
      stroke: #111;
      stroke-width: 10;
      stroke-linecap: round;
      vector-effect: non-scaling-stroke;
    }
  `

  path = ""

  render() {
    this.path = "M 0 69"
    return html`
      <svg xmlns="http:/www.w3.org/2000/svg" viewbox="0 0 666 400">
        ${svg`
          <g fill="#3d5599">
            ${repeat(this.queue, (v, i) => {
              this.path += `L ${Math.min(666, Math.max(100, i * 2 * this.length))} ${this.n0rmal(v) * 300}`
              return svg`
              
              <rect style=${styleMap({
                x: `calc(var(--bar-width) * ${i})`,
                height: `${this.n0rmal(v) * 100}%`,
              })}></rect>
              
              <path d=${this.path}>
              `
            })}
          </g>
      `}
      </svg>
      <label>
        Length:
        <input
          type="range"
          min="1"
          max="50"
          value=${this.length}
          @input=${({ target }) => (this.length = target.valueAsNumber)}
        />
      </label>
    `
  }
}
