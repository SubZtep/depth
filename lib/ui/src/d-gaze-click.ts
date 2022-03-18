import { LitElement, css, html } from "lit"
import { customElement, state, eventOptions, queryAssignedElements } from "lit/decorators.js"
import { classMap } from "lit/directives/class-map.js"

/**
 * Phrase from XR, it's an auto-clicker.
 */
@customElement("d-gaze-click")
export class DGazeClick extends LitElement {
  static styles = css`
    :host > div {
      cursor: pointer;
      display: inline-block;
      background-color: yellow;
      transition: transform 1s linear 2s;
    }
    :host > div:not(.waiting) {
      transition: none !important;
    }
    .waiting {
      transform: rotate(360deg);
    }
  `

  @queryAssignedElements()
  els!: Array<HTMLElement>

  @state()
  timer: NodeJS.Timeout | null = null

  @eventOptions({ passive: true })
  start() {
    this.timer = setTimeout(() => {
      this.timer = null
      this.els?.[0].click()
    }, 3000)
  }

  @eventOptions({ passive: true })
  stop() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.timer && clearTimeout(this.timer)
  }

  render() {
    return html`<div
      class=${classMap({ waiting: !!this.timer })}
      @mouseenter=${this.start}
      @mouseleave=${this.stop}
      @click=${this.stop}
    >
      <slot></slot>
    </div>`
  }
}
