/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable unicorn/no-this-assignment */
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

const scene = new THREE.Scene()

/**
 * Keeps doing a series of actions over and over again,
 * 60fps would be nice.
 */
@customElement("d-gameloop")
export class DGameloop extends LitElement {
  @property({ type: Number }) fps = 60 //Number.POSITIVE_INFINITY

  requestID: number = 0
  interval!: number

  // private fpsInterval!: number
  // private prenow = performance.now()
  // private elapsed!: number
  // private now!: number
  // private deltaTime = 0
  // private clock = new THREE.Clock()

  theStuff(delta: number) {
    console.log("THESTUFF", delta)
  }

  /** https://gist.github.com/addyosmani/5434533?permalink_comment_id=2057320#gistcomment-2057320 */
  looper() {
    let then = performance.now()
    const interval = 1000 / this.fps
    const tolerance = 0.1
    const loop = (now: number) => {
      this.requestID = requestAnimationFrame(loop)
      const delta = now - then
      if (delta >= interval - tolerance) {
        then = now - (delta % interval)
        this.theStuff(delta)
      }
    }
    this.requestID = requestAnimationFrame(loop)
  }

  // looper() {
  //   let then = performance.now()
  //   const loop = (now: number) => {
  //     this.requestID = requestAnimationFrame(loop)
  //     const delta = now - then
  //     if (delta > this.interval) {
  //       then = now - (delta % this.interval)
  //       this.theStuff(delta)
  //     }
  //   }
  //   this.requestID = requestAnimationFrame(loop)
  // }

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
    this.requestID = 0
  }

  render() {
    return html`<slot>YO</slot>`
  }
}
