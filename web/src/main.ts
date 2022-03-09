import { canvasState } from "@depth/statem"
import { startLooping, stopLooping } from "@depth/canvas"
import { sleep } from "@depth/misc"
import "@depth/ui/dist/canvas-toolbar"
import Page from "./pages/testplay"

const tpl = document.querySelector("#tpl-ui")!
document.querySelector("#ui")!.innerHTML = tpl.innerHTML
tpl.parentNode?.removeChild(tpl)

await sleep(1100)
Page()

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

export {}
