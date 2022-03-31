// import { CanvasStatem, startLooping, StartLoopingReturn } from "@depth/canvas"
// import type { Ref, RefOrCallback } from "lit/directives/ref.js"
// import type Store from "@depth/statem"
// import { v4 as uuidv4 } from "uuid"
// import { LitElement, html, css } from "lit"
// import { ref, createRef } from "lit/directives/ref.js"
// import { customElement, property, state } from "lit/decorators.js"
// import { LitElementWithResizeMixin, Resizer, styles as resizerStyles } from "./mixins/resizer"
// import { classMap } from "lit/directives/class-map.js"
// import { stateMake, statem } from "@depth/statem"
// import "./d-toolbar"
// import "./d-icon"
// import * as THREE from "three"
// import { when } from "lit/directives/when.js"
// import { sleep } from "@depth/misc"

// const scene = new THREE.Scene()

// /** 3D canvas element. */
// @customElement("d-canvas")
// export class DCanvas extends LitElementWithResizeMixin {
//   // @query(":host > canvas", false) canvas!: HTMLCanvasElement
//   // canvasRef: Ref = createRef<HTMLCanvasElement>()

//   @state() width!: number
//   @state() height!: number

//   /** Statem Id. */
//   @property({ type: String, reflect: false }) sid = uuidv4()

//   /** CSS(like) Selector for the main `d-canvas` element, this one is a helper view. */
//   @property({ type: String }) view?: string

//   /** Camera position in view mode. */
//   @property({ type: Array, attribute: "camera-position" }) cameraPosition?: [number, number, number]

//   private statem!: Store<CanvasStatem> & CanvasStatem

//   get cameraView() {
//     return !!this.view
//   }

//   private createState() {
//     // this.statem = statem(this.sid)
//     // @ts-ignore
//     // console.log(statem("myState"))
//     // this.statem.subscribe((state, old) => {
//     //   if (
//     //     // state.width !== old.width ||
//     //     // state.height !== old.height ||
//     //     state.fps !== old.fps ||
//     //     state.running !== old.running ||
//     //     state.offscreen !== old.offscreen
//     //   ) {
//     //     this.requestUpdate("state", state)
//     //   }
//     // })
//   }

//   // connectedCallback() {
//   //   super.connectedCallback()
//   //   // this.createState()

//   //   this.canvasCtrl = new CanvasController(this, this.statem, (detail) => {
//   //     /** Fires when the 3D canvas start rendering. */
//   //     this.dispatchEvent(
//   //       new CustomEvent<StartLoopingReturn>("start", {
//   //         bubbles: false,
//   //         cancelable: false,
//   //         composed: true,
//   //         detail,
//   //       })
//   //     )
//   //   })
//   // }

//   static styles = [
//     resizerStyles,
//     css`
//       :host {
//         display: block;
//         position: relative;
//         width: 100%;
//         height: 100%;
//         overflow: hidden;
//       }
//       :host(:not([running])) {
//         background: repeating-conic-gradient(from 0deg, transparent 0deg 90deg, #fff3 90deg 180deg) 50% 50%/2rem 2rem;
//         transition: background 100ms linear;
//       }
//       :host(:not([running]:hover)) {
//         background-size: 1.945rem 1.945rem;
//       }
//     `,
//   ]

//   startStop: RefOrCallback = async (canvas?: any) => {
//     if (canvas) {
//       await sleep(666)
//       const detail = startLooping({
//         canvas,
//         scene,
//         width: this.width,
//         height: this.height,
//         cameraPosition: this.cameraPosition,
//       })
//       // console.log(detail)
//       this.dispatchEvent(new CustomEvent("start", { bubbles: false, cancelable: false, composed: true, detail }))
//     }
//   }

//   canvasTemplate() {
//     // return html`<slot></slot><canvas ${ref(this.startStop)}></canvas>`
//   }

//   render() {
//     // return html` ${/*this.cameraView ? "" : this.toolbarTemplate()*/ ""} ${this.canvasTemplate()} `
//     // return html` ${this.toolbarTemplate()} ${this.canvasTemplate()} `
//     return when(true, () => html`<canvas ${ref(this.startStop)}></canvas>`)
//   }
// }
export {}
