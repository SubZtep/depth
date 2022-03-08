
import { startLooping, stopLooping } from "@depth/canvas"
import { useSingleton } from "@depth/misc"
import "@depth/ui/dist/canvas-toolbar"
import state from "./store"

const { singleton } = useSingleton()
singleton.set("canvasState", state)

const tpl = document.querySelector("#tpl-ui")!
document.querySelector("#ui")!.innerHTML = tpl.innerHTML
tpl.parentNode?.removeChild(tpl)

state.subscribe(running => {
  if (running) {
    startLooping({
      canvas: document.querySelector("canvas")!,
      preferOffscreen: state.preferOffscreen
    })
  } else {
    stopLooping()
  }
}, "running")

export {}
