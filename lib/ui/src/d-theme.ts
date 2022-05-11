/* eslint-disable indent */
import { css, html, LitElement } from "lit"
import { statem } from "@depth/statem"
import { customElement } from "lit/decorators.js"
import { repeat } from "lit/directives/repeat.js"

/** Background colour setting. */
@customElement("d-theme")
export class DTheme extends LitElement {
  // private state = statem("theme", {
  //   property: "--bodybg",
  //   values: ["--bg0", "--bg1", "--bg2", "--bg3", "--bg4", "--bg5", "--bg6", "--bg7"],
  //   value: "--bg4",
  // })

  // connectedCallback() {
  //   super.connectedCallback()

  //   this.state.subscribe(
  //     ({ value }) => {
  //       document.documentElement.style.setProperty(this.state.property, `var(${value})`)
  //     },
  //     {
  //       key: "value",
  //       immediate: true,
  //     }
  //   )
  // }

  // static styles = css`
  //   :host {
  //     grid-area: theme;
  //   }
  //   label {
  //     background-color: #000;
  //     color: #fff;
  //   }
  // `

  // render() {
  //   return html`
  //     <label>
  //       Background:
  //       <select @change=${({ target }) => (this.state.value = target.value)}>
  //         ${repeat(
  //           this.state.values as string[],
  //           (v) => v,
  //           (v) => html` <option value=${v} ?selected=${v === this.state.value}>${v}</option> `
  //         )}
  //       </select>
  //     </label>
  //   `
  // }
}
