// // import { startLooping } from "../../lib/canvas/src/startup"
// import { startLooping } from "@depth/canvas"
import Page from "./pages/testplay"
// import store from "./store"
// import { rendererState } from "@depth/statem"
import { sleep, useSingleton } from "@depth/misc"
// import { CanvasToolbar } from "@depth/ui"
import "@depth/ui/dist/canvas-toolbar"
import state from "./states/renderer"

// const store = rendererState()
// console.log("SSS", state)

const { singleton } = useSingleton()
singleton.set("rendererState", state)


// rendererState.dispatch("startLoop")

// import "./main.css"
// import Statem from "@depth/statem"

// const store = new rendererState()
// store.subscribe(state => {
//   console.log("state changed", state)

//   if (state.running) {
//     startLooping({
//       canvas: document.querySelector<HTMLCanvasElement>("#scene canvas")!,
//       preferOffscreen: true,
//       state: store.state,
//     })
//   } else {
//     alert("Boo")
//   }
// })

// // ui

// const initialState = {
//   running: false,
//   antialias: false,
//   preferOffscreen: true,
// }

// const actions = {
//   //
// }

// const mutations = {
//   //
// }

const btnPlay = document.querySelector("#play")!
const btnStop = document.querySelector("#stop")!

btnPlay.addEventListener("click", () => {
  state.dispatch("startLoop")
})
btnStop.addEventListener("click", () => {
  state.dispatch("stopLoop")
})

// // console.log("AAA", store.state.useOffscreen)
// startLooping({
//   canvas: document.querySelector<HTMLCanvasElement>("#scene canvas")!,
//   preferOffscreen: true,
//   state: store.state,
// })

// console.log("BBB")

await sleep(1100)
// console.log("CCC")
Page()

// console.log("Local Store", store.state.useOffscreen)

// console.log("Hello, World!")

export {}
