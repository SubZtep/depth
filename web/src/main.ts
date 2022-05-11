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

const looperSID = "core"
const sm = statem(looperSID, {
  fps: Number.POSITIVE_INFINITY,
  dark: true,
})

Object.assign(globalThis, {
  setFPS: (fps: number) => (sm.fps = fps),
  toggleDark: () => (sm.dark = !sm.dark),
})

const looper = new Loop({
  sid: looperSID,
  cb: () => void console.log("Hello", Date.now()),
})
looper.start()

// statem("core").subscribe(({ fps }) => (looper.fps = fps))

const template = document.querySelector<HTMLTemplateElement>("#appTemplate")
const container = document.querySelector("#app")
container && template && container.replaceWith(template.content.cloneNode(true))
