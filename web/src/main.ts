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

Page()

export {}
