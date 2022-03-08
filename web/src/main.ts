
import { startLooping } from "@depth/canvas"
import Page from "./pages/testplay"
import state from "./store"
// import { rendererState } from "@depth/statem"
import { sleep, useSingleton } from "@depth/misc"
import "@depth/ui/dist/canvas-toolbar"

const { singleton } = useSingleton()
singleton.set("rendererState", state)

// console.log("AAA")
// globalThis.state = state

// import "./main.css"

// console.log("BBB")

// await sleep(1100)
// console.log("CCC")
// Page()

// console.log("Local Store", store.state.useOffscreen)

// console.log("Hello, World!")
// const abc = "AABBCC"

// globalThis.abc = abc


document.querySelector("#ui")!.innerHTML = document.querySelector("#tpl-ui")!.innerHTML

// const toolbar = document.querySelector("canvas-toolbar")!
// toolbar.setAttribute("state", JSON.stringify(state.state))

state.subscribe(s => {
  console.log("MAIN", s.running)

  if (s.running) {
    startLooping({ canvas: document.querySelector("canvas")!, preferOffscreen: false })
  }
  // toolbar.setAttribute("state", JSON.stringify(state.state))
})

// // @ts-ignore
// // document.querySelector("#bb")!.setAttribute("x", state.running)
// document.querySelector("#bb")!.setAttribute("x", state)

const btnPlay = document.querySelector("#play")!
const btnStop = document.querySelector("#stop")!

btnPlay.addEventListener("click", () => {
  // state.dispatch("startLoop")
  // kk@ts-ignores
  state.running = true
  // document.querySelector("#bb")!.setAttribute("x", JSON.stringify(state))
  // state.txt = "OONN"
  // console.log(state.txt)
})
btnStop.addEventListener("click", () => {
  // state.txt = "OOFFFF"
  state.dispatch("stopLoop")
  // console.log(state.txt)
  // // document.querySelector("#bb")!.setAttribute("x", state)
})


export {
  // abc
}
