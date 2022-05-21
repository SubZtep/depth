import { setCssVar, appendTemplateToContainer } from "@depth-lib/template"
import Loop from "@depth-lib/loop"
import { createWorld, tickWorld, createRigidBody } from "@depth-lib/physics"
import { loopState } from "./state"
import "./styles/main.css"
import "@depth-wc/css3d-cube"
import "@depth-wc/statem-debug"
import "@depth-wc/svg-icon"
import "@depth-wc/input"

appendTemplateToContainer("#app-template", "#app-container")

let cx = 0
const setRotation = setCssVar()("--rotation")
const setMatrix = setCssVar(".player")("--transform")

await createWorld()

const body = createRigidBody()

const loop = new Loop({
  autoStart: true,
  statem: loopState,
  callback: (delta) => {
    if (loopState.dark) delta *= -1
    setRotation(`${(cx += 0.1 * delta)}deg`)
    tickWorld()
    console.log(body.transform)
    setMatrix(`matrix(${"1"})`)
  },
})

Object.assign(globalThis, {
  loop,
})
