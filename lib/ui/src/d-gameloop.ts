import type { PropertyValues } from "lit"
import { LitElement, html, css } from "lit"
import { customElement, property } from "lit/decorators.js"

/** Keeps doing a series of actions over and over again. */
@customElement("d-gameloop")
export class DGameloop extends LitElement {
  private _fps = Number.POSITIVE_INFINITY

  set fps(value: number) {
    const oldValue = this._fps
    const newValue = value === 61 ? Number.POSITIVE_INFINITY : value
    if (oldValue !== newValue) {
      this._fps = newValue
      this.requestUpdate("fps", oldValue)
    }
  }

  @property({ type: Number })
  get fps() {
    return this._fps
  }

  private rafID!: number
  private interval!: number
  private readonly tolerance = 0.1

  theStuff(delta: number) {
    document.querySelector("#meter")?.setAttribute("item", String(delta))
  }

  looper() {
    let then = performance.now()
    const loop = (now: number) => {
      this.rafID = requestAnimationFrame(loop)
      const delta = now - then
      if (delta >= this.interval - this.tolerance) {
        then = now - (delta % this.interval)
        this.theStuff(delta)
      }
    }
    this.rafID = requestAnimationFrame(loop)
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("fps")) {
      this.interval = Number.isFinite(this.fps) ? 1000 / this.fps : this.tolerance
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.requestUpdate("fps")
    this.looper()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    cancelAnimationFrame(this.rafID)
  }

  static styles = css`
    :host {
      grid-area: gameloop;
    }
    label {
      background-color: #000;
      color: #fff;
    }
  `

  render() {
    return html`
      <label>
        Limit to ${this.fps} FPS.
        <br />
        <input
          type="range"
          min="0"
          max="61"
          value=${Number.isFinite(this.fps) ? this.fps : 61}
          @input=${({ target }) => (this.fps = target.valueAsNumber)}
        />
      </label>
      <slot></slot>
    `
  }
}
