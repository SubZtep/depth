import { setCssVar, appendTemplateToContainer } from "@depth-lib/template"
import Loop from "@depth-lib/loop"
import { loopState } from "./state"
import "./styles/main.css"
import "@depth-wc/css3d-cube"
import "@depth-wc/statem-debug"
import "@depth-wc/svg-icon"
import "@depth-wc/input"

appendTemplateToContainer("#app-template", "#app-container")

const setRotation = setCssVar()("--rotation")
let cx = 0

const loop = new Loop({
  autoStart: true,
  statem: loopState,
  callback: (delta) => {
    if (loopState.dark) delta *= -1
    setRotation(`${(cx += 0.1 * delta)}deg`)
  },
})

Object.assign(globalThis, {
  loop,
})
