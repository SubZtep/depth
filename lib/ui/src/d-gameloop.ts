/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable unicorn/no-this-assignment */
/**
 * https://gist.github.com/addyosmani/5434533?permalink_comment_id=2057320#gistcomment-2057320
 * */
import { CanvasStatem, startLooping, StartLoopingReturn } from "@depth/canvas"
import type { Ref, RefOrCallback } from "lit/directives/ref.js"
import type Store from "@depth/statem"
import { v4 as uuidv4 } from "uuid"
import { LitElement, html, css, PropertyValueMap, PropertyValues } from "lit"
import { ref, createRef } from "lit/directives/ref.js"
import { customElement, property, state } from "lit/decorators.js"
import { LitElementWithResizeMixin, Resizer, styles as resizerStyles } from "./mixins/resizer"
import { classMap } from "lit/directives/class-map.js"
import { stateMake, statem } from "@depth/statem"
import "./d-toolbar"
import "./d-icon"
import * as THREE from "three"
import { when } from "lit/directives/when.js"
import { sleep } from "@depth/misc"

/** Keeps doing a series of actions over and over again. */
@customElement("d-gameloop")
export class DGameloop extends LitElement {
  @property({ type: Number }) fps = 60
  requestID!: number
  interval!: number

  theStuff(delta: number) {
    // console.log("THESTUFF", delta)
  }

  looper() {
    let then = performance.now()
    const tolerance = 0.1
    const loop = (now: number) => {
      this.requestID = requestAnimationFrame(loop)
      const delta = now - then
      if (delta >= this.interval - tolerance) {
        then = now - (delta % this.interval)
        this.theStuff(delta)
      }
    }
    this.requestID = requestAnimationFrame(loop)
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("fps")) {
      this.interval = 1000 / this.fps
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.looper()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    cancelAnimationFrame(this.requestID)
  }

  static styles = css`
    :host {
      grid-area: gameloop;
    }
  `

  render() {
    return html`
      <label>
        Limit to ${this.fps} FPS.
        <br />
        <input
          type="range"
          min="1"
          max="60"
          value="${this.fps}"
          @input="${({ target }) => {
            this.fps = target.valueAsNumber
          }}"
        />
      </label>
      <slot></slot>
    `
  }
}
