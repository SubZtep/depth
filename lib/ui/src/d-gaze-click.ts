import { LitElement, css, html } from "lit"
import { customElement, property, state, eventOptions, queryAssignedElements } from "lit/decorators.js"
import { classMap } from "lit/directives/class-map.js"

/**
 * Phrase from XR, it's an auto-clicker.
 */
@customElement("d-gaze-click")
export class DGazeClick extends LitElement {
  static styles = css`
    :host > div {
      user-select: none;
      display: inline-block;
      transition: transform 2s linear 1s;
      line-height: 0;
    }
    :host > div:not(.waiting) {
      transition: none;
    }
    .waiting {
      transform: rotate(360deg);
    }
  `

  @property({ type: Number }) delay = 3000
  @queryAssignedElements() els!: HTMLElement[]
  @state() timer: NodeJS.Timeout | null = null

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
    return html`
      <div
        class=${classMap({ waiting: !!this.timer })}
        @mouseenter=${this.start}
        @mouseleave=${this.stop}
        @click=${this.stop}
      >
        <slot></slot>
      </div>
    `
  }
}
