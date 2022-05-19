import { setCssVar, setMarkup } from "@depth/misc"
import { Loop } from "@depth/core"
import { loopState } from "./state"
import "./styles/main.css"
import "@depth/wc"

setMarkup("#app-template", "#app-placeholder")

const setRotation = setCssVar("d-cube")("--rotation")
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
