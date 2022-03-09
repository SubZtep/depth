import { canvasState, inputState } from "@depth/statem"
import { startLooping, stopLooping } from "@depth/canvas"
// import { sleep, useSingleton } from "@depth/misc"
import "@depth/ui/dist/canvas-toolbar"
import Page from "./pages/testplay"

// const { singleton } = useSingleton()
// singleton.set("canvasState", canvasState)
// singleton.set("inputState", inputState)
// console.log("SINGLETONS")

const tpl = document.querySelector("#tpl-ui")!
document.querySelector("#ui")!.innerHTML = tpl.innerHTML
tpl.parentNode?.removeChild(tpl)

canvasState.subscribe(running => {
  if (running) {
    startLooping({
      canvas: document.querySelector("canvas")!,
      preferOffscreen: canvasState.preferOffscreen,
    })
  } else {
    stopLooping()
  }
}, "running")

// // PLAYER INPUT

// let did = false
// inputState.subscribe(async ({ space }) => {
//   if (!did) {
//     did = true
//     await sleep(1100)
//     Page()
//   }
// })

if (window) {
  window.addEventListener(
    "keydown",
    ({ code }: KeyboardEvent) => {
      if (code === "Space") {
        inputState.space = true
      }
    },
    { passive: true }
  )
  window.addEventListener(
    "keyup",
    ({ code }: KeyboardEvent) => {
      if (code === "Space") {
        inputState.space = false
      }
    },
    { passive: true }
  )
}

Page()

export {}
