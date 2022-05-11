// import testScene from "./canvas3ds/test-scene"
import { statem } from "@depth/statem"
import "./styles/main.css"
// import "@depth/ui"
import "@depth/wc"
import "./state"
import { Loop } from "@depth/core"
// import * as THREE from "three"

// statem("myState", {
//   bodybg: "",
// })

// const scene = new THREE.Scene()

// const canvasState = statem("666", {
//   running: true,
//   offscreen: false,
//   fps: Number.POSITIVE_INFINITY,
//   // width: this.clientWidth,
//   // height: this.clientHeight,
//   scene: scene.toJSON(),
// })!

globalThis.setFPS = (fps: number) => {
  statem("core").fps = fps
}

const looper = new Loop(statem("core").fps, () => void console.log("Hello", Date.now()))
looper.start()

statem("core").subscribe(({ fps }) => (looper.fps = fps))

document
  .querySelector("#app")!
  .replaceWith(document.querySelector<HTMLTemplateElement>("#appTemplate")!.content.cloneNode(true))
