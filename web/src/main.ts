
import { startLooping, stopLooping } from "@depth/canvas"
import { useSingleton } from "@depth/misc"
import "@depth/ui/dist/canvas-toolbar"
import state from "./store"

const { singleton } = useSingleton()
singleton.set("rendererState", state)

const tpl = document.querySelector("#tpl-ui")!
document.querySelector("#ui")!.innerHTML = tpl.innerHTML
tpl.parentNode?.removeChild(tpl)

// state.subscribe(s => {
//   if (s.running) {
//     startLooping({
//       canvas: document.querySelector("canvas")!,
//       preferOffscreen: s.preferOffscreen
//     })
//   } else {
//     stopLooping()
//   }
// })
state.subscribe((running, oldRunning) => {
  console.log({ running, oldRunning })
  // if (running) {
  //   startLooping({
  //     canvas: document.querySelector("canvas")!,
  //     preferOffscreen: s.preferOffscreen
  //   })
  // } else {
  //   stopLooping()
  // }
}, "running")

export {}
