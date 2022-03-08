// // import { startLooping } from "../../lib/canvas/src/startup"
// import { startLooping } from "@depth/canvas"
import Page from "./pages/testplay"
import state from "./store"
// import { rendererState } from "@depth/statem"
import { sleep, useSingleton } from "@depth/misc"
import "@depth/ui/dist/canvas-toolbar"

const { singleton } = useSingleton()
singleton.set("rendererState", state)


// import "./main.css"

const btnPlay = document.querySelector("#play")!
const btnStop = document.querySelector("#stop")!

btnPlay.addEventListener("click", () => {
  // state.dispatch("startLoop")
  // @ts-ignore
  state.running = true
})
btnStop.addEventListener("click", () => {
  state.dispatch("stopLoop")
})


// console.log("BBB")

await sleep(1100)
// console.log("CCC")
Page()

// console.log("Local Store", store.state.useOffscreen)

// console.log("Hello, World!")

export {}
