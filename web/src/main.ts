import { startLooping } from "../../lib/canvas/src/startup"
// import Page from "./pages/testplay"
import store from "./store"
import { sleep } from "@depth/misc"
import "./main.css"

console.log("AAA", store.state.useOffscreen)
startLooping({
  canvas: document.querySelector<HTMLCanvasElement>("#scene canvas")!,
  // preferOffscreen: false,
  state: store.state,
})

console.log("BBB")

await sleep(1100)
console.log("CCC")
// Page()

console.log("Local Store", store.state.useOffscreen)
