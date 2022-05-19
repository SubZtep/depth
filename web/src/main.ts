import { setCssVar, setMarkup } from "@depth-lib/template"
import Loop from "@depth-lib/loop"
import { loopState } from "./state"
import "./styles/main.css"
import "@depth-wc/css3d-cube"
import "@depth-wc/statem-debug"
import "@depth-wc/svg-icon"

setMarkup("#app-template", "#app-placeholder")

const setRotation = setCssVar("css3d-cube")("--rotation")
let cx = 0

const loop = new Loop({
  autoStart: false,
  statem: loopState,
  callback: (delta) => {
    setRotation(`${(cx += 0.1 * delta)}deg`)
  },
})

Object.assign(globalThis, {
  loop,
})
