// import { canvasState, inputState } from "@depth/statem"
import { canvasState } from "@depth/statem"
import { startLooping, stopLooping } from "@depth/canvas"
import "@depth/ui/dist/canvas-toolbar"
import Page from "./pages/testplay"

const tpl = document.querySelector("#tpl-ui")!
document.querySelector("#ui")!.innerHTML = tpl.innerHTML
tpl.parentNode?.removeChild(tpl)
;(canvasState as any).subscribe(running => {
  if (running) {
    startLooping({
      canvas: document.querySelector("canvas#threejs")!,
      canvasState,
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

// if (window) {
//   window.addEventListener(
//     "keydown",
//     ({ code }: KeyboardEvent) => {
//       if (code === "Space") {
//         inputState.space = true
//       }
//     },
//     { passive: true }
//   )
//   window.addEventListener(
//     "keyup",
//     ({ code }: KeyboardEvent) => {
//       if (code === "Space") {
//         inputState.space = false
//       }
//     },
//     { passive: true }
//   )
// }

Page()

export {}
