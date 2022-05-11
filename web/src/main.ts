import { cssProperty } from "@depth/misc"
import { Loop } from "@depth/core"
import { loopState } from "./state"
import "./init"

const setRotation = cssProperty("d-cube")("--rotation")
let cx = 0

new Loop({
  autoStart: true,
  statem: loopState,
  cb: (delta) => {
    setRotation(`${(cx += 0.1 * delta)}deg`)
  },
})
