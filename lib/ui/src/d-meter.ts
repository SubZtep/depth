/* eslint-disable indent */
import type { PropertyValues, ReactiveElement } from "lit"
import { LitElement, html, css, svg } from "lit"
import { customElement, property, query } from "lit/decorators.js"
import { repeat } from "lit/directives/repeat.js"
import { styleMap } from "lit/directives/style-map.js"
import { normalise } from "@depth/misc"

@customElement("d-meter")
export class DMeter extends LitElement {
  @property({ type: Number }) length = 10
  @property({ type: Number }) min = 0
  @property({ type: Number }) max = 200
  @property({ type: Number }) item!: number
  @query("svg") host?: ReactiveElement
  private queue: number[] = []
  private pc: ReturnType<typeof normalise> = (v) => v

  protected willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("min") || changedProperties.has("max")) {
      if (this.min === this.max) {
        this.max++ // prevent divide by zero
      }
      this.pc = normalise(this.min, this.max)
    }
    if (changedProperties.has("length")) {
      this.host?.style.setProperty("--bar", `${100 / this.length}%`)
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
    label {
      position: absolute;
      top: 0;
      left: 0;
      color: #fff;
      background-color: #000;
    }
    svg {
      background-color: #cb4d3e;
      transform: scaleY(-1);
      width: 100%;
      height: 100%;
    }
    rect {
      width: var(--bar, 10%);
    }
  `

  render() {
    return html`
      <svg xmlns="http:/www.w3.org/2000/svg" preserveAspectRatio="none">
        ${svg`
          <g fill="#3d5599">
            ${repeat(
              this.queue,
              (v, i) =>
                svg`<rect style=${styleMap({
                  x: `calc(var(--bar, 10%) * ${i})`,
                  height: `${this.pc(v) * 100}%`,
                })}></rect>`
            )}
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
