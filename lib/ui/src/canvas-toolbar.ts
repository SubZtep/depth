import {LitElement, css, html} from "lit"
import {customElement, property} from "lit/decorators.js"
import { useSingleton } from "@depth/misc"

@customElement("canvas-toolbar")
export class CanvasToolbar extends LitElement {
  @property({ type: Boolean, attribute: false })
  running: boolean = false

  state: any

  constructor() {
    super()

    const { singleton } = useSingleton()
    // console.log("SSS", singleton)
    this.state = singleton.get("rendererState")

    this.state.subscribe(s => {
      // this.state = x.state
      // console.log("JUHUUUUUU", s.running)
      // this.state.running = s.running
      // console.log( this.state)
      this.running = s.running
    })
  }

  static styles = css`
    div {
      user-select: none;
      display: flex;
      background-image: linear-gradient(to bottom, darkgreen 0%, transparent 100%);
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem;
    }

    button {
      border: 4px outset #bbb;
      font: 1rem Verdana;
      color: #000;
      background-color: #eee;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }
    button:hover {
      border-style: solid;
    }
    button:active {
      border-style: inset;
      transform: translate(1px, 1px);
    }
    button:disabled {
      border-style: solid;
      color: #aaa;
      pointer-events: none;
      opacity: 0.8;
    }
  `

  render() {
    return html`
      <div>
        <button @click=${() => (this.state.running = true)} ?disabled=${this.state.running}>Play</button>
        <button @click=${() => (this.state.running = false)}  ?disabled=${!this.state.running}>Stop</button>
      </div>
    `
  }
}
