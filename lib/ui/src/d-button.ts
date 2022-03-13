import { LitElement, css, html, svg } from "lit"
import { customElement } from "lit/decorators.js"

// FIXMEL svg should be in right size (responsive)

@customElement("d-button")
export class DButton extends LitElement {
  constructor() {
    super()
  }

  static styles = css`
    button {
      border: 3px outset #bababa;
      font: 1.5rem Verdana;
      color: #000;
      background: radial-gradient(circle at 100%, #666, #ccc 10%, #b30e08 75%, #666 75%);
      padding: 0.3rem 1rem;
      border-radius: 0.69rem;
      text-shadow: 0.2rem 0.2rem 0.5rem #edd;
      transition: all 0.005s;
    }
    button:hover {
      transition: all 0.1s;
      box-shadow: 0 0.5rem 0.5rem 0 rgba(0, 0, 0, 0.25);
      cursor: pointer;
    }
    button:active {
      transition: all 0.015s;
      border-style: inset;
      transform: translate(0.11rem, 0.11rem);
    }
    button:disabled {
      cursor: blocked;
      border-style: groove;
      border-color: #69b;
      background: #676;
      color: #d40f;
      pointer-events: none;
      opacity: 0.8;
    }
    svg path {
      width: 64px;
      height: 64px;
    }
  `

  render() {
    const play = svg`<path d="M24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13V38.13zM48 432L336 256L48 80V432z"/>`
    return html`
      <button>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">${play}</svg>
      </button>
    `
  }
}
