import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { statem } from "@depth/statem"
import * as icon from "./icons"

@customElement("d-button")
export class DButton extends LitElement {
  static styles = css`
    /* :host {
      display: ruby;
    } */
    :host button {
      color: #111;
      line-height: 0;
      padding: 0.4rem 1rem;
      border: 3px outset #bababa;
      border-radius: 1rem;
      background: radial-gradient(circle at 100%, #ccc 10%, #b30e08 75%);
      transition: all 0.1s;
    }
    :host button:hover {
      cursor: pointer;
      box-shadow: 0 0.5rem 0.5rem 0 rgba(0, 0, 0, 0.25);
    }
    :host button:active {
      border-style: inset;
      transform: translate(0.2rem, 0.2rem);
    }
    :host button:disabled {
      cursor: not-allowed;
      border-style: groove;
      background: #669;
      opacity: 0.6;
      color: #ccc;
    }
    :host button svg {
      height: 1.5rem;
      fill: currentColor;
    }
    :host button svg path:nth-of-type(2) {
      opacity: 0.4;
    }
  `

  render() {
    return html`
      <button>
        <slot></slot>
      </button>
    `
  }
}
